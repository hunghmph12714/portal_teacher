import React, {useState, useEffect} from 'react'
import { Grid , Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select , { components }  from "react-select";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import vi from "date-fns/locale/vi";

const baseUrl = window.Laravel.baseUrl

const ClassSelect = React.memo(props => {
    const {center, course} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            setClasses(r.data.map(c => {
                    return {label: c.name, value: c.id}
                })
            )
        }
        fetchdata()
    }, [])
    
    return( 
        <Select className = "select-box"
            key = "class-select"
            value = {props.entrance_classes}
            name = "entrance_classes"
            placeholder="Chọn lớp"
            options={classes}
            onChange={props.handleChange}
        />)
})

const CourseSelect = React.memo(props => {
    const [courses, setCourses] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/get-courses')
            setCourses(r.data.map(center => {
                    return {label: center.name + center.grade, value: center.id}
                })
            )
        }
        fetchdata()
    }, [])
    
    return( 
        <Select className = "select-box"
            key = "course-select"
            value = {props.entrance_courses}
            isMulti = {props.entrance_multi_course}
            name = "entrance_courses"
            placeholder="Khóa học"
            options={courses}
            onChange={props.handleChange}
        />)
})
const EnrollForm = props => {
    const { state, handleDateChange, onChange, handleChange, ...rest } = props;
    return(
        <Grid container spacing={2} className="container-grid" {...rest}>
            <Grid item md={12} lg={6} sm={12} xs={12}>
                <ClassSelect 
                    entrance_classes = {state.entrance_classes}
                    handleChange={handleChange}
                    course = {state.entrance_courses.value}
                    center = {state.entrance_center.value}
                />
            </Grid>
            <Grid item md={12} lg={6} sm={12} xs={12}>
                <div className="date-time">
                                       <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>

                        <KeyboardDatePicker
                            autoOk
                            minDate = {new Date()}
                            className="input-date"
                            variant="inline"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            placeholder="Ngày nhập học"
                            views={["year", "month", "date"]}
                            value={state.enroll_date}
                            onChange={handleDateChange}
                        />                     
                    </MuiPickersUtilsProvider>     
                </div>
            </Grid>
            
        </Grid> 
    )
}
export default EnrollForm