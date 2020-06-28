import React , { useState, useEffect } from 'react';
import axios from 'axios';
import _ from "lodash";
import Box from '@material-ui/core/Box';
// import './DialogCreate.scss';
import { Paper} from '@material-ui/core';
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
const baseUrl = window.Laravel.baseUrl

class DialogCreate extends React.Component {    
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

            entrance_center: '',
            entrance_courses: [],
            entrance_multi_course: true,
            entrance_date: new Date(),
            entrance_note: '',           

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
    };
    handleDateChange = date => {
        this.setState({ student_dob: date });
    };
    handleEntranceDateChange = date => {
        this.setState({ entrance_date: date });
    }
    handleDialogCreate = (e) => {
        e.preventDefault();
        let data = this.state
        data.entrance_date = this.state.entrance_date.getTime()/1000
        data.student_dob = this.state.student_dob.getTime()/1000
   
        axios.post(baseUrl + '/entrance/create', data)
            .then(response => {
                this.props.enqueueSnackbar('Tạo ghi danh thành công', { 
                    variant: 'success',
                });
                setTimeout(this.props.history.push('/entrance/list'), 1000)
            })
            .catch(err => {
                this.setState({
                    entrance_date : new Date(data.entrance_date*1000),
                    student_dob : new Date(data.student_dob * 1000)
                })
                // console.log("create entrance bug: " + err.response.data)
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
            <DialogContent>
                <DialogContentText>
                    Vui lòng điền đầy đủ thông tin cần thiết (*)
                </DialogContentText>
                    <h5 className="title-header">Thông tin học sinh</h5> 
                    <StudentForm 
                        state = {this.state}
                        handleStudentChange = {this.handleStudentChange} 
                        handleDateChange = {this.handleDateChange}
                        onChange = {this.onChange}
                        handleChange = {this.handleChange}
                    />
                    <Divider/>                        
                    <h5 className="title-header">Thông tin phụ huynh</h5>
                    <ParentForm
                        state = {this.state}
                        handleParentChange = {this.handleParentChange} 
                        onChange = {this.onChange}
                        handleChange = {this.handleChange}
                    />
                    <Divider/>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.handleClose} color="primary">
                    Hủy bỏ
                </Button>
                <Button onClick={this.handleCreateNewClass} color="primary" id="btn-save">
                    Xác nhận
                </Button>
                
            </DialogActions>
        </Dialog>
        )
    }
}
export default withSnackbar(DialogCreate)