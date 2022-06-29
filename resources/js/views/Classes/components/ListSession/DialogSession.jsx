import React, {useState, useEffect} from 'react';
import './DialogSession.scss'
import { TeacherSearch, StudentClassSelect } from '../../../../components';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
import MenuItem from '@material-ui/core/MenuItem';
import Select  from '@material-ui/core/Select';

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
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/get-center')
            setCenters(r.data.map(center => {
                    return {label: center.name, value: center.id}
                })
            )
        }
        fetchdata()
    }, [])

    return(         
        <FormControl variant="outlined" size="small">
            <InputLabel id="demo-simple-select-outlined-label">Cơ sở</InputLabel>
            <Select
                value={props.center}
                onChange={props.handleChange}
                label="Cơ sở"
            >
            <MenuItem value="">
                <em>Vui lòng chọn cơ sở</em>
            </MenuItem>
            {
                centers.map(c => {
                    return (<MenuItem value={c.value}>{c.label}</MenuItem>)
                })
            }
            </Select>
        </FormControl>
    )
})
const RoomSelect = React.memo(props => {
    const [rooms, setRooms] = useState([])
    const center_id = props.center
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(window.Laravel.baseUrl + '/get-room/'+ center_id)            
            setRooms(r.data.map(room => {
                    return {label: room.name, value: room.id}
                })
            )
        }
        fetchdata()
    }, [props.center])
    
    return(         
        <FormControl variant="outlined" size="small" fullWidth style={{marginTop: '8px', marginBottom: '4px'}}>
            <InputLabel id="demo-simple-select-outlined-label">Phòng học</InputLabel>
            <Select
                value={props.room}
                onChange={props.handleChange}
                label="Phòng học"
            >
            <MenuItem value="">
                <em>Vui lòng chọn Phòng học</em>
            </MenuItem>
            {
                rooms.map(c => {
                    return (<MenuItem value={c.value}>{c.label}</MenuItem>)
                })
            }
            </Select>
        </FormControl>
    )
})
const initState = {
    students: [],
    type: '',
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
    btvn_content: '',
    content: '',
    status: ['Khởi tạo','Đã tạo công nợ','Đã diễn ra','Đã đóng'],
    fetch_student: false,
    cost: 0,
    correction: [],
    old_correction: [],
}
class DialogSession extends React.Component {
    constructor(props){
        super(props)      
        this.state = initState
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        //d
        let s = nextProps.session
        // console.log(s)
        if(nextProps.dialogType == 'create'){
            this.setState(initState)
        }else{
            this.setState({
                type: s.type,
                room : s.rid,
                center : s.ctid,
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
                old_correction: (s.correction) ? s.correction.split(',') : [],
                students: s.students,
                cost: s.cost
            })
       
        }
    }    
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    
    handleCenterChange = (event)=> {
        this.setState({ center: event.target.value })
    }
    
    handleDateChange = date => {
        this.setState({ open_date: date });
    };   
    handleTypeChange = event => {
        this.setState({ type: event.target.value })
        this.calculateFee(this.state.from_date, this.state.to_date, event.target.value);
    }
    handleFromDate = date => {
        this.setState({ 
            from_date: date, 
            to_date: (this.state.to_date)?this.state.to_date:date
        });        
        this.calculateFee(date, this.state.to_date, this.state.type);
    }    
    handleToDate = date => {
        this.setState({ 
            to_date : date, 
            from_date: (this.state.from_date)?this.state.from_date:date });
        this.calculateFee(this.state.from_date, date, this.state.type);
    }
    calculateFee = (from, to, type) => {
        let diffHour = (Math.abs(to - from) / (1000 * 60 * 60));
        if(type == 'tutor'){            
            this.setState({fee:  100000*diffHour})
        }
        if(type == 'tutor_online'){
            this.setState({fee:  88000*diffHour})
        }
        if(type == 'main'){
            this.setState({fee: this.props.class_fee})
        }
    }
    checkSession = () => {
        axios.post(baseUrl+'/session/check-date', {date: this.state.from_date, class_id: this.props.class_id})
            .then(response => {
                if(!response.data.result){
                    this.props.enqueueSnackbar('Buổi học đã tồn tại', { 
                        variant: 'warning',
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        this.setState({fetch_student : !this.state.fetch_student})
    }
    handleRoomChange = event => {
        this.setState({room: event.target.value})
    }
    handleStudentChange = students => {
        this.setState({students : students})
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
    handleCorrectionUpload = correction => {
        this.setState({correction: correction})
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
        for(let j = 0 ; j < this.state.correction.length ; j++){
            fd.append('correction' + j, this.state.correction[j], this.state.correction[j].name)
        }
        let from_date = this.state.from_date.getTime()/1000
        let to_date = this.state.to_date.getTime()/1000
        fd.append('document_count', this.state.document.length)
        fd.append('exercice_count', this.state.exercice.length)
        fd.append('correction_count', this.state.correction.length)
        fd.append('center_id', this.state.center)
        fd.append('class_id', this.props.class_id)
        fd.append('room_id', (this.state.room))
        fd.append('from_date', from_date)
        fd.append('to_date', to_date)
        fd.append('teacher_id', (this.state.teacher.value)?this.state.teacher.value:0)
        fd.append('note', this.state.note)
        fd.append('fee', this.state.fee)
        fd.append('btvn_content', this.state.btvn_content)
        fd.append('content', this.state.content)
        fd.append('type', this.state.type)
        fd.append('students', JSON.stringify(this.state.students))
        fd.append('cost', this.state.cost)
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
            fd.append('old_correction', this.state.old_correction.join(','))
            fd.append('ss_id', this.props.session.id)
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
                className="dialog-session-root"
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
                                sm={12}
                                lg={6}
                            >
                                <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                    <CenterSelect 
                                        center = {this.state.center}
                                        handleChange={this.handleCenterChange}
                                    />
                                </FormControl>                                   
                                <Grid
                                    container
                                    spacing={4}
                                >   
                                    <Grid
                                        item
                                        sm={12}
                                        lg={6}
                                    >
                                        <div className="date-time">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                                                <KeyboardDateTimePicker
                                                    minutesStep= {15}
                                                    value={this.state.from_date}                            
                                                    onChange={this.handleFromDate}
                                                    onClose={this.checkSession}
                                                    placeholder="Thời gian bắt đầu"                            
                                                    className="input-date"
                                                    variant="inline"
                                                    inputVariant="outlined"
                                                    format="dd/MM/yyyy hh:mm a"     
                                                />                     
                                            </MuiPickersUtilsProvider>
                                        </div>  
                                    </Grid>
                                    <Grid
                                        item
                                        sm={12}
                                        lg={6}
                                    >
                                        <div className="date-time">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                                            <KeyboardDateTimePicker
                                                minutesStep= {15}
                                                value={this.state.to_date}                            
                                                onChange={this.handleToDate}
                                                onClose={this.checkSession}
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
                                    </Grid>
                                </Grid>
                                <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                    <TeacherSearch
                                        teacher={this.state.teacher}
                                        handleChange={this.handleChangeTeacher}                                       
                                    />
                                </FormControl>
                                
                                <Grid container spacing={4}>
                                        <Grid item md={12} lg={6}>
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
                                        </Grid>
                                        <Grid item md={12} lg={6}> 
                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                <InputLabel htmlFor="outlined-adornment-amount">Chi phí/ca</InputLabel>
                                                <OutlinedInput
                                                    value={this.state.cost}
                                                    name = "cost"
                                                    onChange={this.onChange}
                                                    startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                                    labelWidth={70}
                                                    inputComponent = {NumberFormatCustom}
                                                >
                                                </OutlinedInput>
                                            </FormControl>
                                        </Grid>
                                </Grid>
                                {
                                    this.props.dialogType == 'create' ? '': ''
                                }
                            </Grid>
                            <Grid
                                item
                                sm={12}
                                lg={6}
                            >
                                <RoomSelect
                                    center={this.state.center}
                                    room = {this.state.room}
                                    handleChange = {this.handleRoomChange}
                                />
                                
                                
                                
                                <FormControl variant="outlined" size="small" fullWidth style={{marginTop: '8px', marginBottom: '8px'}}>
                                    <InputLabel id="demo-simple-select-outlined-label">Loại buổi học</InputLabel>
                                    <Select
                                        value={this.state.type}
                                        onChange={this.handleTypeChange}
                                        label="Loại buổi học"
                                    >
                                        <MenuItem value="">
                                            <em>Vui lòng chọn loại buổi học</em>
                                        </MenuItem>
                                        <MenuItem value="main">Chính khóa</MenuItem>
                                        <MenuItem value="tutor">Phụ đạo</MenuItem>
                                        <MenuItem value="tutor_online">Phụ đạo (Online)</MenuItem>
                                        <MenuItem value="compensate">Học bù</MenuItem>
                                        <MenuItem value="exam">Kiểm tra định kỳ</MenuItem>
                                    </Select>
                                </FormControl>
                                <StudentClassSelect 
                                    session_id = {this.props.session.id}
                                    class_id = {this.props.class_id}
                                    students = {this.state.students}
                                    session_date = {this.state.from_date}
                                    dialogType = {this.props.dialogType}
                                    fetch_student = {this.state.fetch_student}
                                    handleChange = {this.handleStudentChange}
                                />
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
                            </Grid>
                        </Grid>
                    <h5>Tài liệu và Bài tập về nhà</h5>
                        <Grid container spacing={4}>
                            <Grid item
                                sm={12}
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
                                                         <span> {doc.split('/')[doc.split('/').length-1]}</span>
                                                    }
                                                    <a href={baseUrl+"/"+doc} download className="a_document">Tải về</a>
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
                                <div className = 'upload' style={{marginTop: '10px'}}>
                                    <DropzoneArea 
                                        onChange={this.handleCorrectionUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {5}
                                        initialFiles= {[]}
                                        maxFileSize = {10000000}
                                        dropzoneText = "Kéo thả tài bài chữa (Ảnh, PDF, Word)"
                                    />
                                </div>
                            </Grid>
                            <Grid item
                                sm={12}
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
                                                         <span> {doc.split('/')[doc.split('/').length-1]}</span>
                                                    }
                                                    <a href={baseUrl+"/"+doc} download className="a_document">Tải về</a>
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