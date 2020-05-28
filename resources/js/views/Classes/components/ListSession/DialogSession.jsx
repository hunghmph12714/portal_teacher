import React from 'react';
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
            name: "",
            code: "",
            room: "",
            from_date: null,
            to_date: null,
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
            course_selected : course,
            center_selected : center,
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
    onChangeTime = (c, type) => time => {
        this.setState(prevState => {
            let totalSession = prevState.session_per_class
            let totalClass = prevState.class_per_week
            let config = [...prevState.config]
            while(c < totalClass*totalSession){
                if(type == 'from'){
                    config[c].from = time
                }
                if(type == 'to') {
                    config[c].to = time
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
    handleFromDate = date => {
        this.setState({ from_date: date });
    }    
    handleToDate = date => {
        this.setState({ to_date : date })
    }
    handleRoomChange = room => {
        this.setState({room: room})
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
                                        value={this.state.center_selected}
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
                        
                    </form>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleCloseDialog} color="primary">
                        Hủy bỏ
                    </Button>
                    {
                        (this.props.dialogType == 'create') ? (
                            <Button onClick={this.handleCreateNewClass} color="primary" id="btn-save">
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