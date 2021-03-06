import React, {useState, useEffect} from 'react'
import './TestForm.scss';
import { Grid , Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select , { components }  from "react-select";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";

import {DropzoneArea} from 'material-ui-dropzone'
const baseUrl = window.Laravel.baseUrl

import {
KeyboardDateTimePicker,
MuiPickersUtilsProvider
} from "@material-ui/pickers";

const UserSelect = React.memo(props => {
    const [users, setUsers] = useState([])
    // useEffect(() => {
    //     const fetchdata = async() => {
    //         const r = await axios.get(baseUrl + '/get-user')
    //         setCenters(r.data.map(user => {
    //                 return {label: user.name, value: user.id}
    //             })
    //         )
    //     }
    //     fetchdata()
    // }, [])
    
    return( 
        <Select className = "select-box"
            key = "user-select"
            value = {props.test_user}
            name = "test_user"
            placeholder="Nguời chấm"
            options={users}
            onChange={props.handleChange}
        />)
})
const TestForm = props => {
    const { state, handleUploadFile, handleEntranceDateChange, onChange, handleChange, ...rest } = props;
    return(
        <Grid container spacing={3} className="container-grid" {...rest}>
            <Grid item md={12} lg={3} sm={12} xs={12} className="test-answers-upload"> 
                <DropzoneArea 
                    
                    onChange={handleUploadFile}
                    acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                    filesLimit = {5}
                    maxFileSize = {10000000}
                    // showPreviews={true}
                    // showPreviewsInDropzone = {false}
                    initialFiles = {state.test_answers.slice(0,5)}
                    dropzoneText = "Kéo thả hoặc chọn bài làm của học sinh (Ảnh, PDF, Word)"
                />
            </Grid>
            <Grid item md={12} lg={3} sm={12} xs={12}>
                <UserSelect
                    test_user = {state.test_user}
                    handleChange={handleChange}
                />
            </Grid>
            <Grid item md={12} lg={3} sm={12} xs={12}>
                <TextField  label="Kết quả" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    margin = "dense"
                    name = 'test_score'
                    value = {state.test_score}
                    onChange = {onChange}
                /> 
            </Grid>
            <Grid item md={12} lg={3} sm={12} xs={12}>
                <TextField  label="Nhận xét" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    margin = "dense"
                    name = 'test_note'
                    value = {state.test_note}
                    onChange = {onChange}
                /> 
                
            </Grid>
        </Grid> 
    )
}
export default TestForm