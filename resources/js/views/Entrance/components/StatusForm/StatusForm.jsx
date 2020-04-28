import React, {useState, useEffect} from 'react'
import { Grid , Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select , { components }  from "react-select";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
const baseUrl = window.Laravel.baseUrl

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";

const StepSelect = React.memo(props => {
    const [steps, setSteps] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.post(baseUrl + '/step/get', {'type' : 'Quy trình đầu vào'})
            setSteps(r.data.map(step => {
                    return {label: step.order + ": " +step.name, value: step.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select
            className= "select-box"
            key = "step-select"
            value = {props.entrance_step}
            name = "entrance_step"
            placeholder="Quy trình"
            options={steps}
            onChange={props.handleChange}
        />)
})

const StatusSelect = React.memo(props => {
    const [status, setStatus] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.post(baseUrl + '/status/get', {'type': 'Quy trình đầu vào'})
            setStatus(r.data.map(s => {
                    return {label: s.name , value: s.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select
            key = "status-select"
            value = {props.entrance_status}
            name = "entrance_status"
            placeholder="Trạng thái"
            options={status}
            onChange={props.handleChange}
        />)
})

const StatusForm = props => {
    const { state, handleEntranceDateChange, onChange, handleChange, ...rest } = props;
    return(
        <Grid container spacing={2} className="container-grid" {...rest}>
            <Grid item md={12} lg={6} sm={12} xs={12}>
                <StepSelect 
                    entrance_step = {state.entrance_step}
                    handleChange={handleChange}
                />
            </Grid>
            <Grid item md={12} lg={6} sm={12} xs={12}>
                <StatusSelect 
                    entrance_status = {state.entrance_status}
                    handleChange = {handleChange}
                />
            </Grid>
        </Grid> 
    )
}
export default StatusForm