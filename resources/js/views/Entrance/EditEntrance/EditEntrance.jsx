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

import { StudentForm, ParentForm, EntranceForm } from '../components';

const baseUrl = window.Laravel.baseUrl
// function dmyToMdy (str){
//     let arr = str.split('/')
//     if(arr.length >= 3){
//         let mdy = arr[1]+'/'+arr[0]+'/'+arr[2]
//         return mdy
//     }
//     else return null
// }
class EditEntrance extends React.Component {
    constructor(props){
        super(props)
        this.state = {
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

            entrance_center: [],
            entrance_courses: [],
            entrance_date: new Date(),
            entrance_note: '',  
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        let dob_str = ""
        let test_time = ""
        if(nextProps.entrance){
            let dob_arr = nextProps.entrance.dob.split('/')
            dob_str = (dob_arr.length >2 )?dob_arr[1]+'/'+dob_arr[0]+'/'+dob_arr[2]: null
            let test_time_arr = nextProps.entrance.test_time.split('/')
            test_time = (test_time_arr.length > 2) ? test_time_arr[1] + '/' + test_time_arr[0] + '/' + test_time_arr[2] : null
        }
        this.setState({
            student_name: {__isNew__: false, label: nextProps.entrance.sname, value: nextProps.entrance.sid},
            student_dob: new Date(dob_str),
            student_school: nextProps.entrance.school,
            student_grade: nextProps.entrance.grade,
            student_gender: nextProps.entrance.gender,
            student_email: nextProps.entrance.semail,
            student_phone: nextProps.entrance.sphone,

            parent_name: {__isNew__: false, label: nextProps.entrance.pname, value: nextProps.entrance.pid},
            parent_alt_name: nextProps.entrance.alt_pname,
            parent_email: nextProps.entrance.pemail,
            parent_alt_email: nextProps.entrance.alt_pemail,
            parent_phone: nextProps.entrance.phone,
            parent_alt_phone: nextProps.entrance.alt_phone,
            parent_note: nextProps.entrance.pnote,
            selected_relationship: {__isNew__: false, label: nextProps.entrance.rname, value: nextProps.entrance.rid},

            entrance_center: { label: nextProps.entrance.center, value: nextProps.entrance.center_id},
            entrance_courses: {label: nextProps.entrance.course, value: nextProps.entrance.course_id},
            entrance_date: new Date(test_time),
            entrance_note: nextProps.entrance.enote,  
        })
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
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        
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
                        
                        <Divider/>

                        <h5 className="title-header">Nguyện vọng đăng ký</h5>
                        <EntranceForm 
                            state = {this.state}
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
                    <Button onClick={() => {}} color="primary" id="btn-save">
                        Lưu thay đổi
                    </Button>
                    
                </DialogActions>
            </Dialog>
        )
    }
    
}
export default EditEntrance