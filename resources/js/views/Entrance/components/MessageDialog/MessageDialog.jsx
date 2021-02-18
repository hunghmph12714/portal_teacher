import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, Button,TextField, Avatar, FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core/';
import './MessageDialog.scss'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import { Can } from '../../../../Can';
import axios from 'axios'
import { useSnackbar } from 'notistack';

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
const MessageDialog = props => {
    const {open, handleCloseDialog, selectedEntrance,  ...rest} = props
    const [note, setNote] = useState('')
    const [messages, setMessages] = useState([{course: null, date: new Date(), id: 0}]);
    const [method, setMethod] = useState('Trực tiếp')
    const [disable, setDisable] = useState(false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const fetchMessages = async() => {
        const c = await axios.post('/entrance/get-messages', {
            id: selectedEntrance.eid, 
        })
        setMessages(c.data)
    }
    useEffect(() => {
        
        fetchMessages()

    }, [selectedEntrance])    
    function handleEditEntrance(){

    }
    function onNoteChange(e){
        setNote(e.target.value)
    }
    function onMethodChange(value){
        setMethod(value.target.value)
    }
    function handleCreateComment(){
        setDisable(true)
        axios.post('/entrance/comment/create', {
            id: selectedEntrance.eid, 
            note: note,
            method: method,
        })
            .then(response => {
                setDisable(false)
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                fetchMessages()
            })
            .catch(err => {
                setDisable(false)
            })
    }
    function deleteMessage(id){
        axios.post('/entrance/comment/delete', {
            id: id
        })
            .then(response => {                
                enqueueSnackbar('Đã xoá', {variant: 'success'});
                fetchMessages()
            })
            .catch(err => {
            })
    }
    return(
        <Dialog 
            {...rest}
            id="message-dialog"
            fullWidth 
            maxWidth='md'
            scroll='paper'
            className='root-edit-entrance'
            open={props.open} onClose={props.handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Thông điệp yêu thương - {props.selectedEntrance.sname}</h4>
            </DialogTitle>
            <DialogContent>
                    {messages.map( a => {
                            return(
                                <Grid container spacing = {2} className="messages" 
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid item md={1} sm={2}>
                                        <Avatar src={a.avatar} />
                                    </Grid>
                                    <Grid item md={11} sm={10} className="message-content">
                                        <div>
                                            <span className="user_name"> {a.name} </span> 
                                            {(a.method) ? 
                                                <span className="method"> • { a.method } </span> : ""   
                                            }
                                            {(a.sname) ? 
                                                <span className="method"> • { a.sname } </span> : ""   
                                            }
                                            <p className="content">{ a.content }</p>
                                            <Can I='delete_comment' on='Ghi danh'>
                                                <span className="delete">
                                                    <a onClick={() => deleteMessage(a.id)}>Xoá</a>
                                                </span>
                                            </Can>
                                            <span className="time"> • {a.created_at_formated} </span>
                                        </div>
                                    </Grid>
                                </Grid>
                            )
                    })}
                
            </DialogContent> 
            <DialogActions>
            <Grid container spacing={2}>
                    <Grid item md={7} sm={12}>
                        <TextField  label="Ghi chú" 
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
                    </Grid>
                    <Grid item md={3} sm={12}>
                        <FormControl variant="outlined" fullWidth size="small">
                            <InputLabel id="demo-simple-select-outlined-label">Cách thức</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={method}
                                onChange={onMethodChange}
                                label="Cách thức"
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value='SMS'>SMS</MenuItem>
                            <MenuItem value='Điện thoại'>Điện thoại</MenuItem>
                            <MenuItem value='Email'>Email</MenuItem>
                            <MenuItem value='Trực tiếp'>Trực tiếp</MenuItem>
                            <MenuItem value='Facebook'>Facebook</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={2} sm={12}>
                        <Button disabled={disable} onClick={() => handleCreateComment()} color="primary" id="btn-save">
                            Lưu ghi chú
                        </Button> 
                    </Grid>
                </Grid>              
            </DialogActions>
        </Dialog>
    )

}
export default MessageDialog