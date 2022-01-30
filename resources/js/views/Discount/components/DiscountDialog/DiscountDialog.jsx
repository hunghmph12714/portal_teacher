import React, {useState, useEffect} from 'react';
import './DiscountDialog.scss'
import {StudentSearch} from '../../../../components'
import axios from 'axios'
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Select , { components }  from "react-select";
import DialogContent from '@material-ui/core/DialogContent';
import NumberFormat from 'react-number-format';
import { FormLabel, TextField, Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import vi from "date-fns/locale/vi";
import {
    KeyboardTimePicker,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import  DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { select } from 'underscore';
const baseUrl = window.Laravel.baseUrl;

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
            prefix="đ"
        />
    );
}
var student_id = 0;
const ClassSelect = React.memo(props => {
    const {center, course, student} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            var r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            if(student){
                r = await axios.post(baseUrl + '/class/student', {'student_id': student})
            }
            setClasses(r.data.map(c => {
                return {label: c.code + ' - ' +c.name, value: c.id}
            }))        
            
        }
        fetchdata()
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
const DiscountDialog = (props) => {
    const {open, handleClose, type, selected_data} = props
    const [student, setStudent] = useState({})
    const [classes, setClass] = useState({})
    const [amount, setAmount] = useState(0)
    const [percentage, setPercentage] = useState(0);
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    React.useEffect(() => {
        if(type == 'edit'){
            setClass(selected_data.class)
            setStudent(selected_data.student)
            setPercentage(selected_data.percentage)
            setAmount(selected_data.amount)
            setFrom(new Date(selected_data.active_at))
            setTo(new Date(selected_data.expired_at))
        }
    }, [open])
    function createDiscount(){
        const newData = {
            'sname' : student, 
            'class' : classes,
            'active_at' : from, 'expired_at' : to, 
            'percentage' : percentage==0 ? null : percentage, 
            'amount' : amount==0 ? null : amount,
            'status' : 'active',
        }
        axios.post(baseUrl + '/discount/create', newData)
            .then((response) => {
                handleClose()
                enqueueSnackbar('Tạo ưu đãi thành công', {
                    variant: 'success'
                })
            })
            .catch(err => {
                if(err.response.status == '421'){
                    this.props.enqueueSnackbar(err.response.data, { 
                        variant: 'error',
                      });
                }
                if(err.response.status == 500){
                    this.props.enqueueSnackbar('Lỗi server, vui lòng thử lại sau', {
                        variant: 'error',
                    })
                }
                if(err.response.status == 422){
                    this.props.enqueueSnackbar('Vui lòng điền đầy đủ các trường (*)', {
                        variant: 'error',
                    })
                }

            })
    }
    function editDiscount(){
        const newData = {
            'did' : selected_data.did,
            'student' : student, 
            'class' : classes,
            'active_at' : from, 'expired_at' : to, 
            'percentage' : percentage==0 ? null : percentage, 
            'amount' : amount==0 ? null : amount,
            'status' : 'active',
        }
        axios.post(baseUrl + '/discount/edit', newData)
            .then((response) => {
                handleClose()
                enqueueSnackbar('Tạo ưu đãi thành công', {
                    variant: 'success'
                })
            })
            .catch(err => {
                if(err.response.status == '421'){
                    this.props.enqueueSnackbar(err.response.data, { 
                        variant: 'error',
                      });
                }
                if(err.response.status == 500){
                    this.props.enqueueSnackbar('Lỗi server, vui lòng thử lại sau', {
                        variant: 'error',
                    })
                }
                if(err.response.status == 422){
                    this.props.enqueueSnackbar('Vui lòng điền đầy đủ các trường (*)', {
                        variant: 'error',
                    })
                }

            })
    }
    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="md" fullWidth id='discount-dialog'>
            <DialogTitle id="simple-dialog-title">{type == "create" ? 'Tạo mới ưu đãi' : 'Sửa ưu đãi'} </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <FormLabel color="primary"> Lựa chọn học sinh </FormLabel>
                        <StudentSearch
                            student_name={student}
                            handleStudentChange={newValue => {
                                setStudent(newValue)
                                student_id = newValue.sid
                            }}
                        />
                    </Grid>
                    <Grid item md={6}>
                    <FormLabel color="primary"> Lựa chọn lớp học </FormLabel>
                        <ClassSelect 
                            selected_class = {classes}
                            handleChange={newValue => {
                                setClass(newValue)                               
                            }}
                            course = {-1}
                            center = {-1}
                            student = {student_id}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <FormLabel color="primary">% Miễn giảm</FormLabel>
                        <TextField
                            id="outlined-multiline-static"
                            fullWidth
                            placeholder="% Miễn giảm"
                            multiline
                            variant="outlined"
                            name="content"
                            value={percentage}
                            size='small'
                            onChange = {(event) => {
                                setAmount(0)
                                if(event.target.value > 100){
                                    enqueueSnackbar('Không thể lớn hơn 100%', {variant: 'error'})
                                }
                                setPercentage(event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item md={3}>
                    <FormLabel color="primary"> Số tiền Miễn giảm</FormLabel>
                        <TextField
                            id="outlined-multiline-static"
                            fullWidth
                            placeholder="Số tiền Miễn giảm"
                            multiline
                            variant="outlined"
                            name="content"
                            value={amount}
                            size='small'
                            onChange = {(event) => {
                                setPercentage(0)
                                setAmount(event.target.value)
                            }}
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                            }}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel color="primary"> Ngày có hiệu lực</FormLabel>    
                        <div className="date-time">
                            
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                                <KeyboardDatePicker
                                    fullWidth
                                    value={from}                            
                                    onChange={(date) => setFrom(date)}
                                    placeholder="Ngày có hiệu lực"                            
                                    className="input-date"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"     
                                />                     
                            </MuiPickersUtilsProvider>
                        </div>  
                    </Grid>
                    <Grid item md={3}>
                    <FormLabel color="primary"> Ngày hết hiệu lực</FormLabel>
                        <div className="date-time">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                                <KeyboardDatePicker
                                    value={to}
                                    onChange = {(date) => setTo(date)}
                                    placeholder="Ngày hết hiệu lực"                            
                                    className="input-date"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"     
                                />                     
                            </MuiPickersUtilsProvider>
                        </div>
                    </Grid>
                </Grid>
                
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={e => {
                    if(type == 'create') createDiscount()
                    if(type == 'edit') editDiscount()
                }}> 
                    Lưu ưu đãi
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default DiscountDialog