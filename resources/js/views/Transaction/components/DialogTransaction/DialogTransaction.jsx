import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './DialogTransaction.scss'
import { Grid, TextField, FormLabel, Paper   } from '@material-ui/core';
import { AccountSearch, TransactionForm } from '../../components';
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
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
const initState = {
    transaction_id : '',
    debit: [],
    credit: [],
    time: new Date(),
    student : null,
    amount :'',
    content:'',
    selected_class: [],
    selected_session: null,
    tags: [],
}
class DialogTransaction extends React.Component{
    constructor(props){
        super(props)
        this.state = initState
    }
    async getTransactionById (){
        let data = await axios.post(baseUrl + '/transaction/get-id', {id: this.state.transaction_id})
            .then(response => {
                return response.data[0]
            })
            .catch(err => { 

            })
        this.setState({
            debit: {label: data.debit_level_2 + ': ' + data.debit_name, value: data.debit_id, id: data.debit_id},
            credit: {label: data.credit_level_2 + ': '+data.credit_name, value: data.credit_id, id: data.credit_id},
            content: data.content,
            time: new Date(data.time),
            student: {label: data.sname, value: data.sid},
            selected_class: {label: data.cname, value: data.cid},
            selected_session: {label: data.session_date, value:data.ssid},
            tags: data.tags.map(t => { return {label: t.name, value: t.id} }),
            amount: data.amount,
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.transaction_id !== prevState.transaction_id) {           
            return ({ transaction_id: nextProps.transaction_id }) // <- this is setState equivalent
        }else{
            return null
        }
        
    } 
    componentDidUpdate = (prevProps, prevState) => {
        if(prevState.transaction_id != this.state.transaction_id){
            if( this.state.transaction_id != '' ){
                this.getTransactionById()
            }
            else{
                this.setState(initState)
            }
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
    handleTagChange = (newValue) => {
        this.setState({tags: newValue});
    }
    onSubmitTransaction = (event) => {
        event.preventDefault()
        let data = this.state        
        if(this.props.dialogType == 'create'){
            axios.post(baseUrl + '/transaction/add', this.state)
            .then(response => {
                this.props.handleClose()
                this.props.enqueueSnackbar('Tạo giao dịch thành công!', {
                    variant: 'success'
                })                
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra !', {
                    variant: 'error'
                })
            })
        } else if(this.props.dialogType == 'edit'){
            axios.post(baseUrl + '/transaction/edit', this.state)
                .then(response => {
                    this.props.handleClose()
                    this.props.enqueueSnackbar('Sửa giao dịch thành công!', {
                        variant: 'success'
                    })
                .catch(er => {
                    this.props.enqueueSnackbar('Có lỗi xảy ra ! ', {variant: 'error'})
                })                
            })
        }

    }
    render(){
        return(
            <Dialog
                fullWidth
                maxWidth='xl'
                open={this.props.open}
                onClose={this.props.handleClose}
                aria-labelledby="max-width-dialog-title"
                classes={{ paperScrollPaper: 'dialog-with-select' }}
            >
                <DialogTitle id="max-width-dialog-title"></DialogTitle>
                <DialogContent className="dialog-with-select">
                    <form noValidate autoComplete="on" className="transaction-form">
                        <TransactionForm
                            debit = {this.state.debit}
                            credit = {this.state.credit}
                            time = {this.state.time}
                            student = {this.state.student}
                            amount = {this.state.amount}
                            content = {this.state.content}
                            selected_class = {this.state.selected_class}
                            selected_session = {this.state.selected_session}
                            tags = {this.state.tags}

                            onChange = { this.onChange }
                            handleDateChange = {this.handleDateChange}
                            handleDebitChange = { this.handleDebitChange }
                            handleCreditChange = {this.handleCreditChange}
                            handleDateChange = {this.handleDateChange}
                            handleStudentChange = {this.handleStudentChange}
                            handleClassChange = {this.handleClassChange}
                            handleSessionChange = {this.handleSessionChange}
                            handleTagChange = {this.handleTagChange}
                            handleAmountChange = {this.onChange}
                            handleContentChange = {this.onChange}
                            submitButton = {true}
                            onSubmitTransaction = {this.onSubmitTransaction}                   
                        />
                    </form>
                </DialogContent>
                
            </Dialog>
        )
    }
}
export default withSnackbar(DialogTransaction)