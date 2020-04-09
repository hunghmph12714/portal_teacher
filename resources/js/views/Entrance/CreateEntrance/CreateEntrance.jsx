import React , { useState, useEffect } from 'react';
import axios from 'axios';
import _ from "lodash";
import chroma from 'chroma-js';

import './CreateEntrance.scss';
import { Grid , Paper} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';

import NumberFormat from 'react-number-format';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
const colourOptions = [];
const baseUrl = window.Laravel.baseUrl
const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });
  
const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        },
      };
    },
    input: styles => ({ ...styles, ...dot() }),
    placeholder: styles => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };
const RelationshipOptions = React.memo(props => {
    const [relationships, setRelationships] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/relationship/get')
            setRelationships(r.data.map(relationship => {
                    return {label: relationship.name, value: relationship.id, color: (relationship.color)?relationship.color:"#000000"}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select
            value = {props.selected_relationship}
            name = "selected_relationship"
            placeholder="Quan hệ khách hàng"
            options={relationships}
            onChange={props.handleChange}
            styles={colourStyles}
        />)
})
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
            value = {props.entrance_center}
            name = "entrance_center"
            placeholder="Cơ sở"
            options={centers}
            onChange={props.handleChange}
        />)
})
const CourseSelect = React.memo(props => {
    const [courses, setCourses] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/get-courses')
            setCourses(r.data.map(center => {
                    return {label: center.name + center.grade, value: center.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select
            value = {props.entrance_courses}
            isMulti
            name = "entrance_courses"
            placeholder="Khóa học"
            options={courses}
            onChange={props.handleChange}
        />)
})
export default class CreateEntrance extends React.Component {
    
    constructor(props){
        super(props)
        // this.state = {
        //     //Options
        //     schools: [],
        //     //State
        //     student_name: '',
        //     student_dob: new Date(),
        //     student_school: {},
        //     student_grade: '',
        //     student_gender: 'Khác',
        //     student_email: '',
        //     student_phone: '',

        //     parent_name: '',
        //     parent_alt_name: '',
        //     parent_email: '',
        //     parent_alt_email: '',
        //     parent_phone: '',
        //     parent_alt_phone: '',
        //     parent_note: '',
            
        //     relationships: [],
        //     selected_relationship: '',

        //     entrance_center: '',
        //     entrance_courses: [],
        //     entrance_date: null,
        //     entrance_note: '',           

        // }
        this.state = {
            //Options
            schools: [],
            //State
            student_name: {__isNew__: true, label: "Trần Trịnh C", value:"Trần Trịnh C"},
            student_dob: new Date(),
            student_school:  {__isNew__: true, label: "THPT Chuyên Hà Nội - Amsterdam (01005612)", value:3142},
            student_grade: '12P2',
            student_gender: 'Khác',
            student_email: 'tranthanhuet@gmail.com',
            student_phone: '0985951181',

            parent_name: {__isNew__: true, label: "Trần Trịnh A", value:"Trần Trịnh A"},
            parent_alt_name: {__isNew__: true, label: "Trần Trịnh B", value:"Trần Trịnh B"},
            parent_email: 'tranthanhuet@gmail.com',
            parent_alt_email: 'tranthanhuet@gmail.com',
            parent_phone: '0985951181',
            parent_alt_phone: '0985951181',
            parent_note: '',
            
            relationships: [],
            selected_relationship: {color: "#9900ef", label: "Cocc", value: 4},

            entrance_center: {label: "CS1: VietElite1 Đỗ Quanggg", value: 1},
            entrance_courses: [{label: "Toán Nâng Cao9", value: 2}, {label: "Văn5", value: 5}],
            entrance_date: new Date(),
            entrance_note: '',           

        }
        // const wait = 1000; // milliseconds
        // const loadOptions = inputValue => this.findSchools(inputValue);
        // this.debouncedLoadOptions = _.debounce(loadOptions, wait, {
        //     leading: false
        // });
    }
    componentDidMount(){
        this.getRelationship();
    }
    findSchools = (inputValue) => {
        return axios.get(baseUrl + '/school/find/' + inputValue)
            .then(response => {
                return  response.data.map(school => { return {label: school.name, value: school.id} })
            })
            .catch(err => {
                console.log('get schools bug' + err.response.data)
            })
    }
    getRelationship = () => {
        axios.get(baseUrl + '/relationship/get')
            .then(response => {
                let r = response.data.map(relationship => {
                    return {label: relationship.name, value: relationship.id, color: (relationship.color)?relationship.color:"#000000"}
                })
                this.setState({relationships:r})
            })
            .catch(err => {
                console.log('get relationship error : ' + err.response.data)
        })
    }
    handleChange = (newValue , event)=> {
        this.setState({
            [event.name]: newValue
        })    
    };
    handleInputChange = (inputValue, actionMeta) => {
        console.group('Input Changed');
        console.log(inputValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    };
    promptTextCreator = (value) => {
        return 'Tạo mới '+value
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    handleDateChange = date => {
        this.setState({ student_dob: date });
    };
    handleEntranceDateChange = date => {
        this.setState({ entrance_date: date });
    }
    handleCreateEntrance = () => {
        let data = this.state
        data.entrance_date = this.state.entrance_date.getTime()/1000
        data.student_dob = this.state.student_dob.getTime()/1000
        axios.post(baseUrl + '/entrance/create', data)
            .then(response => {

            })
            .catch(err => {
                console.log("create entrance bug: " + err.response.data)
            })
    }
    render(){
        
        return(
            <div  className="root-create-entrance">                
                <form noValidate autoComplete="on">
                    <Paper elevation={4}>
                        <h4 className="root-header">Ghi danh học sinh</h4>
                        <h5 className="title-header">Thông tin học sinh</h5> 
                        <Grid container spacing={3} className="container-grid">                
                            <Grid item md={12} lg={4} sm={12} xs={12}>
                                <CreatableSelect
                                    autosize={true}
                                    isClearable
                                    placeholder={'Họ tên học sinh'}
                                    name="student_name"
                                    value={this.state.student_name}
                                    onChange={this.handleChange}
                                    options={colourOptions}
                                    formatCreateLabel={this.promptTextCreator}
                                    className="input-text"
                                />
                                <Grid container spacing={2}>
                                    <Grid item md={6}>
                                        <div className="date-time">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    autoOk
                                                    className="input-date"
                                                    variant="inline"
                                                    inputVariant="outlined"
                                                    format="dd/MM/yyyy"
                                                    placeholder="Ngày sinh"
                                                    views={["year", "month", "date"]}
                                                    value={this.state.student_dob}
                                                    onChange={this.handleDateChange}
                                                />                     
                                            </MuiPickersUtilsProvider>     
                                        </div>
                                
                                    </Grid>    
                                    <Grid item md={6}>
                                        <FormControl component="fieldset">
                                            <RadioGroup row aria-label="gender" name="student_gender" value={this.state.student_gender} onChange={this.onChange}>
                                                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                                <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>    
                                </Grid>       
                            </Grid>
                            <Grid item md={12} lg={4} sm={12} xs={12}>
                                <AsyncCreatableSelect 
                                    cacheOptions
                                    autosize={true}
                                    loadOptions={inputValue => this.findSchools(inputValue)}
                                    placeholder={'Trường học'}
                                    onChange={this.handleChange}
                                    name="student_school"
                                    value={this.state.student_school}
                                    formatCreateLabel={this.promptTextCreator} 
                                    className="input-text"    
                                />

                                <TextField  label="Lớp học" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="email"
                                    fullWidth
                                    margin = "dense"
                                    name = 'student_grade'
                                    value = {this.state.student_grade}
                                    onChange = {this.onChange}
                                />    
                            </Grid>
                            <Grid item md={12} lg={4} sm={12}  xs={12}>
                                <TextField  label="Email của học sinh" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="email"
                                    fullWidth
                                    margin = "dense"
                                    name = 'student_email'
                                    value = {this.state.student_email}
                                    onChange = {this.onChange}
                                />    
                                <TextField  label="Số điện thoại học sinh" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="email"
                                    fullWidth
                                    margin = "dense"
                                    name = 'student_phone'
                                    value = {this.state.student_phone}
                                    onChange = {this.onChange}
                                />    
                            </Grid>
                        </Grid>
                        <Divider/>
                        
                        <h5 className="title-header">Thông tin phụ huynh</h5> 
                        <Grid container spacing={3} className="container-grid">                
                            <Grid item md={12} lg={4} sm={12} xs={12}>
                                <CreatableSelect
                                    autosize={true}
                                    isClearable
                                    name="parent_name"
                                    value={this.state.parent_name}
                                    placeholder={'Tên phụ huynh (liên hệ chính)'}
                                    onChange={this.handleChange}
                                    options={colourOptions}
                                    formatCreateLabel={this.promptTextCreator}
                                    className="input-text"
                                />
                                <CreatableSelect
                                    autosize={true}
                                    isClearable
                                    placeholder={'Tên phụ huynh 2'}
                                    name="parent_alt_name"
                                    value={this.state.parent_alt_name}
                                    onChange={this.handleChange}
                                    options={colourOptions}
                                    formatCreateLabel={this.promptTextCreator}
                                    className="input-text"
                                />
                                <RelationshipOptions 
                                    selected_relationship={this.state.selected_relationship}
                                    handleChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item md={12} lg={4} sm={12} xs={12}>
                                <TextField  label="Số điện thoại(*)" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'parent_phone'
                                    value = {this.state.parent_phone}
                                    onChange = {this.onChange}
                                />    

                                <TextField  label="Số điện thoại 2" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'parent_alt_phone'
                                    value = {this.state.parent_alt_phone}
                                    onChange = {this.onChange}
                                /> 
                                <TextField  label="Ghi chú" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'parent_note'
                                    value = {this.state.parent_note}
                                    onChange = {this.onChange}
                                />     
                            </Grid>
                            <Grid item md={12} lg={4} sm={12}  xs={12}>
                                <TextField  label="Email(*)" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="email"
                                    fullWidth
                                    margin = "dense"
                                    name = 'parent_email'
                                    value = {this.state.parent_email}
                                    onChange = {this.onChange}
                                />    
                                <TextField  label="Email 2" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="email"
                                    fullWidth
                                    margin = "dense"
                                    name = 'parent_alt_email'
                                    value = {this.state.parent_alt_email}
                                    onChange = {this.onChange}
                                />    
                            </Grid>
                        </Grid>
                        <Divider/>

                        <h5 className="title-header">Nguyện vọng đăng ký</h5>
                        <Grid container spacing={3} className="container-grid">
                            <Grid item md={12} lg={3} sm={12} xs={12}>
                                <CenterSelect 
                                    entrance_center = {this.state.entrance_center}
                                    handleChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item md={12} lg={3} sm={12} xs={12}>
                                <CourseSelect 
                                    entrance_courses = {this.state.entrance_courses}
                                    handleChange = {this.handleChange}
                                />
                            </Grid>
                            <Grid item md={12} lg={3} sm={12} xs={12}>
                                <div className="date-time">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDateTimePicker
                                            minutesStep= {15}
                                            value={this.state.entrance_date}
                                            disablePast
                                            onChange={this.handleEntranceDateChange}
                                            placeholder="Hẹn lịch kiểm tra đầu vào"
                                            onError={console.log}
                                            className="input-date"
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy hh:mm a"
                                        />
                                                    
                                    </MuiPickersUtilsProvider>     
                                </div>
                            </Grid>
                            <Grid item md={12} lg={3} sm={12} xs={12}>
                                <TextField  label="Ghi chú" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'entrance_note'
                                    value = {this.state.entrance_note}
                                    onChange = {this.onChange}
                                /> 
                                <Button onClick={this.handleCreateEntrance} color="secondary" id="btn-save" variant="contained"
                                    color="secondary"
                                    size="large"
                                    startIcon={<SaveIcon />}>
                                    Tạo mới ghi danh
                                </Button>
                            </Grid>
                        </Grid> 
                    </Paper>
                </form>
            </div>
        )
    }
}