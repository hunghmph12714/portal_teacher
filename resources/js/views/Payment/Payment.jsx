import React from 'react'
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
            description: '',
            

        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        return (
            <React.Fragment>
                <div className="root-payment">
                <form noValidate autoComplete="on">
                        <Paper elevation={4} className="paper-payment">
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
                                    <FormLabel color="primary">Miêu tả</FormLabel>
                                    <TextField
                                        fullWidth
                                        value={this.state.description}
                                        onChange={e => this.onChange(e)}
                                        name = "description"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
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
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
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
                        </Paper>
                    </form>
                </div>
            </React.Fragment>
        )
    }

}
export default withSnackbar(Payment)