import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Transaction.scss'
import { Grid, TextField, FormLabel, Paper   } from '@material-ui/core';
import { AccountSearch } from './components';
import { withSnackbar } from 'notistack'
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import NumberFormat from 'react-number-format';
import { format } from 'date-fns'
import SendIcon from '@material-ui/icons/Send';
import { StudentSearch } from '../../components';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import Select , { components }  from "react-select";
import Button from '@material-ui/core/Button';

const baseUrl = window.Laravel.baseUrl
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
            suffix="đ"
        />
    );
}
const ClassSelect = React.memo(props => {
    const {center, course, student} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            var r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            if(student){
                r = await axios.post(baseUrl + '/class/student', {'student_id': student.value})
            }
            setClasses(r.data.map(c => {
                return {label: c.code + ' - ' +c.name, value: c.id}
            }))        
            
        }
        fetchData()
    }, [student])
    
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
const SessionDateSelect = React.memo(props => {
    const {selected_class} = props
    const Vndate = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const [sessions, setSessions] = useState([])
    const [tmp_sessions, setTmpSession] = useState([])
    const fetchData = async() => {
        const r = await axios.post(baseUrl + '/session/get', {class_id: selected_class.value, from_date: -1, to_date: -1})
        let data = r.data.map(c => {
            let date = new Date(c.date)
            c.date = format(date , 'd/M/yyyy')
            c.day = format(date, 'i') 
            c.from = format(new Date(c.from), 'HH:mm')
            c.to = format(new Date(c.to), 'HH:mm')
            c.time = c.from + '-' + c.to
            return {label: Vndate[c.day]+ ': '+c.date+' ('+c.time+' )', value: c.sid, date : c.date, time: c.from, selected: -1}
        })
        setSessions(data)
        setTmpSession(data)
    }
    useEffect(() => {        
        if(selected_class){
            fetchData()            
        }
    }, [props.selected_class])
    
    return( 
        <div className = "select-input">
            <Select                
                key = "session-select"                
                value = {props.selected_session}
                name = "selected_session"
                placeholder="Chọn Ca học"
                options={sessions}
                onChange={props.handleChange}
            />                 
        </div>
    )
})

class Transaction extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            debit: [],
            credit: [],
            time: new Date(),
            student : null,
            amount :'',
            selected_class: [],
            selected_session:null,
        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleDebitChange = (newValue) => {
        this.setState({ debit: newValue })
    }
    handleCreditChange = (newValue) => {
        this.setState({ credit: newValue })
    }
    handleDateChange = date => {
        this.setState({ time: date });
    };
    handleStudentChange = (newValue) => {
        if(!newValue || newValue.__isNew__){
            this.setState({
                student: newValue
            }) 
        }
        else{
            this.setState({
                student: {__isNew__: false, value: newValue.value, label: newValue.label},                
            }) 
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
    handleSessionChange = (newValue) => {
        if(this.state.selected_session != newValue){
            this.setState({
                selected_session: (newValue) ? newValue:[],
            })            
        }
    }
    onSubmitTransaction = (event) => {
        event.preventDefault()
        let data = this.state
        data.time = data.time.getTime()/1000
        axios.post(baseUrl + '/transaction/add', this.state)
            .then(response => {

            })
    }
    render(){
        return(
            <React.Fragment>
                <div className="root-transaction">
                    <form noValidate autoComplete="on">
                        <Paper elevation={4} className="paper-transaction">
                            <Grid container spacing={2} id="transaction-form">
                                <Grid item xs={12} sm={4}>
                                    <FormLabel color="primary">Tài khoản nợ</FormLabel>
                                    <AccountSearch
                                        account={this.state.debit}
                                        handleAccountChange={this.handleDebitChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormLabel color="primary">Tài khoản có</FormLabel>
                                    <AccountSearch
                                        account={this.state.credit}
                                        handleAccountChange={this.handleCreditChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormLabel color="primary">Ngày </FormLabel> <br/>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            autoOk
                                            fullWidth
                                            value={this.state.time}                            
                                            onChange={this.handleDateChange}
                                            placeholder="Ngày giao dịch"                            
                                            className="input-date"
                                            variant="inline"
                                            size="small"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                        />
                                                    
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormLabel color="primary">Số tiền</FormLabel><br/>
                                    <TextField
                                        fullWidth
                                        value={this.state.amount}
                                        onChange={e => this.onChange(e)}
                                        name = "amount"
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                    />
                                </Grid>                    
                            </Grid>
                            <Grid container spacing={2}>
                                
                                <Grid item lg={4} xs={12}>
                                    <FormLabel color="primary">Học sinh</FormLabel>
                                    <StudentSearch
                                        student_name={this.state.student}
                                        handleStudentChange={this.handleStudentChange}
                                    />
                                </Grid>
                                <Grid  item lg={4} xs={12}>
                                    <FormLabel color="primary">Lớp học</FormLabel>
                                    <ClassSelect 
                                        selected_class = {this.state.selected_class}
                                        handleChange={this.handleClassChange}
                                        course = {-1}
                                        center = {-1}
                                        student = {this.state.student}
                                    />
                                </Grid>
                                <Grid item  lg={4} xs={12}>
                                    <FormLabel color="primary">Buổi học</FormLabel>
                                    <SessionDateSelect 
                                        selected_class = {this.state.selected_class}
                                        selected_session = {this.state.selected_session}
                                        handleChange={this.handleSessionChange}                        
                                    />
                                </Grid>
                                
                            </Grid>
                            <Grid item lg={12} xs={12}>
                                    <FormLabel color="primary">Miêu tả</FormLabel>
                                    <TextField
                                        id="outlined-multiline-static"
                                        fullWidth
                                        placeholder="Miêu tả của giao dịch"
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="submit-btn"
                                        onClick = {(e) => this.onSubmitTransaction(e)}
                                        endIcon={<SendIcon/>}
                                    >
                                        Thực hiện
                                    </Button>
                                </Grid>
                        </Paper>
                    </form>
                </div>
                <div className="root-transaction">
                    
                </div>
            </React.Fragment>
        )
    }
}
export default withSnackbar(Transaction)