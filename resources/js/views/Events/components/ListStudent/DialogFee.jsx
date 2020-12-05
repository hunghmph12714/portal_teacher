import React , { useState, useEffect } from 'react';
import { ClassSearch } from '../../../../components';
import './DialogFee.scss'
import axios from 'axios';
import _ from "lodash";
import Box from '@material-ui/core/Box';
// import './DialogFee.scss';
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
import { StudentForm, ParentForm } from '../../../Entrance/components';
import { withSnackbar } from 'notistack';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import NumberFormat from 'react-number-format';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
        <FormControl variant="outlined" size="small" className="select-box" fullWidth>
            <InputLabel>Cơ sở</InputLabel>
            <Select className = "select-box-margin"
                id="select-outlined"
                value={props.receipt_center}
                name="receipt_center"
                onChange={props.handleChange}
                label="Cơ sở"
            >   
                {centers.map(c => {
                    return (<MenuItem value={c.value}>{c.label}</MenuItem>)
                })}                
            </Select>
        </FormControl>
    )
})
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
const AccountSelect = React.memo(props => {
    const [accounts, setAccounts] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/get-equity')
            setAccounts(r.data.map(a => {
                    return {label: a.name, value: a.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
       
        <FormControl variant="outlined"  className="select-box"  
            size="small"
            fullWidth>
            <InputLabel id="demo-simple-select-outlined-label">Phương thức thanh toán</InputLabel>
            <Select className = "select-box-margin"
                id="select-outlined-2"
                name="account"
                value={props.account}
                onChange={props.handleChange}
                label='Phương thức thanh toán'
            >   
                {accounts.map(c => {
                    return (<MenuItem value={c.value}>{c.label}</MenuItem>)
                })}                
            </Select>
        </FormControl>
    )
})

class DialogFee extends React.Component {    
    constructor(props){
        super(props)        
        this.state = {
            center: '',
            name: props.name,
            account: '',
            description: 'Lệ phí ',
        }
    }
    handleCenterChange = (newValue) => {
        this.setState({ center: newValue.target.value })
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
    handleAccountChange = (newValue) => {
        this.setState({ account: newValue.target.value })

    }
    handleDialogFee = () => {
        if(this.state.center != "" || this.state.account != ""){
            axios.post(baseUrl + '/event-gather', {
                center: this.state.center,
                name: this.props.name,
                account: this.state.account, students: this.props.student,
                total_amount: this.props.total_fee,
                // students: this.state.student,
                description: this.props.class_name
            })
                .then(repsonse => {
                    this.setState({open: false})
                    this.props.enqueueSnackbar('Đã thu lệ phí', {variant: 'success'})
                    // setTimeout(this.props.history.push('/receipt'), 1000)
                })
                .catch(err => {
                    this.props.enqueueSnackbar('Có lỗi xảy ra, vui lòng kiểm tra lại', {variant: 'error'})
                })
        }
        else{
            this.props.enqueueSnackbar('Vui lòng điền đầy đủ thông tin', {variant: 'error'})
        }
    }
    render(){        
        return(
            
            <Dialog 
                fullWidth 
                maxWidth='md'
                scroll='body'
                open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
                classes={{ paperScrollPaper: 'dialog-with-select' }}
            >
                <DialogTitle id="form-dialog-title">Thu tiền lệ phí</DialogTitle>
                <DialogContent className="dialog-create-student dialog-with-select">
                    <CenterSelect 
                        receipt_center = {this.state.center}
                        handleChange={this.handleCenterChange}
                    />
                    <TextField
                        className="select-box-margin"
                        variant="outlined"
                        label="Tên người nộp"
                        value={this.props.name}
                        name="name"
                        onChange={this.props.onChange}
                        size="small"
                        fullWidth
                    />
                    <AccountSelect 
                        account = {this.state.account}
                        handleChange={this.handleAccountChange}
                    />
                    <TextField
                        fullWidth
                        value={this.props.class_name}
                        name = "description"
                        variant="outlined"
                        label = "Miêu tả"
                        size="small"
                        disabled
                        style = {{marginBottom: '14px'}}
                    />
                    <TextField
                        fullWidth
                        value={this.props.total_fee}
                        name = "selected_amount"
                        variant="outlined"
                        size="small"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                        disabled
                    />
                </DialogContent>
            <DialogActions>
                <Button onClick={this.props.handleClose} color="primary">
                    Hủy bỏ
                </Button>
                <Button onClick={this.handleDialogFee} color="primary" id="btn-save">
                    Xác nhận và Gửi Mail
                </Button>
            </DialogActions>
        </Dialog>
        )
    }
}
export default withSnackbar(DialogFee)