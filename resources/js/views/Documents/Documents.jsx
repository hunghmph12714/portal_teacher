import React from 'react';
import './Document.scss'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

import {
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
    Select,
    Tooltip, Paper,
    InputLabel
  } from "@material-ui/core";

  import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MaterialTable from "material-table";
import {MTableAction} from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icofont from "react-icofont";
import NumberFormat from 'react-number-format';
import { TwitterPicker } from 'react-color';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { throttle } from "lodash";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5vee/build/ckeditor';
// import ClassicEditor from 'ckeditor5-classic-with-mathtype';

import axios from 'axios'
const baseUrl = window.Laravel.baseUrl;
const wait = 1000; // milliseconds

const promptTextCreator = (value) => {
    return 'Tạo mới '+value
}
const findSchools = (inputValue) => {
    return axios.get(baseUrl + '/school/find/' + inputValue)
        .then(response => {
            return  response.data.map(school => { return {label: school.name, value: school.id} })
        })
        .catch(err => {
            console.log('get schools bug' + err.response.data)
        })
}
const loadOptions = (type, inputValue) => {            
    if(type == 'topic'){
        return findSchools(inputValue)
    }
};        
const debouncedLoadOptions = throttle(loadOptions, wait)

function NumberFormatCustom(props) {
    const { inputRef, onChange, name, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        name: name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix="đ"
        />
    );
}
export default class Documents extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Quy trình', field: 'type' ,  
                    lookup: { 'Quy trình đầu vào':'Tuyển sinh đầu vào' ,'Quy trình kiểm tra/thi thử':'Quy trình kiểm tra/thi thử',
                    'Quy trình tuyển dụng':'Tuyển dụng nhân sự','Quy trình hoàn trả học phí':'Quy trình hoàn trả học phí','Quy trình học bù/ phụ đạo':'Quy trình học bù/ phụ đạo' }, 
                },
                { title: 'Thứ tự', field: 'order' , type:'numeric', 
                    render: rowData => {
                        return (
                            <span>Bước {rowData.order}</span>
                        )
                    }
                },
                { title: 'Tên', field: 'name' },
                { title: 'Thời gian (ngày)', field: 'duration', type:'numeric', 
                    render: rowData => {
                        return (
                            <span>{rowData.duration} ngày</span>
                        )
                    }
                },
                { title: 'Giấy tờ', field: 'document', 
                    render: rowData => {
                        return (
                            <Button variant="contained" color="secondary" disabled={!rowData.document} onClick = {() => {window.open(rowData.document, '_blank')}}>
                                XEM
                            </Button>
                        )
                    }
                },
                
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never' },               
            ],
            data: [],
            c: 10000,
            expanded: 'panel1',

            major: '',
            question: "",
            answer: "",
            grade: '',
            topic: '',
            related: '',
            level: 10,
        }
    }
    successNotification = (successMessage) => {
        store.addNotification({
          title: 'Thành công',
          message: successMessage,
          type: 'success',                         // 'default', 'success', 'info', 'warning'
          container: 'bottom-right',                // where to position the notifications
          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
          width: 300,
          dismiss: {
            duration: 3000
          }
        })
    }
    errorNotification = (errorMessage) => {
        store.addNotification({
          title: 'Có lỗi',
          message: errorMessage,
          type: 'danger',                         // 'default', 'success', 'info', 'warning'
          container: 'bottom-right',                // where to position the notifications
          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
          width: 300,
          dismiss: {
            duration: 3000
          }
        })
    }

    getDocuments = () =>{
        axios.post(window.Laravel.baseUrl + "/documents/get", {type: -1})
            .then(response => {
                this.setState({
                    data: response.data
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }
    
    componentDidMount(){
        this.getDocuments()
    }
    addNewDocuments = (newData) => {        
        return axios.post(baseUrl + '/documents/create', newData)
            .then((response) => {
                this.successNotification('Thêm thành công')
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.push(response.data);
                    return { ...prevState, data };
                    });
            })
            .catch(err => {
                console.log("Add new center bug: "+ err)
            })
    }
    editDocuments = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/documents/edit', req)
            .then(response => {
                console.log(response)
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data[oldData.tableData.id] = newData;
                    return { ...prevState, data };
                });
                this.successNotification('Sửa thành công')
            })
            .then(err => {
                console.log(err)
            })
    }
    deleteDocuments = (oldData) => {
        return axios.post(baseUrl+ '/documents/delete', {id: oldData.id})
            .then(response => {
                this.successNotification('Xóa thành công')
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                this.props.errorNotification('Có lỗi')
                console.log('delete Center bug: ' + err)
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleChange = (panel) => (event, isExpanded) => {
        this.setState({
            expanded : isExpanded ? panel : false
        })
    };
    onMajorChange = (e) => {
        this.setState({major: e.target.value})
    }
    render(){
        return(
            <div className="root-setting-documents">
                <Accordion expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        Tạo mới
                    </AccordionSummary>
                    <AccordionDetails>

                       <Grid container spacing={1}>
                            <Grid item md={1} xs={12}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Môn</InputLabel>
                                    <Select
                                        native
                                        value={this.state.major}
                                        onChange={this.onMajorChange}
                                        label="Môn học"
                                        inputProps={{
                                            name: 'Môn học',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={'Toán'}>Toán</option>
                                        <option value={'Văn'}>Văn</option>
                                        <option value={'Tiếng Việt'}>Tiếng Việt</option>
                                        <option value={'Anh'}>Anh</option>
                                        <option value={'Lý'}>Lý</option>
                                        <option value={'Hoá'}>Hoá</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Khối</InputLabel>
                                    <Select
                                        native
                                        value={this.state.major}
                                        onChange={this.onMajorChange}
                                        label="Môn học"
                                        inputProps={{
                                            name: 'Môn học',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                        <option value={9}>9</option>
                                        <option value={10}>10</option>
                                        <option value={11}>11</option>
                                        <option value={12}>12</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <AsyncCreatableSelect 
                                    cacheOptions
                                    autosize={true}
                                    loadOptions={inputValue => debouncedLoadOptions('topic',inputValue)}
                                    placeholder={'Chuyên đề'}
                                    onChange={this.handleTopicChange}
                                    name="topic"
                                    value={this.state.topic}
                                    formatCreateLabel={promptTextCreator} 
                                    className="select-box"    
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <AsyncCreatableSelect 
                                    isMulti
                                    cacheOptions
                                    autosize={true}
                                    loadOptions={inputValue => debouncedLoadOptions('topic',inputValue)}
                                    placeholder={'Kiến thức liên quan'}
                                    onChange={this.handleTopicChange}
                                    name="topic"
                                    value={this.state.topic}
                                    formatCreateLabel={promptTextCreator} 
                                    className="select-box"    
                                />
                            </Grid>
                            <Grid item md={2} xs={12}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Độ khó</InputLabel>
                                    <Select
                                        native
                                        value={this.state.major}
                                        onChange={this.onMajorChange}
                                        label="Độ khó"
                                        inputProps={{
                                            name: 'Độ khó',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                        <option value={9}>9</option>
                                        <option value={10}>10</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <div className="question">
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    toolbar: {
                                        items: [
                                            'heading', 'MathType', 'ChemType',
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'imageUpload',
                                            'mediaEmbed',
                                            'insertTable',
                                            'blockQuote',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                }}
                                data= {this.state.question}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    // console.log( 'Editor is ready to use!', editor );
                                }}
                                onChange={ ( event, editor ) => {
                                    this.setState({question: editor.getData()})
                                } }
                            />
                        </div>
                        <div className="answer">
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    toolbar: {
                                        items: [
                                            'heading', 'MathType', 'ChemType',
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'imageUpload',
                                            'mediaEmbed',
                                            'insertTable',
                                            'blockQuote',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                }}
                                data= {this.state.answer}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    // console.log( 'Editor is ready to use!', editor );
                                }}
                                onChange={ ( event, editor ) => {
                                    this.setState({answer: editor.getData()})
                                } }
                            />
                        </div>
                        
                    </AccordionDetails>
                </Accordion>
                <ReactNotification />
                <MaterialTable
                    title="Tài liệu"
                    columns={this.state.columns}
                    data={this.state.data}
                    options = {{
                        grouping: true,
                        pageSize: 10,
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewDocuments(newData) ,
                        onRowUpdate: (newData, oldData) => this.editDocuments(oldData, newData),
                        onRowDelete: oldData => this.deleteDocuments(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy quy trình',
                          editRow:{
                            deleteText: 'Bạn có chắc muốn xóa dòng này ?',
                            cancelTooltip: 'Đóng',
                            saveTooltip: 'Lưu'
                          },
                          deleteTooltip: "Xóa",
                          addTooltip: "Thêm mới"
                        },
                        toolbar: {
                          searchTooltip: 'Tìm kiếm',
                          searchPlaceholder: 'Tìm kiếm',
                          nRowsSelected: '{0} hàng được chọn'
                        },
                        pagination: {
                          labelRowsSelect: 'dòng',
                          labelDisplayedRows: ' {from}-{to} của {count}',
                          firstTooltip: 'Trang đầu tiên',
                          previousTooltip: 'Trang trước',
                          nextTooltip: 'Trang tiếp theo',
                          lastTooltip: 'Trang cuối cùng'
                        }
                    }}
                />
                
            </div>
        );
    }
}

