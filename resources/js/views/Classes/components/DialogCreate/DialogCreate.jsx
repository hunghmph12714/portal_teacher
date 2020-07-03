import React from 'react';
import './DialogCreate.scss';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from "react-select";

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';
import {
    KeyboardTimePicker,
    KeyboardDatePicker,
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
  
const DefaultConfig = React.memo( props => {
    let classes = [];
        
    let i = 0;
    let j = 0;
    
    if(props.config && props.class_per_week > 0 && props.session_per_class > 0 && props.class_per_week < 8 && props.session_per_class < 8){
        for(i = 0; i < props.class_per_week; i++){
            let session = [];
            for(j = 0 ; j < props.session_per_class; j++){
                let current_node = i*props.session_per_class + j                
                session.push(
                    <Grid container spacing={4} key = {'session_'+j}>
                        <Grid item lg={3} md={12}> 
                            <div className="date-time">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                    <KeyboardTimePicker
                                        autoOk
                                        minutesStep= {15}
                                        className="input-time"
                                        variant="inline"
                                        inputVariant="outlined"
                                        label= "Giờ vào lớp"
                                        views={["hours","minutes"]}
                                        value= {props.config[current_node].from}
                                        onChange = {props.onChangeTime(current_node, 'from')}
    
                                    />                     
                                </MuiPickersUtilsProvider>
                            </div>
                            
                        </Grid>
                        <Grid item lg={3} md={12}> 
                            <div className="date-time">
                                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                    <KeyboardTimePicker
                                        autoOk
                                        minutesStep= {15}
                                        className="input-time"
                                        variant="inline"
                                        inputVariant="outlined"
                                        label= "Giờ kết thúc"
                                        views={["hours","minutes"]}
                                        value= {props.config[current_node].to}
                                        onChange={props.onChangeTime(current_node, 'to')}
    
                                    />                     
                                </MuiPickersUtilsProvider>
                            </div>
                        </Grid>
                        <Grid item lg={3} md={12}>
                            <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                <Select
                                    value={props.config[current_node].teacher}
                                    onChange={props.onChangeTeacher(current_node)}
                                    options={props.teachers}
                                    placeholder="Giáo viên"
                                />
    
                            </FormControl>        
                        </Grid>
                        <Grid item lg={3} md={12}>
                            <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                <Select
                                    value={props.config[current_node].room}
                                    onChange={props.onChangeRoom(current_node)}
                                    options={props.rooms}
                                    placeholder="Phòng học"
                                />
    
                            </FormControl> 
                        </Grid>
                        
                    </Grid>
                )
            }
            classes.push(
                <div className="div-class" key = {'div_'+i}>
                    <Grid container spacing={4} key = {'class_'+i}>
                        <Grid item md={12} lg={3}>
                            <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                <Select
                                    value={props.config[i*props.session_per_class].date}
                                    onChange={props.onChangeDay(i)}
                                    options={props.days}
                                    placeholder="Ngày học"
                                />

                            </FormControl>
                        </Grid>
                    </Grid>
                    {session}
                    <Divider className="divider-class"/>
                </div>
            )
        }
    }
    return <React.Fragment>{classes}</React.Fragment>
})
class DialogCreate extends React.Component {
    constructor(props){
        super(props)      
        this.state = {
            name: "",
            code: "",
            open_date: new Date(),
            fee: "",
            note:"",
            session_per_class: 0,
            class_per_week: 0,
            centers : [],
            center_selected: '',
            courses: [],
            course_selected: '',
            teachers: [],
            rooms: [],
            config: [],
            days : [{value: 0, label:'Thứ 2'},{value: 1, label:'Thứ 3'},{value: 2, label:'Thứ 4'},{value: 3, label:'Thứ 5'},{value: 4, label:'Thứ 6'},{value: 5, label:'Thứ 7'},{value: 6, label:'Chủ nhật'},]
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
            course_selected : course[0],
            center_selected : center[0],
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
    updateConfigState = (x, y) => {
        let c = [];
        for(let i = 0 ; i < x; i++){
            for(let j = 0; j < y ; j++){
                c.push({from: new Date(),to: new Date(),teacher:'',room:'', date:''})
            }
        }
        this.setState({ config:c })
    }
    onChangeClassPerWeek = e =>{       
        
        this.setState({
            [e.target.name] : parseInt(e.target.value),
        })
        this.updateConfigState(parseInt(e.target.value), this.state.session_per_class);
    }
    onChangeSessionPerClass = e => {        
        this.setState({
            [e.target.name] : parseInt(e.target.value),
        })
        this.updateConfigState(this.state.class_per_week, parseInt(e.target.value));
    }
    handleCenterChange = (center)=> {
        this.setState({ center_selected: center })
        this.getRoom(center.value)
    }
    handleCourseChange = (course) => {
        this.setState({ 
            course_selected: course,
            fee: course.fee,
            class_per_week: course.class_per_week,
            session_per_class: course.session_per_class,
        })
        this.updateConfigState(course.class_per_week, course.session_per_class)
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
            center_id : this.state.center_selected.value,
            course_id : this.state.course_selected.value,
            code : this.state.code,
            name : this.state.name,
            config : JSON.stringify(this.state.config.map(c => {
                return {from: c.from/1000, to: c.to/1000, teacher: c.teacher, room: c.room, date: c.date}
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
    handleEditClass = () => {
        let url = baseUrl + "/class/edit"
        if(!this.state.code || !this.state.name || !this.state.open_date ||  !this.state.fee){
            this.props.enqueueSnackbar('Vui lòng điền đầy đủ các trường *', { 
                variant: 'error',
            });
            return 0;
        }
        let data = {
            class_id: this.props.class.id,
            center_id : this.state.center_selected.value,
            course_id : this.state.course_selected.value,
            code : this.state.code,
            name : this.state.name,
            config : JSON.stringify(this.state.config.map(c => {
                return {from: c.from/1000, to: c.to/1000, teacher: c.teacher, room: c.room, date: c.date}
            })),
            open_date : this.state.open_date,
            note : (this.state.note)?this.state.note:'',
            fee : this.state.fee,
        }
        axios.post(url, data)
            .then(response => {
                this.props.updateTable(response.data)
                this.props.enqueueSnackbar('Sửa thành công', { 
                    variant: 'success',
                });
                this.props.handleCloseDialog();
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', { 
                    variant: 'error',
                });
                console.log("Create class bug: "+ err)
            })
    }
    onChangeTime = (c, type) => time => {
        this.setState(prevState => {
            let totalSession = prevState.session_per_class
            let totalClass = prevState.class_per_week
            let config = [...prevState.config]
            while(c < totalClass*totalSession){
                if(type == 'from'){
                    config[c].from = (time) ? time.getTime() : ''
                }
                if(type == 'to') {
                    config[c].to = (time) ? time.getTime() : ''
                }
                c = c + totalSession
            }
            return {...prevState, config}
        })              
    }
    
    onChangeTeacher = (c) => teacher => {
        let totalSession = this.state.session_per_class
        let totalClass = this.state.class_per_week
        this.setState(prevState => {
            let config = [...prevState.config]
            while(c < totalClass*totalSession){
                config[c].teacher = teacher
                c = c + totalSession
            }
            return {...prevState, config}
        })

    }
    onChangeRoom = (c) => room => {
        let totalSession = this.state.session_per_class
        let totalClass = this.state.class_per_week
        this.setState(prevState => {
            let config = [...prevState.config]
            while(c < totalClass*totalSession){
                config[c].room = room
                c = c + totalSession
            }
            return {...prevState, config}
        })
    }
    onChangeDay = (i) => day => {
        let current_class = i * this.state.session_per_class
        for(let a = 0; a < this.state.session_per_class ; a++){
            let current_node = current_class + a
            this.setState(prevState => {
                let config = [...prevState.config]
                config[current_node].date = day
                return {...prevState, config}
            })
        }
    }
    render(){
        
        return (
            <div>
                {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Open form dialog
                </Button> */}
                <Dialog 
                    fullWidth 
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth='lg'
                    scroll='paper'
                    open={this.props.open} onClose={this.props.handleCloseDialog} aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{
                        this.props.dialogType == "create" ? (<h4>Thêm lớp học</h4>):(<h4>Sửa thông tin lớp học</h4>)
                    }</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Vui lòng điền đầy đủ thông tin cần thiết (*)
                        </DialogContentText>
                        <form noValidate autoComplete="on">
                        <h5>Thông tin lớp học</h5>   
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
                                            value={this.state.center_selected}
                                            onChange={this.handleCenterChange}
                                            options={this.state.centers}
                                            placeholder="Cơ sở"
                                        />
                                        <FormHelperText >Cơ sở học tập</FormHelperText>

                                    </FormControl>                                   
                                    <TextField  label="Tên lớp" 
                                        id="name"
                                        required
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        helperText="Tên lớp học eg: Toán chuyên 9.1"
                                        margin = "dense"
                                        value = {this.state.name}
                                        name = 'name'
                                        onChange = {this.onChange}
                                    />           
                                    
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
                                    <Grid
                                        container
                                        spacing={4}
                                    >
                                        <Grid
                                            item
                                            md={12}
                                            lg={6}
                                        >
                                            <TextField  label="Số buổi/ tuần" 
                                                id="class"
                                                type="number"
                                                inputProps={{ min: "0", max: "7", step: "1" }}
                                                required
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                helperText=""
                                                margin = "normal"
                                                value = {this.state.class_per_week}
                                                name = 'class_per_week'
                                                onChange = {this.onChangeClassPerWeek}
                                            />  
                                        </Grid>
                                        <Grid
                                            item
                                            md={12}
                                            lg={6}
                                        >
                                        <TextField  label="Số ca/ buổi" 
                                                id="session"
                                                type="number"
                                                inputProps={{ min: "0", max: "4", step: "1" }}
                                                required
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                helperText=""
                                                margin = "normal"
                                                value = {this.state.session_per_class}
                                                name = 'session_per_class'
                                                onChange = {this.onChangeSessionPerClass}
                                            />
                                        </Grid>
                                    
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    lg={6}
                                >
                                    <FormControl variant="outlined" className="select-input" fullWidth  margin="dense">
                                        <Select
                                            value={this.state.course_selected}
                                            onChange={this.handleCourseChange}
                                            options={this.state.courses}
                                            placeholder="Khóa học"
                                        />
                                        <FormHelperText >Khóa học của lớp </FormHelperText>

                                    </FormControl>
                                    <TextField  label="Mã lớp" 
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        fullWidth
                                        helperText="Mã lớp học: eg:TC9.1"
                                        margin = "dense"
                                        name = 'code'
                                        value = {this.state.code}
                                        onChange = {this.onChange}
                                    />  
                                    <div className="date-time">
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            autoOk
                                            className="input-date"
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            placeholder= "Ngày khai giảng"
                                            views={["year", "month", "date"]}
                                            value={this.state.open_date}
                                            onChange={this.handleDateChange}

                                        />                     
                                        </MuiPickersUtilsProvider>
                                    </div>  
                                    <TextField  label="Ghi chú" 
                                        variant="outlined"
                                        size="medium"
                                        type="text"
                                        fullWidth
                                        helperText="Ghi chú của lớp"
                                        margin = "dense"
                                        name = 'note'
                                        value = {this.state.note}
                                        onChange = {this.onChange}
                                    />  

                                </Grid>
                            </Grid>
                        <h5>Lịch học theo tuần</h5>
                            <DefaultConfig 
                                days = {this.state.days}
                                teachers = {this.state.teachers}
                                rooms = {this.state.rooms}
                                config = {this.state.config}
                                class_per_week = {this.state.class_per_week}
                                session_per_class = {this.state.session_per_class}
                                onChangeDay = {this.onChangeDay}
                                onChangeRoom = {this.onChangeRoom}
                                onChangeTeacher = {this.onChangeTeacher}
                                onChangeTime = {this.onChangeTime}
                            />
                        </form>
                        </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleCloseDialog} color="primary">
                            Hủy bỏ
                        </Button>
                        {
                            (this.props.dialogType == 'create') ? (
                                <Button onClick={this.handleCreateNewClass} color="primary" id="btn-save">
                                    Tạo mới lớp học
                                </Button>
                            ) : (
                                <Button onClick={this.handleEditClass} color="primary" id="btn-save">
                                    Lưu thay đổi
                                </Button>
                            )
                        }
                        
                    </DialogActions>
                </Dialog>
                </div>
          );
    }
}
export default withSnackbar(DialogCreate)