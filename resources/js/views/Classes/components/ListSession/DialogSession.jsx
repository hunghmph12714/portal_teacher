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
        <Select
            className="select-box-1"
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
        <Select
            className="select-box-1"
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
            exercice: [],
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
            from_date: new Date(s.from_full),
            to_date: new Date(s.to_full),
            note: s.note,
            teacher: { label: s.tname, value: s.tid},
            fee: s.fee,
            document: (s.document) ? s.document.split(',') : [],
            exercice: (s.exercice) ? s.exercice.split(',') : [],
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
        fd.append('room_id', this.state.room.value)
        fd.append('from_date', this.state.from_date.getTime()/1000)
        fd.append('to_date', this.state.to_date.getTime()/1000)
        fd.append('teacher_id', this.state.teacher.value)
        fd.append('note', this.state.note)
        fd.append('fee', this.state.fee)
        fd.append('student_involved', this.state.student_involved)
        fd.append('transaction_involved', this.state.transaction_involved)
        fd.append('btvn_content', this.state.btvn_content)
        fd.append('content', this.state.content)
        axios.post(baseUrl+'/session/add', fd)
            .then(response => {
                this.props.enqueueSnackbar('Thêm buổi học thành công', {
                    variant: 'success'
                })
            })
            .catch(err => {
                console.log(err)
            })
        
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
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                            <Grid
                                item
                                md={12}
                                lg={6}
                            >
                                <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                    <Select
                                        value={this.state.room}
                                        onChange={this.handleRoomChange}
                                        options={this.state.rooms}
                                        placeholder="Phòng học"
                                    />
        
                                </FormControl> 
                                <div className="date-time">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                <div className = 'upload'>
                                    <DropzoneArea 
                                        onChange={this.handleDocumentUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {5}
                                        maxFileSize = {10000000}
                                        initialFiles = {['/public/document/35_exercice_0_1594369300.pdf']}
                                        dropzoneText = "Kéo thả tài liệu buổi học (Ảnh, PDF, Word)"
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
                                <div className = 'upload'>
                                    <DropzoneArea 
                                        onChange={this.handleExerciceUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {5}
                                        maxFileSize = {10000000}
                                        initialFiles = {this.state.exercice}
                                        dropzoneText = "Kéo thả bài tập về nhà (Ảnh, PDF, Word)"
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
                            <Button onClick={this.handleEditTeacher} color="primary" id="btn-save">
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