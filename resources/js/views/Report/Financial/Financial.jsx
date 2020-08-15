import React , {useState, useEffect} from 'react'
import SpreadSheet from '@rowsncolumns/spreadsheet'

import './Financial.scss'
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
import Select from '@material-ui/core/Select';
import NumberFormat from 'react-number-format';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';

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
        <FormControl variant="outlined" size="small" className="select-box"  
        fullWidth>
            <InputLabel>Cơ sở</InputLabel>
            <Select className = "select-box"
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

const Financial = (props) => {
  const [sheets, setSheets] = useState([{name: 'Sheet 1',
  cells: {
      2: {
          1: {text: 'Khối',bold: true},
          2: {text: 'Lớp',bold: true},
          3: {text: 'Cần đóng T8', bold:true},
          4: {text: 'Đã đóng T8', bold:true},
          5: {text: 'Còn nợ T8', bold:true},
          6: {text: 'Cần đóng T9', bold:true},
          7: {text: 'Đã đóng T9', bold:true},
          8: {text: 'Nợ T9', bold:true},
      },
  },
  id: 1}])
  useEffect(() => {
    async function fetchJSON () {
      const resource = await axios.get(baseUrl + '/report/get-financial')
      console.log(resource.data)

      const sheet = {
        name: 'Sheet 1',
        cells: {
            2: {
                1: {text: 'Khối',bold: true},
                2: {text: 'Lớp',bold: true},
                3: {text: 'Cần đóng T8', bold:true},
                4: {text: 'Đã đóng T8', bold:true},
                5: {text: 'Còn nợ T8', bold:true},
                6: {text: 'Cần đóng T9', bold:true},
                7: {text: 'Đã đóng T9', bold:true},
                8: {text: 'Nợ T9', bold:true},
            },
        },
        id: 1
      }
      
        for (let i = 0; i < resource.data.length ; i++){
            const d = resource.data[i]
            const keys = Object.keys(d)
            console.log(d);
            const rowIndex = i + 3                        
            sheet.cells[rowIndex] =  sheet.cells[rowIndex] ?? {}
            sheet.cells[rowIndex][1] = {
                text: d.grade
            }
            sheet.cells[rowIndex][2] = {
                text: d.class
            }
            sheet.cells[rowIndex][3] = {
                text: d.t8.cd
            }
            sheet.cells[rowIndex][4] = {
                text: d.t8.dd
            }
            sheet.cells[rowIndex][5] = {
                text: d.t8.no
            }
            sheet.cells[rowIndex][6] = {
                text: d.t9.cd
            }
            sheet.cells[rowIndex][7] = {
                text: d.t9.dd
            }
            sheet.cells[rowIndex][8] = {
                text: d.t9.no
            }
        }
        
        setSheets([sheet])
        console.log(sheets)
    }
    fetchJSON()
  }, [])
  console.log(sheets)
  return (
    <SpreadSheet
        sheets={sheets}
        onChange = {setSheets}
      
    />
  )
}

export default Financial;
