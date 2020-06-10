import React from 'react'
import './Payment.scss'
import { AccountSearch } from '../Transaction/components';
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
            
            max_amount: '',
            transaction_count: 1,
            transaction: [],

        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    onChangeTransactionCount = (e) => {
        let t = []
        for(let i = 0 ; i < e.target.value ; i++){
            t.push({from: '', to : '', date: '', amount: '', note: ''})
        }
        this.setState({
            transaction_count: e.target.value,
            transactions: t,
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
                                <Grid item xs={12} sm={6}>
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
                            </Grid>
                            <ExpansionPanel className="transaction-add">
                                <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                    <Typography variant="button"><strong>Hạch toán</strong></Typography>                                    
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {/* <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <FormLabel color="primary">Số giao dịch</FormLabel>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                value={this.state.transaction_count}
                                                onChange={e => this.onChangeTransactionCount(e)}
                                                name = "transaction_count"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid> */}
                                
                                    <Grid container spacing={2}>
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
                                            <FormLabel color="primary">Ngày hạch toán</FormLabel> <br/>
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
                                
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Paper>
                    </form>
                </div>
            </React.Fragment>
        )
    }

}
export default withSnackbar(Payment)