import React , {useState, useEffect} from 'react'
import { StudentSearch, ParentSearch } from '../../components'
import { StudentForm, ParentForm } from '../Entrance/components'
import './Fee.scss'
import axios from 'axios'
import { withSnackbar } from 'notistack';
import Select , { components }  from "react-select";
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns'
import {
    Tooltip,
  } from "@material-ui/core";
import { Grid } from '@material-ui/core';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
const baseUrl = window.Laravel.baseUrl;
const customChip = (color = '#ccc') => ({
  border: '1px solid ' + color,
  color: '#000',
  fontSize: '12px',
})
var sum = '0';
const StudentInfo = props => {
    useEffect(() => {
        const { student, parent } = props
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            setClasses(r.data.map(c => {
                    // console.log(c)
                    return {label: c.code + ' - ' +c.name, value: c.id}
                })
            )
        }
        fetchData()
    }, [student])
    return (
        <div>
            <StudentForm 
                state = {this.state}
                handleStudentChange = {this.handleStudentChange} 
                onChange = {this.onChange}
                handleChange = {this.handleChange}
                handleDateChange = {this.handleDateChange}
            />
            <ParentForm
                state = {this.state}
                handleParentChange = {this.handleParentChange} 
                onChange = {this.onChange}
                handleChange = {this.handleChange}
            />
        </div>
    )
}
const StudentFee = props => {
    
}
const ClassSelect = React.memo(props => {
    const {center, course} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            setClasses(r.data.map(c => {
                    // console.log(c)
                    return {label: c.code + ' - ' +c.name, value: c.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select
            key = "class-select"
            value = {props.selected_class}
            name = "selected_class"
            placeholder="Chọn lớp"
            isClearable
            options={classes}
            onChange={props.handleChange}
        />)
})


// const studentInfo =
class Fee extends React.Component{
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
            fees: []
        }
    }
    handleClassChange = (newValue , event) => {
        if(this.state.selected_class != newValue){
            this.setState({selected_session: []})
            this.setState({
                selected_class : (newValue)?newValue:[],                
            })
        }       
        
    }    
    handleStudentChange = (newValue) => {
        this.setState({            
            student_name: {__isNew__: false, value: newValue.value, label: newValue.label},
            student_id: newValue.sid,
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
            parent_id: newValue.pid,

            selected_relationship: {color: newValue.color, label: newValue.r_name, value: newValue.r_id},
            parent_note : (newValue.note)?newValue.note:'',
        })         
    }
    handleParentChange = (newValue) => {
        // console.log(newValue)
        this.setState({
            parent_name: {__isNew__: false, value: newValue.pid, label: newValue.fullname},
            parent_phone: newValue.phone,
            parent_email: newValue.email,
            parent_alt_name: newValue.alt_fullname,
            parent_alt_email: newValue.alt_email,
            parent_alt_phone: newValue.alt_phone,
            parent_id: newValue.pid,
            selected_relationship: {color: newValue.color, label: newValue.r_name, value: newValue.rid},
            parent_note : (newValue.note)?newValue.note:'',
        }) 
    }
    onChange = e => {     
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    handleDateChange = date => {
        this.setState({ student_dob: date, student_changed: true });
    };
    handleChange = (newValue , event)=> {
        this.setState({            
            [event.name]: newValue
        })    
    };
    handleGetFee = () => {
        axios.post(baseUrl + '/fee/get', {student_id: this.state.student_id})
            .then(response => {
                this.setState({fees: response.data})
            })
            .catch(err => {
                console.log(err)
            })
    }
    render(){
        return(
            <React.Fragment>
                <Paper className="form-fee form-index">
                    <Grid container spacing={1} className="select-session">
                        <Grid item lg={5} sm={12} xs={12}>
                            <StudentSearch
                                student_name={this.state.student_name}
                                handleStudentChange={this.handleStudentChange}
                            />
                        </Grid>
                        <Grid item lg={5} sm={12} xs={12}>
                            <ParentSearch
                                parent_name = {this.state.parent_name}
                                handleParentChange = {this.handleParentChange}
                            />
                        </Grid>
                        <Grid item lg={2} sm={12} xs={12}>
                            <Button variant="contained" color="primary" fullWidth onClick = {this.handleGetFee}>
                                Kiểm tra
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider/>                
                </Paper>
                <Paper className="form-fee">
                    <Grid container spacing={1}>
                        <Grid item lg={12} sm={12} xs={12}>
                            {/* <StudentForm 
                                state = {this.state}
                                handleStudentChange = {this.handleStudentChange} 
                                onChange = {this.onChange}
                                handleChange = {this.handleChange}
                                handleDateChange = {this.handleDateChange}
                            />
                            <ParentForm
                                state = {this.state}
                                handleParentChange = {this.handleParentChange} 
                                onChange = {this.onChange}
                                handleChange = {this.handleChange}
                            /> */}
                        </Grid>
                        <Grid item lg={12} sm={12} xs={12}>
                        <MaterialTable
                            title= "Bảng kê Học Phí học sinh"
                            data={this.state.fees}
                            localization={{
                                pagination: {
                                    labelDisplayedRows: '{from}-{to} của {count}'
                                },
                                toolbar: {
                                    nRowsSelected: '{0} học phí được chọn'
                                },
                                header: {
                                    actions: 'Hành động'
                                },
                                body: {
                                    emptyDataSourceMessage: 'Không có học phí phát sinh',
                                    filterRow: {
                                        filterTooltip: 'Filter'
                                    }
                                }
                            }}
                            columns={[
                                { title: 'Tháng', field: 'month',headerStyle: { fontWeight: '600', }, },
                                { title: 'Ngày', field: 'time' ,headerStyle: { fontWeight: '600', }, },
                                { title: 'Nội dung', field: 'content' ,headerStyle: { fontWeight: '600', },},
                                { title: 'Lớp', field: 'cname', headerStyle: { fontWeight: '600', },},
                                { title: 'Số tiền', 
                                    field: 'amount', type: 'currency', currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0}, 
                                    headerStyle: {
                                        fontWeight: '600',
                                        textAlign: 'right'
                                    },
                                    cellStyle:{
                                        paddingRight: '34px',
                                    }
                                },
                            ]}
                            parentChildData={(row, rows) => rows.find(a => a.id === row.parent_id)}
                            options={{
                                selection: true,
                                exportButton: true,
                                pageSize: 20,
                                
                            }}  
                            />
                        </Grid>
                    </Grid>
                </Paper>

            </React.Fragment>
            
        )
    }
}
export default withSnackbar(Fee);
