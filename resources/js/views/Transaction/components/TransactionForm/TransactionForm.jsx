import React, {useState, useEffect} from 'react'
import './TransactionForm.scss'
import axios from 'axios'
import { Grid, TextField, FormLabel, Paper   } from '@material-ui/core';
import { AccountSearch } from '../../components';
import { withSnackbar } from 'notistack'
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import NumberFormat from 'react-number-format';
import { format } from 'date-fns'
import SendIcon from '@material-ui/icons/Send';
import { StudentSearch } from '../../../../components';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import vi from "date-fns/locale/vi";

import Select , { components }  from "react-select";
import CreatableSelect from 'react-select/creatable';
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Chip from '@material-ui/core/Chip';

const customChip = (color) => ({
    border: '1px solid #85144b',
    backgroundColor: color,
    color: '#000',
    fontSize: '12px',
})
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
        <Select className = "select-box"
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
            <Select className = "select-box"                
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
const TagSelect = React.memo(props => {
    const [data, setData] = useState([])
    const fetchData = async() => {
        const r = await axios.get(window.Laravel.baseUrl + "/tag/get")
        let data = r.data.map(c => {
            return {label: c.name, value: c.id}
        })
        setData(data)
    }
    useEffect(() => {        
        fetchData()
    }, [])    
    return(        
        <div className = "tag-input">
            <CreatableSelect                
                key = "tag-select"
                isMulti
                value = {props.tags}
                name = "tags"
                placeholder="Chọn nhãn dán"
                options={data}
                onChange={props.handleChange}
            />                 
        </div>
    )
})
const TransactionForm = props => {
    const {debit, credit, time, student, amount, content, selected_class, selected_session, submitButton, tags,
    onChange, handleDateChange , handleDebitChange, handleCreditChange, handleStudentChange, handleClassChange, handleSessionChange, onSubmitTransaction, handleTagChange,
    handleAmountChange, handleContentChange} = props
    return(
        <React.Fragment>
            <Grid container spacing={2} className="account-select">
                <Grid item xs={12} sm={4}>
                    <FormLabel color="primary">Tài khoản nợ</FormLabel>
                    <AccountSearch
                        account={debit}
                        handleAccountChange={handleDebitChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormLabel color="primary">Tài khoản có</FormLabel>
                    <AccountSearch
                        account={credit}
                        handleAccountChange={handleCreditChange}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <FormLabel color="primary">Ngày </FormLabel> <br/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                        <KeyboardDatePicker
                            autoOk
                            fullWidth
                            value={time}                            
                            onChange={handleDateChange}
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
                            value={amount}
                            onChange={handleAmountChange}
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
                        student_name={student}
                        handleStudentChange={handleStudentChange}
                    />
                </Grid>
                <Grid  item lg={4} xs={12}>
                    <FormLabel color="primary">Lớp học</FormLabel>
                    <ClassSelect 
                        selected_class = {selected_class}
                        handleChange={handleClassChange}
                        course = {-1}
                        center = {-1}
                        student = {student}
                    />
                </Grid>
                <Grid item  lg={4} xs={12}>
                    <FormLabel color="primary">Buổi học</FormLabel>
                    <SessionDateSelect 
                        selected_class = {selected_class}
                        selected_session = {selected_session}
                        handleChange={handleSessionChange}                        
                    />
                </Grid>
                
            </Grid>
            <Grid container spacing={2}>
                <Grid item lg={6} xs={12}>
                    <FormLabel color="primary">Tag</FormLabel>
                    <TagSelect 
                        tags = {tags}
                        handleChange = {handleTagChange}
                    />
                    {submitButton ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            className="submit-btn"
                            onClick = {(e) => onSubmitTransaction(e)}
                            endIcon={<SendIcon/>}
                        >
                            Thực hiện
                        </Button>
                    ) : ""}
                </Grid>
                <Grid item lg={6} xs={12}>
                    <FormLabel color="primary">Miêu tả</FormLabel>
                    <TextField
                        id="outlined-multiline-static"
                        fullWidth
                        placeholder="Miêu tả của giao dịch"
                        multiline
                        rows={2}
                        variant="outlined"
                        name="content"
                        value={content}
                        onChange = {handleContentChange}
                    />
                </Grid>
        
            </Grid>
        </React.Fragment>
        
    )

}
export default TransactionForm