import React , { useState, useEffect } from 'react';
import axios from 'axios';
import _ from "lodash";
import { throttle } from "lodash";

import chroma from 'chroma-js';
import './CreateEntrance.scss';
import { Grid , Paper} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select , { components }  from "react-select";
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';

import NumberFormat from 'react-number-format';
import { StudentSearch, ParentSearch } from '../../../components'

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
// const CustomOption = props => {
//     const { data, innerRef, innerProps } = props;
//     return data.custom ? (
//         <StudentSearch eref={innerRef} innerProps={innerProps} data={data}/>           
//     ) : <components.Option {...props} />
//   };
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
        this.state = {
            schools: [],
            student_name: '',
            student_dob: new Date(),
            student_school: '',
            student_grade: '',
            student_gender: 'Khác',
            student_email: '',
            student_phone: '',

            parent_name: '',
            parent_alt_name: '',
            parent_email: '',
            parent_alt_email: '',
            parent_phone: '',
            parent_alt_phone: '',
            parent_note: '',
            
            selected_relationship: '',

            entrance_center: {label: "CS1: VietElite Đỗ Quang (67)", value: 2},
            entrance_courses: [{label: "Toán Chuyên9", value: 1}, {label: "Lý Chuyên9", value: 2}],
            entrance_date: new Date(),
            entrance_note: '',           

        }
        const wait = 1000; // milliseconds
        const loadOptions = (type, inputValue) => {            
            if(type == 'school'){
                return this.findSchools(inputValue)
            }
            if(type == 'parent'){
                
            }
        };        
        this.debouncedLoadOptions = throttle(loadOptions, wait)
    }
    componentDidMount(){
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
    handleStudentChange = (newValue) => {
        if(!newValue || newValue.__isNew__){
            this.setState({
                student_name: newValue
            }) 
        }
        else{
            this.setState({
                student_name: {__isNew__: false, value: newValue.value, label: newValue.label},
                student_dob: new Date(newValue.dob),
                student_school: {label: newValue.school, value: newValue.school},
                student_email: newValue.s_email,
                student_phone: newValue.s_phone,
                student_gender: newValue.gender,
                student_grade: newValue.grade,
    
                parent_name: {__isNew__: false, value: newValue.pid, label: newValue.p_name},
                parent_phone: newValue.p_phone,
                parent_email: newValue.p_email,
                parent_alt_name: newValue.alt_fullname,
                parent_alt_email: newValue.alt_email,
                parent_alt_phone: newValue.alt_phone,
    
                selected_relationship: {color: newValue.color, label: newValue.r_name, value: newValue.r_id},
                parent_note : (newValue.note)?newValue.note:'',
            }) 
        }
        
    }
    handleParentChange = (newValue) => {
        // console.log(newValue)
        if(!newValue ||newValue.__isNew__){
            this.setState({
                parent_name: newValue
            }) 
        }
        else{
            this.setState({                
                parent_name: {__isNew__: false, value: newValue.pid, label: newValue.fullname},
                parent_phone: newValue.phone,
                parent_email: newValue.email,
                parent_alt_name: newValue.alt_fullname,
                parent_alt_email: newValue.alt_email,
                parent_alt_phone: newValue.alt_phone,
    
                selected_relationship: {color: newValue.color, label: newValue.r_name, value: newValue.r_id},
                parent_note : (newValue.note)?newValue.note:'',
            }) 
        }
    }
    handleChange = (newValue , event)=> {
        this.setState({
            [event.name]: newValue
        })    
    };
    promptTextCreator = (value) => {
        return 'Tạo mới '+value
    }
    checkValidCreate = (inputValue, selectValue, selectOptions) => {
        if(inputValue == "" || !isNaN(inputValue)){
            return false
        }else return true
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
                                <StudentSearch
                                    student_name={this.state.student_name}
                                    handleStudentChange={this.handleStudentChange}
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
                                    loadOptions={inputValue => this.debouncedLoadOptions('school',inputValue)}
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
                                <ParentSearch
                                    parent_name = {this.state.parent_name}
                                    handleParentChange = {this.handleParentChange}
                                />
                                
                                <TextField  label="Tên phụ huynh 2" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    fullWidth
                                    margin = "dense"
                                    name = 'parent_alt_name'
                                    value = {this.state.parent_alt_name}
                                    onChange = {this.onChange}
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