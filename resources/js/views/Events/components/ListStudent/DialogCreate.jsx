import React , { useState, useEffect } from 'react';
import { ClassSearch } from '../../../../components';
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
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import NumberFormat from 'react-number-format';

import { StudentForm, ParentForm } from '../../../Entrance/components';
import { withSnackbar } from 'notistack';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ReactSelect from 'react-select';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import InputAdornment from '@material-ui/core/InputAdornment';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
function NumberFormatCustom(props) {
    const { inputRef, onChange, name, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              name: name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
}

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
    drop_date: null,
    drop_reason: '',
    create_fee : true,      
    transfer_date : null,   
    new_active_date: null,
    transfer_class : null,
    transfer_reason: '',
    disable: false,
    
    selected_sessions: null,
    
}
var disable = false
class DialogCreate extends React.Component {    
    constructor(props){
        super(props)        
        this.state = initState
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        disable = false
        const selected_sessions = (nextProps.student.sessions_arr)?nextProps.student.sessions_arr.map(s => {return {value: s.id, label: s.content}}):null
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
                active_date: new Date(nextProps.student.entrance_date),
                drop_date : (nextProps.student.drop_time) ? new Date(nextProps.student.drop_time) : null,
                transfer_date: (nextProps.student.transfer_date) ? new Date(nextProps.student.transfer_date) : null,
                drop_reason : (nextProps.student.stats)?nextProps.student.stats.drop_reason : null,

                selected_sessions
            })
        }
        if(nextProps.type == 'create'){
            this.setState(initState)
        }
    }
    onSessionChange = (newValue) => {
        this.setState({selected_sessions: newValue})
    }
    handleStudentChange = (newValue) => {
        if(!newValue || newValue.__isNew__){
            this.setState({
                student_name: newValue,
                
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
            newValue.label = newValue.label.replace(/\s|[(]|[)]|[-]/g, '')
            newValue.value = newValue.label.replace(/\s|[(]|[)]|[-]/g, '')
            this.setState({
                parent_phone: newValue,
                parent_name: '',
                parent_alt_name: '',
                parent_email: '',
                parent_alt_email: '',
                parent_alt_phone: '',
                parent_note: '',
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
                parent_id : newValue.pid
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
    handleDropDate = date => {
        this.setState({ drop_date: date});
    }
    handleTransferDate = date => {
        this.setState({ transfer_date: date});
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
    handleDialogCreate = (e) => {
        e.preventDefault();
        disable = true
        let data = this.state
        data.class_id = this.props.class_id
        
        axios.post(baseUrl + '/class/add-student', data)
            .then(response => {
                this.props.handleClose()
                this.props.enqueueSnackbar('Thêm học sinh thành công', { 
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
                maxWidth='xl'
                scroll='body'
                open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
                classes={{ paperScrollPaper: 'dialog-with-select' }}
            >
                <DialogTitle id="form-dialog-title">Thêm học sinh</DialogTitle>
            <DialogContent className="dialog-create-student dialog-with-select">
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
                    <h5 className="title-header">Đăng ký thi thử</h5>
                        <Grid container spacing={3}>
                            <Grid item md={8} sm={12}>
                                <ReactSelect
                                    className="class-select"
                                    placeholder="Chọn môn thi"
                                    closeMenuOnSelect={false}
                                    defaultValue={[]}
                                    onChange = {this.onSessionChange}
                                    value={this.state.selected_sessions}
                                    isMulti
                                    options={this.props.sessions}
                                />    
                            </Grid>
                            <Grid item md={4} sm={12}> 
                                {/* <FormControl fullWidth variant="outlined" margin="dense">
                                    <InputLabel htmlFor="outlined-adornment-amount">Lệ phí</InputLabel>
                                    <OutlinedInput
                                        value={this.state.fee}
                                        name = "fee"
                                        onChange={this.onChange}
                                        startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                        labelWidth={50}
                                        inputComponent = {NumberFormatCustom}
                                    >
                                    </OutlinedInput>
                                </FormControl> */}
                                
                            </Grid>
                            
                        </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.handleClose} color="primary">
                    Hủy bỏ
                </Button>
                {(this.props.type == 'edit') ?  
                    (<Button onClick={this.handleSubmitEdit} color="primary" id="btn-save" disabled={disable}>
                        Lưu
                    </Button>)
                    : 
                    (<Button onClick={this.handleDialogCreate} color="primary" id="btn-save" disabled={disable}>
                        Xác nhận
                    </Button>)}
                
                
            </DialogActions>
        </Dialog>
        )
    }
}
export default withSnackbar(DialogCreate)