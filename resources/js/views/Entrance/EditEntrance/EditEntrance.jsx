import React from 'react'
import './EditEntrance.scss'
import { Grid, Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withSnackbar } from 'notistack';

import { StudentForm, ParentForm, EntranceForm, TestForm, StatusForm, EnrollForm } from '../components';
import axios from 'axios';

const baseUrl = window.Laravel.baseUrl

class EditEntrance extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            student_id: '',
            student_name: '',
            student_dob: new Date(),
            student_school: '',
            student_grade: '',
            student_gender: 'Khác',
            student_email: '',
            student_phone: '',
            student_changed: false,

            parent_id: '',
            parent_name: '',
            parent_alt_name: '',
            parent_email: '',
            parent_alt_email: '',
            parent_phone: '',
            parent_alt_phone: '',
            parent_note: '',            
            selected_relationship: '',
            parent_changed: false,

            entrance_id: '',
            entrance_center: [],
            entrance_courses: [],
            entrance_classes: null,
            entrance_multi_course: false,
            entrance_date: new Date(),
            entrance_note: '', 
            entrance_step: [],
            entrance_status: [],
            enroll_date: new Date(),

            test_answers: [],
            answers_changed : false,
            test_user: '',
            test_score: '',
            test_note: '',
            entrance_changed: true,            
            enroll_disabled: false
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        let dob_str = ""
        let test_time = ""
        let enroll_date = new Date(nextProps.entrance.enroll_date)
        if(nextProps.entrance){
            if(nextProps.entrance.dob){
                let dob_arr = nextProps.entrance.dob.split('/')
                dob_str = (dob_arr.length >2 )?dob_arr[1]+'/'+dob_arr[0]+'/'+dob_arr[2]: ''
            }else{
                dob_str = ''
            }
            
            if(nextProps.entrance.test_time){
                let test_time_arr =  nextProps.entrance.test_time.split('/')
                test_time = (test_time_arr.length > 2) ? test_time_arr[1] + '/' + test_time_arr[0] + '/' + test_time_arr[2] : null
            }else{
                test_time = ''
            }
        }
        this.setState({            
            student_id: nextProps.entrance.sid,
            student_name: {__isNew__: false, label: nextProps.entrance.sname, value: nextProps.entrance.sid},
            student_dob: new Date(dob_str),
            student_school: {label: nextProps.entrance.school, value: nextProps.entrance.school},
            student_grade: nextProps.entrance.grade,
            student_gender: nextProps.entrance.gender,
            student_email: nextProps.entrance.semail,
            student_phone: nextProps.entrance.sphone,

            parent_id: nextProps.entrance.pid,
            parent_name: {__isNew__: false, label: nextProps.entrance.pname, value: nextProps.entrance.pid},
            parent_alt_name: nextProps.entrance.alt_pname,
            parent_email: nextProps.entrance.pemail,
            parent_alt_email: nextProps.entrance.alt_pemail,
            parent_phone: nextProps.entrance.phone,
            parent_alt_phone: nextProps.entrance.alt_phone,
            parent_note: nextProps.entrance.pnote,
            selected_relationship: {__isNew__: false, label: nextProps.entrance.rname, value: nextProps.entrance.rid, color: nextProps.entrance.color},

            entrance_id: nextProps.entrance.eid,
            entrance_center: { label: nextProps.entrance.center, value: nextProps.entrance.center_id},
            entrance_courses: {label: nextProps.entrance.course, value: nextProps.entrance.course_id},
            entrance_classes: (nextProps.entrance.class_id)?{ label: nextProps.entrance.class, value: nextProps.entrance.class_id }:null,
            entrance_date: new Date(test_time),
            entrance_note: (nextProps.entrance.enote)?nextProps.entrance.enote:'',  
            entrance_step: { label: nextProps.entrance.step, value: nextProps.entrance.step_id },
            entrance_status: { label: nextProps.entrance.status, value: nextProps.entrance.status_id},
            enroll_date : (nextProps.entrance.enroll_date)?enroll_date:null,
            test_answers: (nextProps.entrance.test_answers)?nextProps.entrance.test_answers:[],
            test_score: nextProps.entrance.test_score,
            test_note: nextProps.entrance.test_note,

        })
    }
    handleStudentChange = (newValue) => {
        if(!newValue || newValue.__isNew__){
            this.setState({
                student_name: newValue,
                student_changed: true
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
            student_changed: (e.target.name.includes('student')) ? true: false,
            parent_changed: (e.target.name.includes('parent') || e.target.name.includes('relationship')) ? true: false,
            entrance_changed: true,
            [e.target.name] : e.target.value
        })
    };
    handleDateChange = date => {
        this.setState({ student_dob: date, student_changed: true });
    };
    handleEntranceDateChange = date => {
        this.setState({ entrance_date: date, entrance_changed: true });
    }
    handleEnrollDateChange = date => {
        this.setState({ enroll_date: date, entrance_changed: true });

    }
    handleUploadFile = (files) => {
        this.setState({test_answers : files , entrance_changed: true, answers_changed: true})
    }
    handleEditEntrance = (e) => {
        e.preventDefault();
        let data = this.state
        axios.post(baseUrl+'/entrance/edit', data)
            .then(response => {
                if(this.state.test_answers && this.state.answers_changed){
                    let fd = new FormData()
                    for(let i = 0 ; i < this.state.test_answers.length ; i++){
                        fd.append('image'+i , this.state.test_answers[i], this.state.test_answers[i].name)
                    }
                    fd.append('entrance_id' , this.state.entrance_id)
                    fd.append('count', this.state.test_answers.length)
                    axios.post(baseUrl + '/entrance/upload-test', fd)
                        .then(uploaded => {
                            this.props.enqueueSnackbar('Sửa thành công', { 
                                variant: 'success',
                            });
                        })
                        .catch(err => {
                            console.log(err.resposne.data)
                        })
                }
                else{
                    this.props.enqueueSnackbar('Sửa thành công', { 
                        variant: 'success',
                    });
                }
                this.props.updateTable()
                this.props.handleCloseDialog()
            })
            .catch(err => {
                console.log(err)
            })
    }
    render(){
        return(
            <Dialog 
                fullWidth 
                maxWidth='xl'
                scroll='paper'
                className='root-edit-entrance'
                open={this.props.open} onClose={this.props.handleCloseDialog} aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    <h4>Chỉnh sửa ghi danh</h4>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vui lòng điền đầy đủ thông tin cần thiết (*)
                    </DialogContentText>
                    <form noValidate autoComplete="on">
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={12}> 
                                <h5 className="title-header">Thông tin học sinh</h5> 
                                <ExpansionPanel key="student">
                                    <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Typography>{this.state.student_name.label}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <StudentForm 
                                            state = {this.state}
                                            handleStudentChange = {this.handleStudentChange} 
                                            onChange = {this.onChange}
                                            handleChange = {this.handleChange}
                                            handleDateChange = {this.handleDateChange}
                                        />
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            
                            </Grid>
                            <Grid item lg={6} md={12}>
                                <h5 className="title-header">Thông tin phụ huynh</h5>
                                <ExpansionPanel key="parent">
                                    <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Typography>{this.state.parent_name.label}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                    <ParentForm
                                        state = {this.state}
                                        handleParentChange = {this.handleParentChange} 
                                        onChange = {this.onChange}
                                        handleChange = {this.handleChange}
                                    />
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                        
                            </Grid>
                        </Grid>
                        
                        <h5 className="title-header">Nguyện vọng đăng ký</h5>
                        <EntranceForm 
                            state = {this.state}
                            handleEntranceDateChange = {this.handleEntranceDateChange} 
                            onChange = {this.onChange}
                            handleChange = {this.handleChange}
                        />
                        <Grid container spacing={1}>
                            <Grid item lg={6} md={12}> 
                                <h5 className="title-header">Trạng thái</h5>
                                <StatusForm 
                                    state = {this.state}
                                    handleEntranceDateChange = {this.handleEntranceDateChange} 
                                    onChange = {this.onChange}
                                    handleChange = {this.handleChange}
                                />
                            </Grid>
                            <Grid item lg={6} md={12}>
                                <h5 className="title-header">Xếp lớp</h5>
                                <EnrollForm 
                                    state = {this.state}
                                    handleDateChange = {this.handleEnrollDateChange} 
                                    onChange = {this.onChange}
                                    handleChange = {this.handleChange}
                                />
                            </Grid>
                        </Grid>
                        
                        <h5 className="title-header">Kiểm tra đầu vào</h5>
                                <TestForm 
                                    state = {this.state}
                                    handleUploadFile = {this.handleUploadFile}
                                    handleEntranceDateChange = {this.handleEntranceDateChange} 
                                    onChange = {this.onChange}
                                    handleChange = {this.handleChange}
                                />
                        
                    </form>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleCloseDialog} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={this.handleEditEntrance} color="primary" id="btn-save">
                        Lưu thay đổi
                    </Button>
                    
                </DialogActions>
            </Dialog>
        )
    }
    
}
export default withSnackbar(EditEntrance)