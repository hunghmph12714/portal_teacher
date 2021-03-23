import React , {useState, useEffect} from 'react'
import SpreadSheet from '@rowsncolumns/spreadsheet'

import './CashBook.scss'
import axios from 'axios'
import { withSnackbar } from 'notistack';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { colors } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import CachedIcon from '@material-ui/icons/Cached';
import orange from '@material-ui/core/colors/orange';
import { format } from 'date-fns'
import {
    Tooltip,
  } from "@material-ui/core";
import { Grid } from '@material-ui/core';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib

import vi from "date-fns/locale/vi";
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
const baseUrl = window.Laravel.baseUrl;
const customChip = (color = '#ccc') => ({
  border: '1px solid ' + color,
  color: '#000',
  fontSize: '12px',
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
const CenterSelect = React.memo(props => {
    const [centers, setCenters] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/get-center')
            setCenters(r.data.map(center => {
                    return {label: center.name, value: center.id}
                })
            )
        }
        fetchdata()
    }, [])
    
    return( 
        <Select
            isMulti
            isClearable={false}
            name="centers"
            options={centers}
            value = {props.selected_centers}
            onChange = {props.onCenterChange}
            />
        )
})
const AccountSelect = React.memo(props => {
    const [accounts, setAccounts] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/get-equity')
            setAccounts(r.data.map(a => {
                    return {label: a.name, value: a.id}
                })
            )
        }
        fetchdata()
    }, [])
    
    return( 
       
        <FormControl variant="outlined"  className="select-box"  
            size="small"
            fullWidth>
            <InputLabel id="demo-simple-select-outlined-label">Phương thức thanh toán</InputLabel>
            <Select className = "select-box"
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
const NameText = React.memo(props => {

    return (
        <TextField
            className="select-box"
            variant="outlined"
            label="Tên người nộp"
            value={props.name}
            name="name"
            onChange={props.onChange}
            size="small"
            fullWidth
        />
    )
})


// const studentInfo =

const CashBook = (props) => {
  const [sheets, setSheets] = useState([{name: 'Sheet 1',
    cells: {
        2: {
            1: {text: 'Ngày hạch toán',bold: true},
            2: {text: 'Phiếu thu',bold: true},
            3: {text: 'Phiếu chi', bold:true},
            4: {text: 'Diễn giải', bold:true},
            5: {text: 'TK đối ứng', bold:true},
            6: {text: 'Nợ', bold:true},
            7: {text: 'Có', bold:true},
            8: {text: 'Số tồn', bold:true},
            9: {text: 'Người nộp/nhập', bold:true},
        },
    },
    id: 1}])
    const [centers, setCenters] = useState(null)
    const [from, setFrom] = useState(new Date())
    const [to, setTo] = useState(new Date())
    const [months, setMonths] = useState([])
  useEffect(() => {
    
  }, [])
  function onCenterChange(value) {
    setCenters(value)
  }
  function handleFromChange(date){
      setFrom(date)
  }
  function handleToChange(date){
      setTo(date)
  }
  function getClashFlow(event){
    event.preventDefault()
    async function fetchJSON () {
        const resource = await axios.post('/report/cash-book', {centers: centers, from: from, to: to})
  
        const sheet = {
            name: 'Báo cáo chi',
            cells: {
                2: {
                    1: {text: 'Ngày hạch toán',bold: true},
                    2: {text: 'Phiếu thu',bold: true},
                    3: {text: 'Phiếu chi', bold:true},
                    4: {text: 'Diễn giải', bold:true},
                    5: {text: 'TK đối ứng', bold:true},
                    6: {text: 'Nợ', bold:true},
                    7: {text: 'Có', bold:true},
                    8: {text: 'Số tồn', bold:true},
                    9: {text: 'Người nộp/nhập', bold:true},
                    
                },
            },
            id: 1
        }
        for (let i = 0; i < resource.data.length ; i++){
            const d = resource.data[i]
            const keys = Object.keys(d)
            const rowIndex = i + 3                        
            sheet.cells[rowIndex] =  sheet.cells[rowIndex] ?? {}
            console.log(d)
            sheet.cells[rowIndex][1] = {
                text: d.time
            }
            sheet.cells[rowIndex][2] = {
                text: d.pt
            }
            sheet.cells[rowIndex][3] = {
                text: d.pc
            }
            sheet.cells[rowIndex][4] = {
                text: d.description
            }
            sheet.cells[rowIndex][5] = {
                text: d.op
            }
            sheet.cells[rowIndex][6] = {
                text: d.debit , datatype: 'number', format: '#,##0'
            }
            sheet.cells[rowIndex][7] = {
                text: d.credit , datatype: 'number', format: '#,##0'
            }
            sheet.cells[rowIndex][8] = {
                text: d.sum , datatype: 'number', format: '#,##0'
            }
            sheet.cells[rowIndex][9] = {
                text: d.user
            }
        }
        
        setSheets([sheet])
      }
      fetchJSON()
  }
  return (
    <React.Fragment>
        <div className="select-central">
        <Grid container spacing={2} className="select-central">
            <Grid item md={6} ms={12}> 
                <CenterSelect 
                    selected_centers = {centers}
                    onCenterChange = {onCenterChange}
                />
            </Grid>
            <Grid item md={2} ms={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                    <KeyboardDatePicker
                      autoOk
                      fullWidth
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
            <Grid item md={2} ms={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                    <KeyboardDatePicker
                      autoOk
                      fullWidth
                      size= "small"
                      className="input-date-range"
                      variant="inline"
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      label="Đến ngày"
                      views={["year", "month", "date"]}
                      value={to}
                      onChange={handleToChange}
                    />  
                </MuiPickersUtilsProvider>

            </Grid>
            <Grid item md={2} ms={12}>
                <Button variant="contained" color="primary" fullWidth={1} onClick={(event) => getClashFlow(event)}> 
                    Kiểm tra</Button>
            </Grid>
        </Grid>
        
        </div>
        <SpreadSheet
            className = "sheet"
            sheets={sheets}
            onChange = {setSheets}
        
        />
    </React.Fragment>
  )
}

export default CashBook;
