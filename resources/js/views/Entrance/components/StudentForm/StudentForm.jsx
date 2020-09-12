import React, {useState} from 'react'
import './StudentForm.scss'
import { StudentSearch, ParentSearch } from '../../../../components'
import { Grid , Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import AsyncCreatableSelect from 'react-select/async-creatable';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { throttle } from "lodash";
const baseUrl = window.Laravel.baseUrl


//s
const wait = 1000; // milliseconds

const promptTextCreator = (value) => {
    return 'Tạo mới '+value
}
const findSchools = (inputValue) => {
    return axios.get(baseUrl + '/school/find/' + inputValue)
        .then(response => {
            return  response.data.map(school => { return {label: school.name, value: school.id} })
        })
        .catch(err => {
            console.log('get schools bug' + err.response.data)
        })
}
const loadOptions = (type, inputValue) => {            
    if(type == 'school'){
        return findSchools(inputValue)
    }
};        
const debouncedLoadOptions = throttle(loadOptions, wait)

const StudentForm = props => {
    const { state, handleDateChange, handleStudentChange, onChange,onChangePhone , handleChange, ...rest } = props;
    return (
        <Grid container spacing={3} className="student-form" {...rest}>                
            <Grid item md={12} lg={4} sm={12} xs={12}>
                <StudentSearch
                    student_name={state.student_name}
                    handleStudentChange={handleStudentChange}
                />
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12}>
                        <div className="date-time">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>

                                <KeyboardDatePicker
                                    autoOk
                                    className="input-date"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    placeholder="Ngày sinh"
                                    views={["year", "month", "date"]}
                                    value={state.student_dob}
                                    onChange={handleDateChange}
                                />                     
                            </MuiPickersUtilsProvider>     
                        </div>
                
                    </Grid>    
                    <Grid item md={12} md={6} sm={12}>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="gender" name="student_gender" value={state.student_gender} onChange={onChange}>
                                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>    
                </Grid>       
            </Grid>
            <Grid item md={12} lg={4} sm={12} xs={12}>
                <AsyncCreatableSelect 
                    cacheOptions
                    autosize={true}
                    loadOptions={inputValue => debouncedLoadOptions('school',inputValue)}
                    placeholder={'Trường học'}
                    onChange={handleChange}
                    name="student_school"
                    value={state.student_school}
                    formatCreateLabel={promptTextCreator} 
                    className="select-box"    
                />

                <TextField  label="Lớp học"  
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="email"
                    fullWidth
                    margin = "dense"
                    name = 'student_grade'
                    value = {state.student_grade}
                    onChange = {onChange}
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
                    value = {state.student_email}
                    onChange = {onChange}
                />    
                <TextField  label="Số điện thoại học sinh" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="email"
                    fullWidth
                    margin = "dense"
                    name = 'student_phone'
                    value = {state.student_phone}
                    onChange = {onChangePhone}
                />    
            </Grid>
        </Grid>
    )
}
// export default class StudentForm extends React.Component {

//     render(){
        
//     }
// }
export default StudentForm;