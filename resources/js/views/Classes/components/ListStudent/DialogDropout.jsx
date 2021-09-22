import React , { useState, useEffect } from 'react';
import { ClassSearch } from '../../../../components';
// import './DialogDropout.scss'
import axios from 'axios';
import _ from "lodash";
import Box from '@material-ui/core/Box';
// import './DialogDropout.scss';
import { Paper, Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { StudentForm, ParentForm } from '../../../Entrance/components';
import { withSnackbar } from 'notistack';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const baseUrl = window.Laravel.baseUrl
const initState = {
    status: 'droped',
    active_date: new Date(),
    drop_date: null,
    drop_reason: '',
    create_fee : true,      
    transfer_date : null,   
    new_active_date: null,
    transfer_class : null,
    transfer_reason: '',
    disable: false,

    retain_end : null,
    retain_start: null,
}
var disable = false
class DialogDropout extends React.Component {    
    constructor(props){
        super(props)        
        this.state = initState
    }

    handleChange = (newValue , event)=> {
        this.setState({
            [event.name]: newValue
        })    
    };
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
        if(e.target.name == "status" && e.target.value == "active"){
            this.setState({ create_fee : true })
        }
    };
    onChangePhone = e => {
        this.setState({
            [e.target.name] : e.target.value.replace(/\s|[(]|[)]|[-]/g, '')
        })
    }
    handleDateChange = date => {
        this.setState({ student_dob: date });
    };
    handleChecked = e => {
        this.setState({
            [e.target.name] : e.target.checked
        })
    }
    handleActiveDateChange = date => {
        this.setState({ active_date : date });
    }
    handleDropDate = date => {
        this.setState({ drop_date: date});
    }
    handleTransferDate = date => {
        this.setState({ drop_date: date});
    }
    handleNewActiveDateChange = date => {
        this.setState({ new_active_date: date });
    }
    onTranferClassChange = newValue => {
        this.setState({ transfer_class: newValue })
    }
    handleSubmitEdit = (e) => {
        disable = true
        e.preventDefault();
        let data = this.state
        data.class_id = this.props.class_id
        
        axios.post(baseUrl + '/class/edit-student', data)
            .then(response => {  
                this.props.handleClose()
                this.props.enqueueSnackbar('Sửa học sinh thành công', { 
                    variant: 'success',
                });
                
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi, vui lòng thử lại', { 
                    variant: 'error',
                });
            })
        
    }
    handleDialogDropout = (e) => {
        e.preventDefault();
        disable = true
        let data = this.state
        data.class_id = this.props.class_id
        data.students = this.props.students
        axios.post(baseUrl + '/class/drop-students', data)
            .then(response => {
                this.props.handleClose()
                this.props.enqueueSnackbar('Nghỉ học thành công', { 
                    variant: 'success',
                });
            })
            .catch(err => {                
                // console.log("create student bug: " + err.response.data)ư
                if(err.response.status == 418){
                    this.props.enqueueSnackbar(err.response.data , {variant: 'error'})
                }
                let variant = ''
                let response = err.response
                if(response.status == 404){
                    variant = 'error'
                }else{
                    variant = 'warning'
                }
                let errors = response.data.errors
                for (var key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        this.props.enqueueSnackbar(errors[key][0], { 
                            variant: variant,
                        });
                    }
                }               
                
            })
    }
    render(){        
        return(
            
            <Dialog 
                fullWidth 
                maxWidth='sm'
                scroll='body'
                open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
                classes={{ paperScrollPaper: 'dialog-with-select' }}
            >
                <DialogTitle id="form-dialog-title"></DialogTitle>
            <DialogContent className="dialog-create-student dialog-with-select">                   
                    <h5 className="title-header">Nghỉ học</h5>
                    <div className="date-time">
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                            <KeyboardDatePicker
                                autoOk
                                minDate = {this.state.active_date}
                                className="input-date input-text"
                                variant="inline"
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                placeholder="Ngày nghỉ học"
                                views={["year", "month", "date"]}
                                value={this.state.drop_date}
                                onChange={this.handleTransferDate}
                            />      
                        </MuiPickersUtilsProvider>     
                    </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.handleClose} color="primary">
                    Hủy bỏ
                </Button>
                    <Button onClick={this.handleDialogDropout} color="primary" id="btn-save">
                        Xác nhận
                    </Button>
            </DialogActions>
        </Dialog>
        )
    }
}
export default withSnackbar(DialogDropout)