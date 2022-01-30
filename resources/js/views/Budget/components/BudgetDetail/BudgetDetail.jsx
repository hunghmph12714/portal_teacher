import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, Button,TextField, GridList, GridListTile, InputAdornment
} from '@material-ui/core/';
import Select from 'react-select'
import './BudgetDetail.scss'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import axios from 'axios'
import NumberFormat from 'react-number-format';
import { useSnackbar } from 'notistack';

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import { parse } from 'date-fns';

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
const BudgetDetail = props => {
    const {open, handleCloseDialog, selectedBudget, statusOptions, accountOptions, ...rest} = props
    const [note, setNote] = useState('')
    const [accounts, setAccounts] = useState([{account: null, amount: 0, id: 0}]);
    const [status, setStatus] = useState({value: '', label: ''})
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        // console.log(props.selectedAccount)
        if(props.selectedAccount.length > 0){
            setAccounts(props.selectedAccount)
        }else{
            setAccounts([{account: null, amount: 0, id: 0}])
        }

    }, [selectedBudget])    
    function handleEditBudget(){
        axios.post('/budget/add-account', {id: props.selectedBudget.id, accounts})
            .then(response => {
                enqueueSnackbar('Lưu thành công', {'variant': 'success'})
                props.handleCloseDialog()
            })
            .catch(err => {

            })
    }
    function onNoteChange(e){
        setNote(e.target.value)
    }
    function onStatusChange(value){
        setStatus(value)
    }
    function onAccountChange(id, value){
        let apps = [...accounts]
        apps = apps.map(a => {
            if(a.id == id){
                a.account = value
            }
            return a
        })
        setAccounts(apps)
    }
    function onAmountChange(id, value){
        let apps = [...accounts]
        let sum = apps.map(x => x.amount).reduce( (a,b) => a + parseFloat(b), 0 )
        apps = apps.map(a => {
            if(a.id == id){
                a.amount = (sum-parseFloat(a.amount)+parseFloat(value.target.value) < 100) ? value.target.value : parseFloat(100-sum)
            }
            return a
        })
        setAccounts(apps)
    }
    function removeAccount(id){
        let apps = accounts.filter(a => a.id != id)
        setAccounts(apps)
    }
    function addAccount(id){
        let currentAccounts = [...accounts]
        let sum = currentAccounts.map(x => x.amount).reduce( (a,b) => a + parseFloat(b), 0 )
        currentAccounts.push({account: null, amount: sum<100?100-sum:0, id: accounts.length})
        setAccounts(currentAccounts)
    }
    
    return(
        <Dialog 
            {...rest}
            id="account-dialog"
            fullWidth 
            maxWidth='lg'
            scroll='paper'
            className='root-edit-budget'
            open={props.open} onClose={props.handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Phân bổ ngân sách - {props.selectedBudget.name}</h4>
            </DialogTitle>
            <DialogContent>
            <GridList cellHeight={50} cols={2}>
                {accounts.map((a) => (
                <GridListTile className="account-tile">
                   <Grid container spacing = {1} className="accounts">
                            <Grid item md={5} sm={5}>
                                <Select className = "select-box"
                                    key = "account-select"
                                    value = {a.account}
                                    name = "account"
                                    placeholder="Khoản chi"
                                    options={props.accountOptions}
                                    onChange={(value) => onAccountChange(a.id, value)}
                                />
                            </Grid>
                            <Grid item md={2} sm={2}>
                                <TextField
                                    label="%"
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                    placeholder="%"
                                    value={a.amount}
                                    onChange={(value) => onAmountChange(a.id, value)}
                                />
                            </Grid>
                            <Grid item md={3} sm={3}>
                                <TextField
                                    label="VNĐ"
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    startAdornment={<InputAdornment position="start">Đ</InputAdornment>}
                                    placeholder="Đ"
                                    value={parseInt(props.selectedBudget.limit)/100*parseFloat(a.amount).toFixed(2)}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                    }}
                                    disabled
                                />
                            </Grid>
                            <Grid item md={1} sm={1}>
                                <AddCircleOutlineIcon onClick={() => addAccount(a.id)} className="icon"/>
                            </Grid>
                            <Grid item md={1} sm={1}>
                                {
                                    (a.id == 0)? '':<RemoveCircleOutlineIcon onClick={() => removeAccount(a.id)} className="icon"/>
                                }
                            </Grid>
                        </Grid>
                    
                </GridListTile>
                ))}
            </GridList>
                
            </DialogContent>    
            <DialogActions>
                <Button onClick={props.handleCloseDialog} color="primary">
                    Hủy bỏ
                </Button>
                <Button onClick={() => handleEditBudget()} color="primary" id="btn-save">
                    Lưu thay đổi
                </Button>                
            </DialogActions>
        </Dialog>
    )

}
export default BudgetDetail