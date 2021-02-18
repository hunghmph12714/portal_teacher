import React , { useState, useEffect } from 'react';
import axios from 'axios';
import _ from "lodash";
import Box from '@material-ui/core/Box';
import { StudentSearch, ParentSearch } from '../../../components'

import './QuickCreateEntrance.scss';
import { Paper, Grid, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import { StudentForm, ParentForm, EntranceForm } from '../components';
import { withSnackbar } from 'notistack';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import Select , { components }  from "react-select";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
const baseUrl = window.Laravel.baseUrl
const CenterSelect = React.memo(props => {
    const [centers, setCenters] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/get-center')
            setCenters(r.data.map(center => {
                    return {label: center.name, value: center.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select className = "select-entrance"
            key = "center-select"
            value = {props.entrance_center}
            name = "entrance_center"
            placeholder="Cơ sở"
            options={centers}
            onChange={props.handleChange}
        />)
})
const SourceSelect = React.memo(props => {
    const [options, setOptions] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get('/get-sources')
            setOptions(r.data)
        }
        fetchData()
    }, [])
    
    return( 
        <Select className = "select-entrance"
            key = "center-select"
            value = {props.source}
            name = "source"
            placeholder="Nguồn"
            options={options}
            onChange={props.handleChange}
        />)
})
class QuickCreateEntrance extends React.Component {    
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
            source: '',
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
        newValue.label = newValue.label.replace(/\s|[(]|[)]|[-]/g, '')
            newValue.value = newValue.label.replace(/\s|[(]|[)]|[-]/g, '')
        if(!newValue ||newValue.__isNew__){
            this.setState({
                parent_phone: newValue
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
    };
    onChangePhone = e => {
        this.setState({
            [e.target.name] : e.target.value.replace(/\s|[(]|[)]|[-]/g, '')
        })
    };
    handleDateChange = date => {
        this.setState({ student_dob: date });
    };
    handleEntranceDateChange = date => {
        this.setState({ entrance_date: date });
    }
    handleQuickCreateEntrance = (e) => {
        e.preventDefault();
        let data = this.state
        data.entrance_date = this.state.entrance_date.getTime()/1000
        data.student_dob = this.state.student_dob.getTime()/1000
   
        axios.post(baseUrl + '/entrance/create', data)
            .then(response => {
                this.props.enqueueSnackbar('Tạo ghi danh thành công', { 
                    variant: 'success',
                });
                setTimeout(this.props.history.push('/entrance/list/1/0'), 1000)
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
            <div  className="root-create-entrance"> 
                <form noValidate autoComplete="on">
                    <Paper elevation={4}>
                        <h4 className="root-header">Ghi danh học sinh</h4>
                        <h5 className="title-header">Thông tin học sinh</h5> 
                        <Grid container spacing={3} className="student-form" >                
                            <Grid item md={6} lg={6} sm={12} xs={12}>
                                <StudentSearch
                                    student_name={this.state.student_name}
                                    handleStudentChange={this.handleStudentChange}
                                />
                            </Grid>
                            <Grid item md={6} lg={6} sm={12} xs={12}>
                                <div className="date-time">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>

                                        <KeyboardDatePicker
                                            autoOk
                                            className="input-date"
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            placeholder="Ngày sinh"
                                            views={["year", "month", "date"]}
                                            value={this.state.student_dob}
                                            onChange={this.handleDateChange}
                                        />                     
                                    </MuiPickersUtilsProvider>     
                                </div>
                        
                            </Grid>
                        </Grid>
                        
                        <Divider/>                        
                            <h5 className="title-header">Thông tin phụ huynh</h5>
                            <Grid container spacing={3} className="student-form" >                
                                <Grid item md={4} lg={4} sm={12} xs={12}>
                                    <TextField  label="Họ tên phụ huynh" 
                                        className = "input-text"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        fullWidth
                                        margin = "dense"
                                        name = 'parent_name'
                                        value = {this.state.parent_name}
                                        onChange = {this.onChange}
                                    /> 
                                </Grid>
                                <Grid item md={4} lg={4} sm={12} xs={12}>
                                    <ParentSearch
                                        parent_phone = {this.state.parent_phone}
                                        handleParentChange = {this.handleParentChange}
                                    />
                                </Grid>
                                <Grid item md={4} lg={4} sm={12} xs={12}>
                                    <TextField  label="Email" 
                                        className = "input-text"
                                        variant="outlined"
                                        size="small"
                                        type="email"
                                        fullWidth
                                        margin = "dense"
                                        name = 'parent_email'
                                        value = {this.state.parent_email}
                                        onChange = {this.onChange}
                                    />
                                </Grid>
                            
                            </Grid>
                            
                        <Divider/>

                        <h5 className="title-header">Nguyện vọng đăng ký</h5>
                            <Grid container spacing={3} className="student-form" >                
                                <Grid item md={4} lg={4} sm={12} xs={12}>
                                    <CenterSelect 
                                        entrance_center = {this.state.entrance_center}
                                        handleChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item md={4} lg={4} sm={12} xs={12}>
                                    <TextField  label="Nguyện vọng" 
                                        className = "input-text"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        fullWidth
                                        margin = "dense"
                                        name = 'entrance_note'
                                        value = {this.state.entrance_note}
                                        onChange = {this.onChange}
                                    /> 
                                </Grid>
                                <Grid item md={4} lg={4} sm={12} xs={12}>
                                    <SourceSelect 
                                        source = {this.state.source}
                                        handleChange = {this.handleChange}
                                    />
                                </Grid>
                            </Grid>
                        <Box flexDirection="row-reverse" display="flex">
                            <Button onClick={this.handleQuickCreateEntrance} color="secondary" id="btn-save" variant="contained"
                                type="submit"
                                color="secondary"
                                size="large"
                                startIcon={<SaveIcon />}>
                                Tạo mới ghi danh
                            </Button>
                        </Box>
                        
                    </Paper>
                </form>
            </div>
        )
    }
}
export default withSnackbar(QuickCreateEntrance)