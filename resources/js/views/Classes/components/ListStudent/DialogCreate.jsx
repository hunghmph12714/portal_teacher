import React , { useState, useEffect } from 'react';
import './DialogCreate.scss'
import axios from 'axios';
import _ from "lodash";
import Box from '@material-ui/core/Box';
// import './DialogCreate.scss';
import { Paper, Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { StudentForm, ParentForm } from '../../../Entrance/components';
import { withSnackbar } from 'notistack';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
const baseUrl = window.Laravel.baseUrl
const initState = {
    schools: [],
    student_id: '',
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

    status: '',
    active_date: new Date(),
    create_fee : true,         

}
class DialogCreate extends React.Component {    
    constructor(props){
        super(props)        
        this.state = initState
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.type == 'edit'){
            this.setState({
                student_id: nextProps.student.id,
                student_name: {__isNew__: false, label: nextProps.student.fullname, value: nextProps.student.id},
                student_dob: new Date(nextProps.student.dob),
                student_school: {label: nextProps.student.school, value: nextProps.student.school},
                student_grade: nextProps.student.grade,
                student_gender: nextProps.student.gender,
                student_email: nextProps.student.semail,
                student_phone: nextProps.student.sphone,
    
                parent_id: nextProps.student.parent_id,
                parent_name: nextProps.student.pname,
                parent_alt_name: nextProps.student.alt_pname,
                parent_email: nextProps.student.pemail,
                parent_alt_email: nextProps.student.alt_pemail,
                parent_phone:  {__isNew__: false, label: nextProps.student.pphone, value: nextProps.student.pphone},
                parent_alt_phone: nextProps.student.alt_phone,
                parent_note: nextProps.student.pnote,
                selected_relationship: {__isNew__: false, label: nextProps.student.rname, value: nextProps.student.rid, color: nextProps.student.color},

                status: nextProps.student.status,

            })
        }
        if(nextProps.type == 'create'){
            this.setState(initState)
        }
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
    
                parent_phone: {__isNew__: false, value: newValue.pid, label: newValue.p_phone},
                parent_name: newValue.p_name,
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
                parent_phone: newValue.replace(/\s|[(]|[)]|[-]/g, '')
            }) 
        }
        else{
            this.setState({                
                parent_phone: {__isNew__: false, value: newValue.pid, label: newValue.phone},
                parent_name: newValue.fullname,
                parent_email: newValue.email,
                parent_alt_name: newValue.alt_fullname,
                parent_alt_email: newValue.alt_email,
                parent_alt_phone: newValue.alt_phone,
    
                selected_relationship: {color: newValue.color, label: newValue.r_name, value: newValue.rid},
                parent_note : (newValue.note)?newValue.note:'',
            }) 
        }
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
    
    handleDialogCreate = (e) => {
        e.preventDefault();
        let data = this.state
        data.class_id = this.props.class_id
        axios.post(baseUrl + '/class/add-student', data)
            .then(response => {
                this.props.enqueueSnackbar('Thêm học sinh thành công', { 
                    variant: 'success',
                });
                this.props.handleClose()
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
                maxWidth='lg'
                scroll='paper'
                open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Thêm học sinh</DialogTitle>
            <DialogContent className="dialog-create-student">
                <DialogContentText>
                    Vui lòng điền đầy đủ thông tin cần thiết (*)
                </DialogContentText>
                    <h5 className="title-header">Thông tin học sinh</h5> 
                    <StudentForm 
                        state = {this.state}
                        handleStudentChange = {this.handleStudentChange} 
                        handleDateChange = {this.handleDateChange}
                        onChange = {this.onChange}
                        onChangePhone = {this.onChangePhone}
                        handleChange = {this.handleChange}
                    />
                    <Divider/>                        
                    <h5 className="title-header">Thông tin phụ huynh</h5>
                    <ParentForm
                        state = {this.state}
                        handleParentChange = {this.handleParentChange} 
                        onChange = {this.onChange}
                        onChangePhone = {this.onChangePhone}
                        handleChange = {this.handleChange}
                    />
                    <Divider/>
                    <h5 className="title-header">Nhập học</h5>
                        <Grid container spacing={3}>
                            <Grid item md={4} sm={12}>
                                <FormControl variant="outlined" size="small" fullWidth className="input-text">
                                    <InputLabel className="input-text">Trạng thái</InputLabel>
                                    <Select
                                        className="input-text"
                                        name="status"
                                        value={this.state.status}
                                        onChange={this.onChange}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value={'active'}>Hoạt động</MenuItem>
                                        <MenuItem value={'waiting'}>Chờ học</MenuItem>
                                        <MenuItem value={'retain'}>Bảo lưu</MenuItem>
                                    </Select>
                                </FormControl>    
                            </Grid>
                            <Grid item md={4} sm={12}> 
                                <div className="date-time">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            autoOk
                                            className="input-date input-text"
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            placeholder="Ngày nhập học"
                                            views={["year", "month", "date"]}
                                            value={this.state.active_date}
                                            onChange={this.handleActiveDateChange}
                                        />                     
                                    </MuiPickersUtilsProvider>     
                                </div>
                            </Grid>
                            <Grid item md={4} sm={12}> 
                            <FormControlLabel
                                control = {
                                    <Checkbox checked={this.state.create_fee} onChange={this.handleChecked} name="create_fee" disabled={this.state.status == 'active'}/>
                                }
                                label="Khởi tạo học phí"
                                className="input-text"
                            />
                            </Grid>
                        </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.handleClose} color="primary">
                    Hủy bỏ
                </Button>
                {(this.props.type == 'edit') ?  
                    (<Button onClick={this.handleSubmitEdit} color="primary" id="btn-save">
                        Lưu
                    </Button>)
                    : 
                    (<Button onClick={this.handleDialogCreate} color="primary" id="btn-save">
                        Xác nhận
                    </Button>)}
                
                
            </DialogActions>
        </Dialog>
        )
    }
}
export default withSnackbar(DialogCreate)