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
  import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
  import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
  import Accordion from '@material-ui/core/Accordion';

import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Checkbox from '@material-ui/core/Checkbox';
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
import Creatable from 'react-select/creatable';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5vee/build/ckeditor';
import LinearProgress from '@material-ui/core/LinearProgress';

// import ClassicEditor from 'ckeditor5-classic-with-mathtype';

import axios from 'axios'
const baseUrl = window.Laravel.baseUrl;

const promptTextCreator = (value) => {
    return 'Tạo mới '+value
}

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
            edit: false,
            columns: [
                {
                    title: "",
                    field: "action",
                    filtering: false,
                    disableClick: true,
                    sorting: false,
                    headerStyle: {
                        padding: '0px',
                        width: '10px',
                        width: '90px',
                },
                cellStyle: {
                    width: '90px',
                    width: '10px',
                    padding: '0px',
                },
                render: rowData => (
                    <div style = {{display: 'block'}}>
                        {/* {rowData.tableData.id} */}
                        <Tooltip title="Chỉnh sửa" arrow>
                            <IconButton onClick={() => {this.editDocuments(rowData)}}>
                            <EditOutlinedIcon fontSize='inherit' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa" arrow>
                            <IconButton onClick={() => {
                            if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                                this.deleteDocuments(rowData)}
                            }>
                            <DeleteForeverIcon fontSize='inherit' />
                            </IconButton>
                        </Tooltip>                                
                    </div>
                )
                },
                { title: 'Môn', field: 'major' ,  
                    lookup: { 'Toán':'Toán', 'Văn': 'Văn', 'Tiếng việt': 'Tiếng việt', 'Anh':'Anh', 'Lý':'Lý', 'Hoá':'Hoá' }, 
                    headerStyle: {
                        padding: '0px',
                        width: '50px',
                        fontWeight: '600',
                    },  
                    cellStyle: {
                        padding: '0px 8px 0px 0px',
                        width: '50px',
                    },
                },
                { title: 'Khối', field: 'grade' , 
                    lookup: { '1':'1', '2': '2', '3': '3', '4':'4', '5':'5', '6':'6','7':'7','8':'8','9':'9','10':'10','11':'11', '12':'12' },
                    headerStyle: {
                        padding: '0px',
                        width: '90px',
                        fontWeight: '600',
                    },  
                    cellStyle: {
                        padding: '0px 8px 0px 0px',
                        width: '90px',
                    },  },
                { title: 'Chuyên đề', field: 'topic', 
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },  
                    cellStyle: {
                        padding: '0px 8px 0px 0px',
                    },},
                { title: 'Dạng bài', field: 'tag', 
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },  
                    cellStyle: {
                        padding: '0px 8px 0px 0px',
                },},
                { title: 'Loại', field: 'type',  
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },  
                    cellStyle: {
                        padding: '0px 8px 0px 0px',
                    },},
                { title: 'Độ khó', field: 'level', 
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },  
                    cellStyle: {
                        padding: '0px 8px 0px 0px',
                    },
                },
                
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never',
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },  
                    cellStyle: {
                        padding: '0px 8px 0px 0px',
                    },    
            },            
            ],
            data: [],
            c: 10000,
            expanded: 'panel1',
            topics: [],
            relateds: [],
            major: '',
            question: '',
            answer: '',
            grade: '',
            topic: '',
            related: '',
            type: '',
            level: 10,
            selected_id:'',
            loading: false,
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
        this.setState({loading: true})
        axios.post(window.Laravel.baseUrl + "/documents/get")
            .then(response => {
                let tp = response.data.topic.map(t => {return {value: t, label: t}})
                let tag = response.data.relateds.map(t => {return {value: t, label: t}})
                this.setState({
                    data: response.data.all,
                    topics: tp,
                    relateds: tag,
                    loading: false,
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }
    
    componentDidMount(){
        this.getDocuments()
    }
    cancelEdit = () => {
        this.setState({
            major: '',
            question: '',
            answer: '',
            grade: '',
            topic: '',
            related: '',
            type: '',
            level: 10,
            edit: false,
            selected_id: '',
        })
    }
    editDocuments = (oldData) => {
        let tags = oldData.tag.split(';').map(t => {return {label: t, value: t}})
        this.setState({
            major: oldData.major,
            question: (oldData.question)?oldData.question:'',
            answer: (oldData.answer)?oldData.answer:'',
            grade: oldData.grade,
            topic: {label: oldData.topic, value: oldData.topic},
            related: tags,
            type: oldData.type,
            level: oldData.level,
            selected_id: oldData.id,
            edit: true,
        })
    }
    
    deleteDocuments = (oldData) => {
        return axios.post(baseUrl+ '/documents/delete', {id: oldData.id})
            .then(response => {
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
        console.log(e.target.name)
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
    handleTopicChange = (value) => {
        this.setState({topic: value})
    }
    handleRelatedChange = (value) => {
        this.setState({related: value})
    }
    handleSave = () => {
        this.setState({loading: true})
        axios.post('/documents/create', { state: this.state })
            .then(response => {
                this.getDocuments()
                this.setState({loading: false})
            })
            .catch(err => {

            })
    }
    handleCreate = () => {
        this.setState({loading: true, edit: false})
        axios.post('/documents/create', { state: this.state })
            .then(response => {
                this.getDocuments()
                this.setState({loading: false})
            })
            .catch(err => {

            })
    }
    render(){ 
        return(
            <div className="root-setting-documents">
                {this.state.loading ? <LinearProgress />: ""}
                <Accordion expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-label="Expand"
                        aria-controls="additional-actions1-content"
                        id="additional-actions1-header"
                    >
                        <span 
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                        >
                            FORM TẠO MỚI - SỬA KHI BÀI TẬP
                        </span>
                    </AccordionSummary>
                    <AccordionDetails>
                       <Grid container spacing={1}>
                            <Grid item md={1} xs={12}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Môn</InputLabel>
                                    <Select
                                        native
                                        value={this.state.major}
                                        onChange={this.onChange}
                                        label="Môn học"
                                        name = "major"
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={'Toán'}>Toán</option>
                                        <option value={'Văn'}>Văn</option>
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
                                        value={this.state.grade}
                                        onChange={this.onChange}
                                        name="grade"
                                        label="Khối"
                                        name = "grade"
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
                                <Creatable 
                                    options={this.state.topics}
                                    autosize={true}
                                    placeholder={'Chuyên đề'}
                                    onChange={this.handleTopicChange}
                                    value={this.state.topic}
                                    formatCreateLabel={promptTextCreator} 
                                    className="select-box"    
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <Creatable 
                                    isMulti
                                    options={this.state.relateds}
                                    autosize={true}
                                    placeholder={'Kiến thức liên quan'}
                                    onChange={this.handleRelatedChange}
                                    name="related"
                                    value={this.state.related}
                                    formatCreateLabel={promptTextCreator} 
                                    className="select-box"    
                                />
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Loại bài</InputLabel>
                                    <Select
                                        native
                                        value={this.state.type}
                                        onChange={this.onChange}
                                        label="Loại bài"
                                        name = "type"
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={'Tự luận'}>Tự luận</option>
                                        <option value={'Trắc nghiệm'}>Trắc nghiệm</option>
                                        <option value={'Khác'}>Khác</option>                                        
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Độ khó</InputLabel>
                                    <Select
                                        native
                                        value={this.state.level}
                                        onChange={this.onChange}
                                        label="Độ khó"
                                        name = "level"
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
                        {this.state.edit ? <Button className="btn" variant="contained" color="primary" onClick={this.handleCreate}>Tạo mới</Button>: ""}
                        <Button className="btn" variant="contained" color="primary" onClick={this.handleSave}>Lưu</Button>
                        <Button className="btn" variant="contained"  onClick={this.cancelEdit}>Huỷ</Button>
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
                        filtering: true,
                        exportButton: true,
                        
                        filterCellStyle: {
                            paddingLeft: '0px'
                          }
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
                    detailPanel={rowData => {                        
                        return(
                            <Grid container spacing={2}>
                                <Grid item md={6} sm={12}>
                                    <h5> Câu hỏi </h5>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            toolbar: {
                                                items: [
                                                    
                                                ]
                                            },
                                        }}
                                        data= {rowData.question}
                                    />
                                </Grid>
                                <Grid item md={6} sm={12}>
                                    <h5> Đáp án </h5>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            toolbar: {
                                                items: [
                                                    
                                                ]
                                            },
                                        }}
                                        data= {rowData.answer}
                                    />
                                </Grid>
                            </Grid>

                        )
                      }}
                />
                
            </div>
        );
    }
}

