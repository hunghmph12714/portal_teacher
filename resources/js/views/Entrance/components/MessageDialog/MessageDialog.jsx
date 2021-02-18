import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, Button,TextField
} from '@material-ui/core/';
import Select from 'react-select'
import './MessageDialog.scss'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import axios from 'axios'
import { useSnackbar } from 'notistack';

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
const MessageDialog = props => {
    const {open, handleCloseDialog, selectedEntrance, statusOptions, courseOptions, ...rest} = props
    const [note, setNote] = useState('')
    const [messages, setMessages] = useState([{course: null, date: new Date(), id: 0}]);
    const [status, setStatus] = useState({value: '', label: ''})
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        setNote(selectedEntrance.note)
        setStatus({label: selectedEntrance.status, value: selectedEntrance.status_id})

    }, [selectedEntrance])    
    function handleEditEntrance(){

    }
    function onNoteChange(e){
        setNote(e.target.value)
    }
    function onStatusChange(value){
        setStatus(value)
    }
    function onCourseChange(id, value){
        let apps = [...messages]
        apps = apps.map(a => {
            if(a.id == id){
                a.course = value
            }
            return a
        })
        setMessages(apps)
    }
    function onDateChange(id, value){
        let apps = [...messages]
        apps = apps.map(a => {
            if(a.id == id){
                a.date = value
            }
            return a
        })
        setMessages(apps)
    }
    function removeMessage(id){
        let apps = messages.filter(a => a.id != id)
        setMessages(apps)
    }
    function addMessage(id){
        let currentMessages = [...messages]
        currentMessages.push({course: null, date: new Date(), id: messages.length})
        setMessages(currentMessages)
    }
    function handleEditEntrance(){
        axios.post('/entrance/init/edit', {
            id: selectedEntrance.eid, 
            note: note,
            status: status,
            messages: messages
        })
            .then(response => {
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                props.fetchData();
                props.handleCloseDialog();
            })
            .catch(err => {

            })
    }
    return(
        <Dialog 
            {...rest}
            id="message-dialog"
            fullWidth 
            maxWidth='lg'
            scroll='paper'
            className='root-edit-entrance'
            open={props.open} onClose={props.handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Hẹn lịch KTDV - {props.selectedEntrance.sname}</h4>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12}>
                        {messages.map( a => {
                            return(
                                <Grid container spacing = {2} className="messages">
                                    <Grid item md={5} sm={5}>
                                        <Select className = "select-box"
                                            key = "course-select"
                                            value = {a.course}
                                            name = "course"
                                            placeholder="Khoá học"
                                            options={props.courseOptions}
                                            onChange={(value) => onCourseChange(a.id, value)}
                                        />
                                    </Grid>
                                    <Grid item md={5} sm={5}>
                                        <div className="date-time">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                                                <KeyboardDateTimePicker
                                                    minutesStep= {15}
                                                    value={a.date}                            
                                                    onChange={(value) => onDateChange(a.id, value)}
                                                    placeholder="Hẹn lịch kiểm tra đầu vào"                            
                                                    className="input-date"
                                                    variant="inline"
                                                    inputVariant="outlined"
                                                    format="dd/MM/yyyy hh:mm a"
                                                />        
                                            </MuiPickersUtilsProvider>     
                                        </div>
                                    </Grid>
                                    <Grid item md={1} sm={1}>
                                        <AddCircleOutlineIcon onClick={() => addMessage(a.id)} className="icon"/>
                                    </Grid>
                                    <Grid item md={1} sm={1}>
                                        {
                                            (a.id == 0)? '':<RemoveCircleOutlineIcon onClick={() => removeMessage(a.id)} className="icon"/>
                                        }
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Grid item md={6} sm={12}>
                        <TextField  label="Nguyện vọng" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'note'
                            value = {note}
                            onChange = {onNoteChange}
                        /> 
                        <Select className = "select-box"
                            key = "status-select"
                            value = {status}
                            name = "entrance_status"
                            placeholder="Trạng thái"
                            options={props.statusOptions}
                            onChange={onStatusChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent> 
        </Dialog>
    )

}
export default MessageDialog