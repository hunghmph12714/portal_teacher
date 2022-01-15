import React from 'react';
import './Document.scss'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { withSnackbar } from 'notistack'
import {DropzoneArea} from 'material-ui-dropzone'

import {
    Grid,
    IconButton,
    Button,
    FormControl,
    Select,
    Tooltip,
    InputLabel
  } from "@material-ui/core";
  import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
  import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
  import Accordion from '@material-ui/core/Accordion';
  import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
  import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import MaterialTable from "material-table";
import NumberFormat from 'react-number-format';
import Creatable from 'react-select/creatable';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5lmsvee/build/ckeditor';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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
const columns = [
                
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
    
    { title: 'Ngày tạo', field: 'created_at_formated' , editable: 'never',
        headerStyle: {
            padding: '0px',
            fontWeight: '600',
        },  
        cellStyle: {
            padding: '0px 8px 0px 0px',
        },
    },            
    { title: 'Người tạo', field: 'name' , editable: 'never',
        headerStyle: {
            padding: '0px',
            fontWeight: '600',
        },  
        cellStyle: {
            padding: '0px 8px 0px 0px',
        },
    },            
    { title: 'Trạng thái', field: 'status' , editable: 'never',
        headerStyle: {
            padding: '0px',
            fontWeight: '600',
        },  
        cellStyle: {
            padding: '0px 8px 0px 0px',
        },
    },            
]
class Documents extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            edit: false,            
            checkedB: false,
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
            upload_document: [],
            upload_preview: [],
            upload_answer: []
        }
    }
    handleDocumentUpload = (doc) => {
        let upload = [];
        if(doc.length == 0){
            this.setState({upload_document: []})
        }
        for(let i = 0; i< doc.length; i++){
            var reader = new FileReader();
            // reader.onload = function(e){
            reader.readAsDataURL(doc[i]);            
    
            // }
            reader.onloadend = function (e) {
                upload.push({file: doc[i], data: e.target.result, answer:[]})
                this.setState({
                    upload_document: upload,
                })
            }.bind(this);
        }    
        // this.setState({ upload_document: doc })
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
    confirmDocument = (oldData) => {
        axios.post(baseUrl + '/documents/confirm', {id: oldData.id})    
            .then(response => {
                this.setState(prevState => {
                    let data = [...prevState.data];
                    data = data.map(d => {
                        if(d.id == oldData.id){
                            d.status = 'Đã duyệt'
                        }
                        return d;
                    })
                    return { ...prevState, data };
                });
                this.props.enqueueSnackbar('Duyệt thành công', {variant: 'success'})
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'})
            })
    }
    reportDocument = (oldData) => {
        axios.post(baseUrl + '/documents/report', {id: oldData.id})    
            .then(response => {
                this.setState(prevState => {
                    let data = [...prevState.data];
                    data = data.map(d => {
                        if(d.id == oldData.id){
                            d.status = 'Sai đáp án'
                        }
                        return d;
                    })
                    return { ...prevState, data };
                });
                this.props.enqueueSnackbar('Báo cáo thành công', {variant: 'success'})
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'})
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
                this.props.enqueueSnackbar('Xoá thành công', {variant: 'success'})
            })
            .catch(err => {
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
                this.props.enqueueSnackbar('Lưu thành công', {variant: 'success'})
            })
            .catch(err => {

            })
    }
    handleCreate = () => {
        
        axios.post('/documents/create', { state: this.state })
            .then(response => {
                this.getDocuments()
                this.setState({loading: false})
                this.props.enqueueSnackbar('Lưu thành công', {variant: 'success'})
            })
            .catch(err => {

            })
    }
    handleBundleCreate = () => {
        this.setState({loading: true})
        let fd = new FormData()
        let count = []
        for(let i = 0; i < this.state.upload_document.length; i++){
            fd.append('document'+i, this.state.upload_document[i].file, this.state.upload_document[i].file.name)
            for(let j = 0; j< this.state.upload_document[i].answer.length; j++){
                fd.append('answer'+i+'_'+j, this.state.upload_document[i].answer[j], this.state.upload_document[i].answer[j].name)
            }
            count.push(this.state.upload_document[i].answer.length)  
        }
        fd.append('count', count)
        fd.append('major', this.state.major)
        fd.append('grade', this.state.grade)
        fd.append('topic', JSON.stringify(this.state.topic))
        fd.append('related', JSON.stringify(this.state.related))
        fd.append('tag', this.state.tag)
        fd.append('type', this.state.type)
        fd.append('level', this.state.level)
        axios.post('/documents/bulk-create', fd)
            .then(r => {
                this.getDocuments()
                this.setState({loading: false})
                this.props.enqueueSnackbar('Lưu thành công', {variant: 'success'})
            })
            .catch(err => {

            })

    }
    handleCheckChange = () => {        
        this.setState({ checkedB: !this.state.checkedB })
        if(this.state.checkedB){
            this.setState({upload_document: []})
        }
    }
    handleExerciceUpload = (exercices, index) => {
        this.setState(prevState => {
            let upload_document = [...prevState.upload_document];
            upload_document[index].answer = exercices
            return {...prevState, upload_document}
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
                        <FormControlLabel
                            control={
                            <Switch
                                checked={this.state.checkedB}
                                onChange={this.handleCheckChange}
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label="Thêm ảnh hàng loạt"
                            onClick={e => {e.stopPropagation()}}

                        />
                    </AccordionSummary>
                
                    <AccordionDetails>
                       <Grid container spacing={1}>
                            <Grid item md={1} xs={12}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Môn học</InputLabel>
                                    <Select
                                        native
                                        value={this.state.major}
                                        onChange={this.onChange}
                                        label="Môn học"
                                        name = "major"
                                    >
                                        <option aria-label="None" value="" />
                                        <option value={'Toán'}>Toán</option>
                                        <option value={'Tiếng Việt'}>Tiếng Việt/Văn</option>
                                        <option value={'Tiếng Anh'}>Tiếng Anh</option>
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
                                    placeholder={'Chuyên đề(*)'}
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
                                    <InputLabel htmlFor="outlined-age-native-simple">Loại bài(*)</InputLabel>
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
                                    <InputLabel htmlFor="outlined-age-native-simple">Độ khó(*)</InputLabel>
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
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {this.state.checkedB ? (
                            <div>
                                <div className = 'upload'>
                                    <DropzoneArea 
                                        onChange={this.handleDocumentUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {20}
                                        initialFiles= {[]}
                                        maxFileSize = {10000000}
                                        clearOnUnmount                                
                                        dropzoneText = "Kéo thả đề baì(Ảnh, PDF, Word)"
                                    />
                                </div>
                                <div>
                                    {this.state.upload_document.map((d, index) => {
                                        return (
                                            <Grid container spacing={2}>
                                                <Grid item md={6}>
                                                    <img src={d.data}/>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <DropzoneArea 
                                                        onChange={loadedFiles => this.handleExerciceUpload(loadedFiles, index)}
                                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                                        filesLimit = {20}
                                                        initialFiles= {[]}
                                                        maxFileSize = {10000000}
                                                        clearOnUnmount
                                                        showPreviews={false}                                                
                                                        dropzoneText = "Kéo thả đáp án(Ảnh, PDF, Word)"
                                                    />
                                                </Grid>
                                            </Grid>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="question">
                                    {/* <CKEditor
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
                                    /> */}
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
                            </div>
                        )
                        }
                       
                        {this.state.edit&&!this.state.checkedB ? <Button className="btn" variant="contained" color="primary" onClick={this.handleCreate}>Tạo mới</Button>: ""}
                        {this.state.checkedB ? <Button className="btn" variant="contained" color="primary" onClick={this.handleBundleCreate}>Tạo mới</Button>: <Button className="btn" variant="contained" color="primary" onClick={this.handleSave}>Lưu</Button>}
                        
                        <Button className="btn" variant="contained"  onClick={this.cancelEdit}>Huỷ</Button>
                    </AccordionDetails>
                
                </Accordion>
                <ReactNotification />
                <MaterialTable
                    title="Tài liệu"
                    columns={columns}
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
                    actions={[                 
                        {
                            icon: () => <EditOutlinedIcon />,
                            tooltip: 'Sửa',
                            isFreeAction: false,
                            text: 'Sửa',
                            onClick: (event, rowData) => {this.editDocuments(rowData)},
                        },
                        {
                            icon: () => <DeleteForeverIcon />,
                            tooltip: 'Xoá',
                            isFreeAction: false,
                            text: 'Xoá',
                            onClick: (event, rowData) => {
                                if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) {
                                    this.deleteDocuments(rowData)
                                }
                                    
                            }
                        }, 
                        {
                            icon: () => <DoneAllOutlinedIcon />,
                            tooltip: 'Duyệt',
                            isFreeAction: false,
                            text: 'Xoá',
                            onClick: (event, rowData) => { this.confirmDocument(rowData)    
                            }
                        }, 
                        {
                            icon: () => <ErrorOutlinedIcon />,
                            tooltip: 'Báo sai',
                            isFreeAction: false,
                            text: 'Báo sai',
                            onClick: (event, rowData) => { this.reportDocument(rowData)    
                            }
                        }, 
                    ]}

                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy bài tập',
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
export default withSnackbar(Documents)

