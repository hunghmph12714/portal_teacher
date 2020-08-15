import React, {useState, useEffect} from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from "react-select";
import {DropzoneArea} from 'material-ui-dropzone'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';

import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';
import {
    KeyboardTimePicker,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import  DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {format, subDays } from 'date-fns';
import vi from "date-fns/locale/vi";

import NumberFormat from 'react-number-format';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';
const baseUrl = window.Laravel.baseUrl
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
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
      />
    );
  }
  
const CenterSelect = React.memo(props => {
    const [centers, setCenters] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/get-center')
            setCenters(r.data.map(center => {
                    return {label: center.name, value: center.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select className = "select-box"
            className="select-box"
            key = "center-select"
            value = {props.center}
            name = "center"
            placeholder="Cơ sở"
            options={centers}
            onChange={props.handleChange}
        />)
})
const TeacherSelect = React.memo(props => {
    const [teachers, setTeacher] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/get-teacher')
            setTeacher(r.data.map(center => {
                    return {label: center.name, value: center.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select className = "select-box"
            className="select-box"
            key = "center-select"
            value = {props.teacher}
            name = "teacher"
            placeholder="Giáo viên"
            options={teachers}
            onChange={props.handleChange}
        />)
}) 
class DialogSession extends React.Component {
    constructor(props){
        super(props)      
        this.state = {
            student_involved: false,
            transaction_involved: false,
            room: "",
            from_date: new Date(),
            to_date: null,
            teacher: "",
            note: "",
            document: [],
            old_document: [],
            exercice: [],
            old_exercice: [],
            fee: "",
            centers : [],
            center: '',
            teachers: [],
            rooms: [],
            btvn_content: '',
            content: '',
            status: ['Khởi tạo','Đã tạo công nợ','Đã diễn ra','Đã đóng'],
        }  
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        //d
        let s = nextProps.session
        this.getRoom(nextProps.session.ctid)
        this.setState({
            room : {label: s.rname, value: s.rid},
            center : {label: s.ctname, value: s.ctid},
            from_date: (s.from_full) ? new Date(s.from_full) : new Date(),
            to_date: (s.to_full) ? new Date(s.to_full) : new Date(),
            note: s.note ? s.note : '',
            teacher: { label: s.tname, value: s.tid},
            fee: s.fee,
            btvn_content: (s.btvn_content)?s.btvn_content:'',
            content: (s.content) ? s.content: '',
            document: [],
            exercice: [],
            old_document: (s.document) ? s.document.split(',') : [],
            old_exercice: (s.exercice) ? s.exercice.split(',') : [],
            
        })
    }    
   
    getRoom = (center_id) => {
        axios.get(window.Laravel.baseUrl + '/get-room/'+ center_id)
            .then(response => {
                this.setState({
                    rooms: response.data.map(r => {
                        return {value: r.id, label: r.name}
                    })
                })
            })
            .catch(err => {
                console.log('room bug: ' + err)
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    
    handleCenterChange = (center)=> {
        this.setState({ center: center })
        this.getRoom(center.value)
    }
    
    handleDateChange = date => {
        this.setState({ open_date: date });
    };   
    
    handleFromDate = date => {
        //Check exist session date
        var d = date.getTime()
        axios.post(baseUrl+'/session/check-date', {date: d/1000})
            .then(response => {
                if(!response.data.result){
                    this.props.enqueueSnackbar('Buổi học đã tồn tại', { 
                        variant: 'warning',
                    })
                }
                this.setState({ 
                    from_date: date, 
                    to_date: (this.state.to_date)?this.state.to_date:date
                });
            })
            .catch(err => {
                console.log(err)
            })
        
    }    
    handleToDate = date => {
        this.setState({ 
            to_date : date, 
            from_date: (this.state.from_date)?this.state.from_date:date });
    }
    handleRoomChange = room => {
        this.setState({room: room})
    }
    handleChangeTeacher = teacher => {
        this.setState({teacher: teacher})
    } 
    handleDocumentUpload = doc => {
        this.setState({document : doc})
    }
    handleExerciceUpload = exercice => {
        this.setState({exercice: exercice})
    }
    handleAddNewSession = () => {
        
    }
    handleCheckBoxChange = (e) => {
        this.setState({
            [e.target.name] : !this.state[e.target.name]
        })
    }
    deleteExercice = (doc, e) => {
        e.preventDefault();
        let old = this.state.old_exercice
        old = old.filter(e => e != doc)
        this.setState({
            old_exercice: old
        })
    }
    deleteDocument = (doc, e) => {
        e.preventDefault();
        this.setState(prevState => {
            let old_document = prevState.old_document
            old_document = old_document.filter(e => e != doc)
            return {...prevState, old_document}
        })
    }
    handleAddSession = (e) => {
        e.preventDefault();
        let fd = new FormData()
        for(let i = 0 ; i < this.state.document.length ; i++){
            fd.append('document'+i , this.state.document[i], this.state.document[i].name)
        }
        for(let j = 0 ; j < this.state.exercice.length ; j++){
            fd.append('exercice' + j, this.state.exercice[j], this.state.exercice[j].name)
        }
        fd.append('document_count', this.state.document.length)
        fd.append('exercice_count', this.state.exercice.length)
        fd.append('center_id', this.state.center.value)
        fd.append('class_id', this.props.class_id)
        fd.append('room_id', (this.state.room.value)?this.state.room.value:0)
        fd.append('from_date', this.state.from_date.getTime()/1000)
        fd.append('to_date', this.state.to_date.getTime()/1000)
        fd.append('teacher_id', (this.state.teacher.value)?this.state.teacher.value:0)
        fd.append('note', this.state.note)
        fd.append('fee', this.state.fee)
        fd.append('student_involved', this.state.student_involved)
        fd.append('transaction_involved', this.state.transaction_involved)
        fd.append('btvn_content', this.state.btvn_content)
        fd.append('content', this.state.content)
        
        if(this.props.dialogType == 'create'){
            axios.post(baseUrl+'/session/add', fd)
            .then(response => {
                this.props.enqueueSnackbar('Thêm buổi học thành công', {
                    variant: 'success'
                })
                this.props.handleCloseDialog()
            })
            .catch(err => {
                console.log(err)
            })
        
        }
        if(this.props.dialogType == 'edit'){
            fd.append('old_exercice', this.state.old_exercice.join(','))
            fd.append('old_document', this.state.old_document.join(','))
            fd.append('ss_id', this.props.session.sid)
            axios.post(baseUrl +'/session/edit' , fd)
                .then(response => {
                    this.props.enqueueSnackbar('Sửa buổi học thành công', {
                        variant: 'success'
                    })
                    this.props.handleCloseDialog()
                })
                .catch(err => {
                    
                })
        }
        
    }

    render(){
        return (
            <Dialog 
                fullWidth 
                TransitionComponent={Transition}
                keepMounted
                maxWidth='xl'
                scroll='paper'
                open={this.props.open} onClose={this.props.handleCloseDialog} aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{
                    this.props.dialogType == "create" ? (<h4>Thêm buổi học</h4>):(<h4>Sửa thông tin buổi học</h4>)
                }</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vui lòng điền đầy đủ thông tin cần thiết (*)
                    </DialogContentText>
                    <form noValidate autoComplete="on">
                    <h5>Thông tin buổi học</h5>   
                        <Grid
                            container
                            spacing={4}
                        >
                            
                            <Grid
                                item
                                md={12}
                                lg={6}
                            >
                                <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                    <CenterSelect 
                                        center = {this.state.center}
                                        handleChange={this.handleCenterChange}
                                    />
                                </FormControl>                                   
                                <div className="date-time">
                                                       <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>

                                        <KeyboardDateTimePicker
                                            minutesStep= {15}
                                            value={this.state.from_date}                            
                                            onChange={this.handleFromDate}
                                            placeholder="Thời gian bắt đầu"                            
                                            className="input-date"
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy hh:mm a"     
                                        />                     
                                    </MuiPickersUtilsProvider>
                                </div>    
                                <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                    <TeacherSelect
                                        teacher={this.state.teacher}
                                        handleChange={this.handleChangeTeacher}                                       
                                    />
        
                                </FormControl> 
                                {
                                    this.props.dialogType == 'create' ? (
                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel htmlFor="outlined-adornment-amount">Học phí/ca</InputLabel>
                                            <OutlinedInput
                                                value={this.state.fee}
                                                name = "fee"
                                                onChange={this.onChange}
                                                startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                                labelWidth={70}
                                                inputComponent = {NumberFormatCustom}
                                            >
                                            </OutlinedInput>
                                        </FormControl>
                                    ): ''
                                }
                                
                            </Grid>
                            <Grid
                                item
                                md={12}
                                lg={6}
                            >
                                <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                    <Select className = "select-box"
                                        value={this.state.room}
                                        onChange={this.handleRoomChange}
                                        options={this.state.rooms}
                                        placeholder="Phòng học"
                                    />
        
                                </FormControl> 
                                <div className="date-time">
                                                       <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>

                                    <KeyboardDateTimePicker
                                        minutesStep= {15}
                                        value={this.state.to_date}                            
                                        onChange={this.handleToDate}
                                        minDate = {this.state.from_date}
                                        maxDate = {this.state.from_date}
                                        placeholder="Thời gian kết thúc"                            
                                        className="input-date"
                                        variant="inline"
                                        inputVariant="outlined"
                                        format="dd/MM/yyyy hh:mm a"

                                    />                     
                                    </MuiPickersUtilsProvider>
                                </div> 
                                <TextField  label="Ghi chú" 
                                    variant="outlined"
                                    size="medium"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'note'
                                    value = {this.state.note}
                                    onChange = {this.onChange}
                                />
                                {
                                    this.props.dialogType == 'create' ? (
                                        <FormGroup row>
                                            <FormControlLabel
                                                control={<Checkbox checked={this.state.student_involved} onChange={this.handleCheckBoxChange} name="student_involved" />}
                                                label="Thêm học sinh hiện hữu vào buổi học"
                                            />
                                            <FormControlLabel
                                                control={
                                                <Checkbox
                                                    checked={this.state.transaction_involved && this.state.student_involved}
                                                    onChange={this.handleCheckBoxChange}
                                                    name="transaction_involved"
                                                    disabled = {!this.state.student_involved}
                                                    color="primary"
                                                />
                                                }
                                                label="Tạo công nợ"
                                            /> 
                                        </FormGroup>    
                                    ): ''
                                }
                               
                            </Grid>
                        </Grid>
                    <h5>Tài liệu và Bài tập về nhà</h5>
                        <Grid container spacing={4}>
                            <Grid item
                                md={12}
                                lg={6} 
                            >
                                <TextField  label="Nội dung bài tập về nhà" 
                                    variant="outlined"
                                    size="medium"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'btvn_content'
                                    value = {this.state.btvn_content}
                                    onChange = {this.onChange}
                                />
                                {
                                    (this.state.old_exercice.length != 0 && this.props.dialogType == 'edit') ? (
                                        <List dense>
                                            {this.state.old_exercice.map(doc => {
                                                return(
                                                <ListItem >
                                                    <ListItemIcon>
                                                        <FolderIcon />
                                                    </ListItemIcon>
                                                    {
                                                        <span> {doc.replace('/public/document/', '')}</span>
                                                    }
                                                    <a href={doc} download className="a_document">Tải về</a>
                                                    <a href="#" onClick={(e) => this.deleteExercice(doc, e)} className="a_document">Xóa</a>
                                                </ListItem>
                                                )
                                            })}
                                        </List>
                                    ): ''
                                }
                                <div className = 'upload'>
                                    <DropzoneArea 
                                        onChange={this.handleExerciceUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {5}
                                        initialFiles= {[]}
                                        maxFileSize = {10000000}
                                        dropzoneText = "Kéo thả tài bài tập về nhà (Ảnh, PDF, Word)"
                                    />
                                </div>
                                
                            </Grid>
                            <Grid item
                                md={12}
                                lg={6}
                            >
                                <TextField  label="Nội dung bài học" 
                                    variant="outlined"
                                    size="medium"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'content'
                                    value = {this.state.content}
                                    onChange = {this.onChange}
                                />
                                {
                                    (this.state.old_document.length != 0  && this.props.dialogType == 'edit') ? (
                                        <List dense>
                                            {this.state.old_document.map(doc => {
                                                return(
                                                <ListItem >
                                                    <ListItemIcon>
                                                        <FolderIcon />
                                                    </ListItemIcon>
                                                    {
                                                        <span> {doc.replace('/public/document/', '')}</span>
                                                    }
                                                    <a href={doc} download className="a_document">Tải về</a>
                                                    <a href="#" onClick={(e) => this.deleteDocument(doc, e)} className="a_document">Xóa</a>
                                                </ListItem>
                                                )
                                            })}
                                        </List>
                                    ): ''
                                }
                                <div className = 'upload'>
                                    <DropzoneArea 
                                        onChange={this.handleDocumentUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {5}
                                        initialFiles= {[]}
                                        maxFileSize = {10000000}
                                        dropzoneText = "Kéo thả tài liệu buổi học(Ảnh, PDF, Word)"
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleCloseDialog} color="primary">
                        Hủy bỏ
                    </Button>
                    {
                        (this.props.dialogType == 'create') ? (
                            <Button onClick={this.handleAddSession} color="primary" id="btn-save">
                                Tạo mới buổi học
                            </Button>
                        ) : (
                            <Button onClick={this.handleAddSession} color="primary" id="btn-save">
                                Lưu thay đổi
                            </Button>
                        )
                    }
                    
                </DialogActions>
            </Dialog>
                
          );
    }
}
export default withSnackbar(DialogSession)