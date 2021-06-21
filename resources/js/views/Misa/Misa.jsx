import React, {useState, useEffect} from 'react';
import { Grid, IconButton, Button, Paper } from '@material-ui/core';
import './Misa.scss';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import axios from 'axios'
import vi from "date-fns/locale/vi";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { useSnackbar } from 'notistack'; 
import LinearProgress from '@material-ui/core/LinearProgress';

const Misa = (props) => {
    const [type, setType] = useState('');
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    function handleChange(event){
        setType(event.target.value)
    }
    function handleFromChange(date){
        setFrom(date)
    }
    function handleToChange(date){
        setTo(date)
    }
    function handleExport(){
        if(type == ""){
            enqueueSnackbar('Vui lòng chọn danh sách cần kết xuất', {variant: 'error'})
        }else{
            setLoading(true)
            console.log(type)
            switch (type) {
                case 'student':
                    axios.get('/misa/student')
                        .then(response => {
                            window.open(response.data, '_blank', 'noopener,noreferrer')
                            setLoading(false)
                        })
                        .catch(err => {
                            setLoading(false)
                        })
                    break;
                case 'class':
                    axios.get('/misa/class')
                        .then(response => {
                            window.open(response.data, '_blank', 'noopener,noreferrer')
                            setLoading(false)
                        })
                        .catch(err => {
                            setLoading(false)
                        })
                    break;
                case 'order':
                    axios.post('/misa/order', {from: from, to: to})
                        .then(response => {
                            window.open(response.data, '_blank', 'noopener,noreferrer')
                            setLoading(false)
                        })
                        .catch(err => {
                            setLoading(false)
                        })
                    break;
                case 'receipt_tm':
                    axios.post('/misa/receipt/tm', {from: from, to: to})
                        .then(response => {
                            window.open(response.data, '_blank', 'noopener,noreferrer')
                            setLoading(false)
                        })
                        .catch(err => {
                            setLoading(false)
                        })
                    break;
                    break;
                case 'receipt_nh':
                    axios.post('/misa/receipt/nh', {from: from, to: to})
                        .then(response => {
                            window.open(response.data, '_blank', 'noopener,noreferrer')
                            setLoading(false)
                        })
                        .catch(err => {
                            setLoading(false)
                        })
                    break;
                case 'payment_tm':
                    axios.post('/misa/payment/tm', {from: from, to: to})
                        .then(response => {
                            window.open(response.data, '_blank', 'noopener,noreferrer')
                            setLoading(false)
                        })
                        .catch(err => {
                            setLoading(false)
                        })
                    break;
                case 'payment_nh':
                    axios.post('/misa/payment/nh', {from: from, to: to})
                        .then(response => {
                            window.open(response.data, '_blank', 'noopener,noreferrer')
                            setLoading(false)
                        })
                        .catch(err => {
                            setLoading(false)
                        })
                    break;
                case 'revenue':
                    break;

            }
        }
    }
    return (
        <div className="root-misa">
            {
                loading ? <LinearProgress />:""
            }
            <h3> Kết xuất dữ liệu Misa</h3>
            <Grid container spacing={2}>
                <Grid item md={6}>
                <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id="demo-simple-select-outlined-label">Loại kết xuất(*)</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={type}
                        onChange={handleChange}
                        label="Loại kết xuất(*)"
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                        <MenuItem value={'student'}>Danh sách Học sinh (Khách hàng) *Cập nhật</MenuItem>
                        <MenuItem value={'class'}>Danh sách Lớp học (Hàng bán - Mã thống kê)</MenuItem>
                        <MenuItem value={'order'}>Danh sách Công nợ</MenuItem>
                        <MenuItem value={'receipt_tm'}>Danh sách phiếu thu TM</MenuItem>
                        <MenuItem value={'receipt_nh'}>Danh sách phiếu thu NH</MenuItem>
                        <MenuItem value={'payment_tm'}>Danh sách phiếu chi TM</MenuItem>
                        <MenuItem value={'payment_nh'}>Danh sách phiếu chi NH</MenuItem>
                        <MenuItem value={'revenue'}>Danh sách Doanh thu</MenuItem>
                        <MenuItem value={'other'}>Danh sách Giao dịch khác</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
                <Grid item md={2}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                    <KeyboardDatePicker
                      autoOk
                      size= "small"
                      className="input-date-range"
                      variant="inline"
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      label="Từ ngày"
                      views={["year", "month", "date"]}
                      value={from}
                      onChange={handleFromChange}
                    />  
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                    <KeyboardDatePicker
                      autoOk
                      size= "small"
                      className="input-date-range"
                      variant="inline"
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      label="Từ ngày"
                      views={["year", "month", "date"]}
                      value={to}
                      onChange={handleToChange}
                    />  
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={2}>
                    <Button fullWidth color='primary' variant="outlined" onClick={() => handleExport()}> Kết xuất </Button>
                </Grid>
            </Grid>

        </div>
        
    )
}
export default Misa;