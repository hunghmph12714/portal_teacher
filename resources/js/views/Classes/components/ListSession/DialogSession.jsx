import React from 'react';
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
            status: ['Khởi tạo','Đã tạo công nợ','Đã diễn ra','Đã đóng'],
        }  
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        const course = this.state.courses.filter(c => {
            return c.label == nextProps.class.course
        })
        const center = this.state.centers.filter(c => {
            return c.label == nextProps.class.center
        })
        let conf = []
        let class_per_week = 0
        let session_per_class = 0
        if(nextProps.class.config) {
            const configs = JSON.parse(nextProps.class.config)
            let dates = configs.map(c => {
                return c.date.value
            })
            let distinc_date = [...new Set(dates)]
            conf = configs.map(c => {
                c.from = c.from*1000
                c.to = c.to*1000
                return c
            })
            class_per_week = distinc_date.length
            session_per_class = dates.length/distinc_date.length
        }
        this.setState({
            name: (nextProps.class.name)?nextProps.class.name:'',
            code: (nextProps.class.code)?nextProps.class.code:'',
            open_date: nextProps.class.open_date ? new Date(nextProps.class.open_date) : null,
            fee: (nextProps.class.fee)?nextProps.class.fee:'',
            note: nextProps.class.note,
            course_selected : course,
            center : center,
            session_per_class: session_per_class    ,
            class_per_week: class_per_week,
            config: conf
             
        })
    }
    componentDidMount () {
        this.getCenters()
        this.getCourses()
        this.getTeacher()    
    }
    getCenters = () =>{
        axios.get(window.Laravel.baseUrl + "/get-center")
            .then(response => {
                this.setState({
                    centers: response.data.map(center => {
                        return { value: center.id, label: center.name }
                    })
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }
    getCourses = () =>{
        axios.get(window.Laravel.baseUrl + '/get-courses')
            .then(response => {
                this.setState({
                    courses: response.data.map(course => {
                        return {value: course.id, label: course.name + " " +course.grade, fee:course.fee,                              
                            session_per_class: course.session_per_class, class_per_week: course.class_per_week}
                    })
                })
            })
    }
    getTeacher = () => {
        axios.get(window.Laravel.baseUrl + '/get-teacher')
            .then(response => {
                this.setState({
                    teachers: response.data.map(teacher => {
                        return {value: teacher.id, label: teacher.name}
                    })
                })
            })
            .catch(err => {
                console.log('teacher get bug: '+ err)
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
    handleCreateNewClass = () => {
        let url = baseUrl + "/class/create"
        if(!this.state.code || !this.state.name || !this.state.open_date ||  !this.state.fee){
            this.props.enqueueSnackbar('Vui lòng điền đầy đủ các trường *', { 
                variant: 'error',
            });
            return 0;
        }
        let data = {
            center_id : this.state.center.value,
            course_id : this.state.course_selected.value,
            code : this.state.code,
            name : this.state.name,
            config : JSON.stringify(this.state.config.map(c => {
                return {from: c.from.getTime()/1000, to: c.to.getTime()/1000, teacher: c.teacher, room: c.room, date: c.date}
            })),
            open_date : this.state.open_date.getTime()/1000,
            note : (this.state.note)?this.state.note:'',
            fee : this.state.fee,
        }
        axios.post(url, data)
            .then(response => {
                this.props.updateTable(response.data)
                this.props.enqueueSnackbar('Thêm lớp thành công', { 
                    variant: 'success',
                });
                this.props.handleCloseDialog();
            })
            .catch(err => {
                this.props.enqueueSnackbar('Thêm lớp thành công', { 
                    variant: 'success',
                });
                console.log("Create class bug: "+ err)
            })
    }
    
    handleFromDate = date => {
        //Check exist session date
        var d = date.getTime()
        axios.post(baseUrl+'/session/check-date', {date: d/1000})
            .then(response => {
                if(response.data.result){
                    this.setState({ 
                        from_date: date, 
                        to_date: (this.state.to_date)?this.state.to_date:date});
                }
                else{
                    this.props.enqueueSnackbar('Buổi học đã tồn tại', { 
                        variant: 'warning',
                    })
                }
                
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
        axios.post(baseUrl+'/session/add', fd)
            .then(response => {

            })
            .catch(err => {
                console.log(err)
            })
        // axios.post(baseUrl+'/entrance/edit', data)
        //     .then(response => {
        //         if(this.state.test_answers && this.state.answers_changed){
        //             let fd = new FormData()
        //             for(let i = 0 ; i < this.state.test_answers.length ; i++){
        //                 fd.append('image'+i , this.state.test_answers[i], this.state.test_answers[i].name)
        //             }
        //             fd.append('entrance_id' , this.state.entrance_id)
        //             fd.append('count', this.state.test_answers.length)
        //             axios.post(baseUrl + '/entrance/upload-test', fd)
        //                 .then(uploaded => {
        //                     this.props.enqueueSnackbar('Sửa thành công', { 
        //                         variant: 'success',
        //                     });
        //                 })
        //                 .catch(err => {
        //                     console.log(err.resposne.data)
        //                 })
        //         }
        //         else{
        //             this.props.enqueueSnackbar('Sửa thành công', { 
        //                 variant: 'success',
        //             });
        //         }
        //         this.props.updateTable()
        //         this.props.handleCloseDialog()
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
    }
    render(){
        return (
            <Dialog 
                fullWidth 
                TransitionComponent={Transition}
                keepMounted
                maxWidth='lg'
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
                                    <Select
                                        value={this.state.center}
                                        onChange={this.handleCenterChange}
                                        options={this.state.centers}
                                        placeholder="Cơ sở"
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
                                    <Select
                                        value={this.state.teacher}
                                        onChange={this.handleChangeTeacher}
                                        options={this.state.teachers}
                                        placeholder="Giáo viên"
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
                                <div className = 'upload'>
                                    <DropzoneArea 
                                        onChange={this.handleDocumentUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {5}
                                        maxFileSize = {10000000}
                                        initialFiles = {this.state.document.slice(0,5)}
                                        dropzoneText = "Kéo thả tài liệu buổi học (Ảnh, PDF, Word)"
                                    />
                                </div>
                                
                            </Grid>
                            <Grid item
                                md={12}
                                lg={6}
                            >
                                <div className = 'upload'>
                                    <DropzoneArea 
                                        onChange={this.handleExerciceUpload}
                                        acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                        filesLimit = {5}
                                        maxFileSize = {10000000}
                                        initialFiles = {this.state.exercice.slice(0,5)}
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