import React from 'react'
import './Payment.scss'
import { AccountSearch } from '../Transaction/components';
import { TransactionForm } from '../Transaction/components';
import { withSnackbar } from 'notistack'
import { Grid, TextField, FormLabel, Paper   } from '@material-ui/core';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import NumberFormat from 'react-number-format';
import { format } from 'date-fns'
import SendIcon from '@material-ui/icons/Send';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import Select , { components }  from "react-select";
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

class Payment extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            amount: '',
            address:'',
            description: '',    
            payment_time: new Date,
            
            remaining_amount: '',
            transaction_count: 0,
            transactions: [],

        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handlePaymentTimeChange  = (date) => {
        this.setState({ payment_time : date })
    }
    onChangeTransactionCount = (e) => {
        let t = []
        let c = (e.target.value > 10) ? 10 : e.target.value        
        for(let i = 0 ; i < c ; i++){
            t.push({debit: '', credit: '', time: new Date(), student: '', amount: '', content: '', selected_class: null, selected_session: null})
        }
        this.setState({
            transaction_count: c,
            transactions: t,  
        })
    }
    handleDateChange = (key, date) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].time = date;
            return {...prevState, transactions}
        })
    }
    handleDebitChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].debit = newValue;
            return {...prevState, transactions}
        })
    }
    handleCreditChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].credit = newValue;
            return {...prevState, transactions}
        })
    }
    handleStudentChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].student = newValue;
            return {...prevState, transactions}
        }) 
    }
    handleClassChange = (key, newValue) => {

        if(this.state.transactions[key].selected_class != newValue || !this.state.transactions[key].selected_class){
            this.setState(prevState => {
                let transactions = prevState.transactions;
                transactions[key]['selected_session'] = [] 
                transactions[key]['selected_class'] = (newValue)?newValue:[]
                return {...prevState, transactions}
            })
        }
    }
    handleSessionChange = (key, newValue) => {
        if(this.state.transactions[key].selected_session != newValue ){
            this.setState(prevState => {
                let transactions = prevState.transactions;
                transactions[key]['selected_session'] = (newValue)? newValue: [] 
                return {...prevState, transactions}
            })
        }
    }
    onSubmitTransaction = (e) => {
        e.preventDefault();
        let data = this.state
        data.payment_time = data.payment_time.getTime()/1000
        this.setState({payment_time: new Date(data.time*1000)})
        axios.post(baseUrl + '/payment/create', data)
            .then(response => {
                
            })
            .catch(err => {

            })
    }
    render(){
        return (
            <React.Fragment>
                <div className="root-payment">
                <form noValidate autoComplete="on">
                        <Paper elevation={4} className="paper-payment">
                            <h2>Lập phiếu chi</h2>
                            <Grid container spacing={2} id="payment-form">
                                <Grid item xs={12} sm={6}>
                                    <FormLabel color="primary">Tên người nhận</FormLabel>
                                    <TextField
                                        fullWidth
                                        value={this.state.name}
                                        onChange={e => this.onChange(e)}
                                        name = "name"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormLabel color="primary">Địa chỉ</FormLabel>
                                    <TextField
                                        fullWidth
                                        value={this.state.address}
                                        onChange={e => this.onChange(e)}
                                        name = "address"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} id="payment-form">
                                <Grid item xs={12} sm={6}>
                                    <FormLabel color="primary">Lý do</FormLabel>
                                    <TextField
                                        fullWidth
                                        value={this.state.description}
                                        onChange={e => this.onChange(e)}
                                        name = "description"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormLabel color="primary">Số tiền</FormLabel>
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
                                <Grid item xs={12} sm={3}>
                                    <FormLabel color="primary">Ngày chứng từ</FormLabel>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            autoOk
                                            fullWidth
                                            value={this.state.payment_time}                            
                                            onChange={this.handlePaymentTimeChange}
                                            placeholder="Ngày chứng từ"                            
                                            className="input-date"
                                            variant="inline"
                                            size="small"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                        />
                                                    
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                            <Grid container justify="flex-start" alignItems="center" spacing={2}>
                                <Grid item xs={4} md={2} xl={1}>
                                    <Typography variant="button"><b>Hạch toán</b></Typography>
                                </Grid>
                                <Grid item xs={4} xl={1} md={1}>
                                    <TextField
                                        fullWidth
                                        value={this.state.transaction_count}
                                        onChange={e => this.onChangeTransactionCount(e)}
                                        name = "transaction_count"
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        inputProps={{ min: "0", max: "10", step: "1" }}
                                    />
                                </Grid>
                                <Grid item xs={4} xl={2} md={2}>
                                    <Typography variant="button">giao dịch</Typography>
                                </Grid>
                            </Grid>                      
                            {this.state.transactions.map((transaction, key) => {
                                return (
                                    <TransactionForm
                                        debit = {transaction.debit}
                                        credit = {transaction.credit}
                                        time = {transaction.time}
                                        student = {transaction.student}
                                        amount = {transaction.amount}
                                        content = {transaction.content}
                                        selected_class = {transaction.selected_class}
                                        selected_session = {transaction.selected_session}

                                        onChange = { this.onChange }
                                        handleDateChange = { (date) => this.handleDateChange(key, date ) }
                                        handleDebitChange = { (newValue) => this.handleDebitChange(key, newValue) }
                                        handleCreditChange = { (newValue) => this.handleCreditChange(key, newValue) }
                                        handleStudentChange = {(newValue) => this.handleStudentChange(key, newValue)}
                                        handleClassChange = {(newValue) => this.handleClassChange(key, newValue)}
                                        handleSessionChange = {(newValue) => this.handleSessionChange(key, newValue) }
                                        submitButton = {false}
                                        onSubmitTransaction = {{}}                   
                                    />
                                )
                            })}
                            <Button
                                variant="contained"
                                color="secondary"
                                className="submit-btn"
                                onClick = {(e) => this.onSubmitTransaction(e)}
                                endIcon={<SendIcon/>}
                            >
                                Tạo mới
                            </Button>
                        </Paper>
                    </form>
                </div>
            </React.Fragment>
        )
    }

}
export default withSnackbar(Payment)