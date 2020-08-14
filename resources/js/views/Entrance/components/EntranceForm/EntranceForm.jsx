import React, {useState, useEffect} from 'react'
import { Grid , Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select , { components }  from "react-select";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";

const baseUrl = window.Laravel.baseUrl

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
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
            key = "course-select"
            value = {props.entrance_courses}
            isMulti = {props.entrance_multi_course}
            name = "entrance_courses"
            placeholder="Khóa học"
            options={courses}
            onChange={props.handleChange}
        />)
})
const EntranceForm = props => {
    const { state, handleEntranceDateChange, onChange, handleChange, ...rest } = props;
    return(
        <Grid container spacing={3} className="container-grid" {...rest}>
            <Grid item md={12} lg={3} sm={12} xs={12}>
                <CenterSelect 
                    entrance_center = {state.entrance_center}
                    handleChange={handleChange}
                />
            </Grid>
            <Grid item md={12} lg={3} sm={12} xs={12}>
                <CourseSelect 
                    entrance_courses = {state.entrance_courses}
                    handleChange = {handleChange}
                    entrance_multi_course = {state.entrance_multi_course}
                />
            </Grid>
            <Grid item md={12} lg={3} sm={12} xs={12}>
                <div className="date-time">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>

                        <KeyboardDateTimePicker
                            minutesStep= {15}
                            value={state.entrance_date}                            
                            onChange={handleEntranceDateChange}
                            placeholder="Hẹn lịch kiểm tra đầu vào"                            
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
                    value = {state.entrance_note}
                    onChange = {onChange}
                /> 
                
            </Grid>
        </Grid> 
    )
}
export default EntranceForm