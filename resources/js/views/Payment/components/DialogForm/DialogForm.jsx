import React , {useState, useEffect} from 'react'
import './DialogForm.scss'
import { TransactionForm } from '../../../Transaction/components';
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
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const customChip = (color) => ({
    border: '1px solid #85144b',
    backgroundColor: color,
    color: '#000',
    fontSize: '12px',
})
const baseUrl = window.Laravel.baseUrl
const initState = {            
    name: '',
    amount: '',
    address:'',
    description: '',    
    payment_time: new Date,
    remaining_amount: '',
    transaction_count: 0,
    transactions: [],
}
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
class DialogForm extends React.Component {
    constructor(props){
        super(props)
        this.state = initState
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.payment.length != 0){
            let transactions = nextProps.payment.transactions.map(t => {
                t.debit = {value: t.debit_id, label: t.debit_level_2+ " | " + t.debit_name}
                t.credit = {value: t.credit_id, label: t.credit_level_2+ " | " + t.credit_name}
                t.time = new Date(t.time)
                t.student = {value: t.sid, label: t.sname}
                t.selected_class = {value: t.cid , label: t.cname}
                t.selected_session = {value: t.ssid, label: t.ssid}
                t.tags = t.tags.map(tag => {
                    return {value: tag.id, label: tag.name}
                })
                return t
            })
            this.setState({
                address : nextProps.payment.address,
                name: nextProps.payment.name,
                amount: nextProps.payment.amount,
                remaining_amount: nextProps.payment.amount,
                description: nextProps.payment.description,
                payment_time: new Date(nextProps.payment.created_at),
                transaction_count: nextProps.payment.transactions.length,
                transactions : transactions
    
            })
        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,            
        })
    }
    handlePaymentAmountChange = (e) => {
        this.setState({
            amount: e.target.value,
            remaining_amount: e.target.value,
        })
    }
    handlePaymentTimeChange  = (date) => {
        this.setState({ payment_time : date })
    }
    onChangeTransactionCount = (e) => {
        let t = []
        let c = (e.target.value > 10) ? 10 : e.target.value
        //Check amount of payment and transactions
        if(this.state.amount <= this.state.transactions.map(t => t.amount).reduce((acc, am) => acc+parseInt(am) ,0)){
            this.props.enqueueSnackbar('Không thể tạo thêm giao dịch', {variant: 'warning'})
        }
        else {
            if(this.props.type == "create"){
                for(let i = 0 ; i < c ; i++){
                    t.push({debit: '', credit: '', time: new Date(), student: '', amount: 0, content: '', selected_class: null, selected_session: null, note: '', tags:[]})
                }
            }
            if(this.props.type == "edit" && c > this.state.transaction_count ){
                t = this.state.transactions
                for(let i = this.state.transaction_count   ; i < c ; i++){
                    t.push({debit: '', credit: '', time: new Date(), student: '', amount: 0, content: '', selected_class: null, selected_session: null, note: '', tags:[]})
                }
            }       
            this.setState({
                transaction_count: c,
                transactions: t,

            })
        }
        
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
    handleAmountChange = (key, newValue) => {
        let amount = newValue.target.value
        let reg_amount = 0
        for(let i = 0; i<this.state.transactions.length; i++){
            if(i !== key){
                reg_amount += parseInt(this.state.transactions[i].amount);
            }
        }
        if(amount <= this.state.remaining_amount - reg_amount){
            this.setState(prevState => {
                let transactions = prevState.transactions;
                transactions[key]['amount'] = (newValue) ? amount: 0
                // if(key < this.state.transaction_count){
                //     transactions[this.state.transaction_count - 1]['amount'] = this.state.remaining_amount - reg_amount - amount;
                // }
                return {...prevState, transactions}
            })
        }
        else{
            this.props.enqueueSnackbar('Số tiền không hợp lệ', {variant: 'warning', })
        }
    }
    handleNoteChange = (key, newValue) => {
        let note = newValue.target.value
        this.setState(prevState => {
            
            let transactions = prevState.transactions;
            transactions[key]['note'] = (newValue) ? note : ''
            return { ...prevState, transactions}
        })
    }
    handleTagChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key]['tags'] = newValue
            return {...prevState, transactions}
        })
    }
    onSubmitTransaction = (e) => {
        e.preventDefault();
        
        let data = this.state       
        axios.post(baseUrl + '/payment/create', data)
            .then(response => {
                this.props.enqueueSnackbar('Tạo thành công', {
                    variant: 'success'
                })                
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra, vui lòng kiểm tra lại', {
                    variant: 'error'
                })
            })
        this.props.handleReloadTable()
        this.props.handleCloseDialog()     
    }
    onSubmitEdit = (e) => {
        e.preventDefault();
        let data = this.state
        data.payment_id = this.props.payment.id
        axios.post(baseUrl + '/payment/edit', data)
            .then(response => {
                this.props.enqueueSnackbar('Sửa thành công', {
                    variant: 'success'
                })  
            })
            .catch(err => {})
        this.props.handleReloadTable()
        this.props.handleCloseDialog()
    }
    render(){
        return (
            <Dialog 
                open={this.props.open} 
                onClose={() => {
                    this.props.handleCloseDialog()
                    this.setState(initState)                    
                }} 
                aria-labelledby="form-dialog-title" 
                fullWidth maxWidth="xl"> 
                
                <DialogContent>
                        <form noValidate autoComplete="on">
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
                                            onChange={e => this.handlePaymentAmountChange(e)}
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
                                            content = {transaction.note}
                                            tags = {transaction.tags}

                                            onChange = { this.onChange }
                                            handleDateChange = { (date) => this.handleDateChange(key, date ) }
                                            handleDebitChange = { (newValue) => this.handleDebitChange(key, newValue) }
                                            handleCreditChange = { (newValue) => this.handleCreditChange(key, newValue) }
                                            handleStudentChange = {(newValue) => this.handleStudentChange(key, newValue)}
                                            handleClassChange = {(newValue) => this.handleClassChange(key, newValue)}
                                            handleSessionChange = {(newValue) => this.handleSessionChange(key, newValue) }
                                            handleAmountChange = { (newValue) => this.handleAmountChange(key, newValue)}
                                            handleNoteChange = { newValue => this.handleNoteChange(key, newValue) }
                                            handleTagChange = { newValue => this.handleTagChange(key, newValue) }
                                            submitButton = {false}
                                            onSubmitTransaction = {{}}                   
                                        />
                                    )
                                })}
                                {
                                    (this.state.type == "create")?
                                        (<Button
                                            variant="contained"
                                            color="secondary"
                                            className="submit-btn"
                                            onClick = {(e) => {
                                                if(this.state.amount != this.state.transactions.map(t => t.amount).reduce((acc, tr) => acc + parseInt(tr),0)){
                                                    if(window.confirm('Số tiền hạch toán không khớp, bạn có muốn tiếp tục ?')){
                                                        this.onSubmitTransaction(e)
                                                    }
                                                }else{
                                                    this.onSubmitTransaction(e)
                                                }
                                            }}  
                                            endIcon={<SendIcon/>}
                                        >
                                            Tạo mới
                                        </Button>):
                                    (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className="submit-btn"
                                            onClick = {(e) => {
                                                if(this.state.amount != this.state.transactions.map(t => t.amount).reduce((acc, tr) => acc + parseInt(tr),0)){
                                                    if(window.confirm('Số tiền hạch toán không khớp, bạn có muốn tiếp tục ?')){
                                                        this.onSubmitEdit(e)
                                                    }
                                                    
                                                }else{
                                                    this.onSubmitEdit(e)
                                                }
                                            }}
                                            endIcon={<SendIcon/>}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    )
                                }
                        </form>                
                </DialogContent>
                
            </Dialog>
        )
    }

}
export default withSnackbar(DialogForm)