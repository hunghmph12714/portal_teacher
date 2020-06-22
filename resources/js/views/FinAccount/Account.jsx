import React from 'react';
import './Account.scss'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

import {
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
    Tooltip,
  } from "@material-ui/core";
import MaterialTable from "material-table";
import {MTableAction} from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icofont from "react-icofont";
import NumberFormat from 'react-number-format';
import { TwitterPicker } from 'react-color';
import { withSnackbar } from 'notistack';
import axios from 'axios'

const baseUrl = window.Laravel.baseUrl;
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
            prefix="đ"
        />
    );
}
class Account extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Loại', field: 'type' ,  
                    lookup: { 'assets':'Tài sản', 'liabilities':'Công nợ', 'equity':'Vốn chủ sở hữu', 'default': 'Mặc định' },
                    headerStyle: {
                        fontWeight: '600',
                    },
                },
                { title: 'Cấp 1', field: 'level_1' ,
                    headerStyle: {
                        fontWeight: '600',
                    },
                },
                { title: 'Cấp 2', field: 'level_2',
                    headerStyle: {
                        fontWeight: '600',
                    },
                },                
                { title: 'Tên', field: 'name',
                    headerStyle: {
                        fontWeight: '600',
                    },
                },
                { title: 'Nợ', field: 'debit', type: "currency", 
                  currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
                  editable: 'never',                  
                    headerStyle: {
                        fontWeight: '600',
                        textAlign: 'right'
                    },
                    cellStyle:{
                        paddingRight: '34px',
                    }
                },    
                { title: 'Có', field: 'credit', type: "currency", 
                    currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
                    editable: 'never',                  
                    headerStyle: {
                        fontWeight: '600',
                        textAlign: 'right'
                    },
                    cellStyle:{
                        paddingRight: '34px',
                    }
                }, 
                { title: 'Số dư', field: 'balance', type: "currency", 
                  currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
                  editable: 'never',
                  editComponent : props => (
                      <TextField
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                        name = "c"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                        />
                    ),
                    headerStyle: {
                        fontWeight: '600',
                        textAlign: 'right'
                    },
                    cellStyle:{
                        paddingRight: '34px',
                    }
                },                            
            ],
            data: [],
            c: 10000,
        }
    }
    
    

    getAccount = () =>{
        axios.post(window.Laravel.baseUrl + "/account/get", {type: -1})
            .then(response => {
                this.setState({
                    data: response.data
                })
            })
            .catch(err => {
                console.log('account bug: ' + err)
            })
    }
    
    componentDidMount(){
        this.getAccount()
    }
    addNewAccount = (newData) => {        
        return axios.post(baseUrl + '/account/create', newData)
            .then((response) => {
                this.props.enqueueSnackbar('Thêm tài khoản thành công', { 
                    variant: 'success',
                });
                this.setState(prevState => {
                    let data = [...prevState.data];
                    data.push(response.data);
                    data = data.sort((a, b) => {return a.level_1-b.level_1})
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                console.log("Add new account bug: "+ err)
            })
    }
    editAccount = (oldData, newData) => {

        newData.id = oldData.id
        return axios.post(baseUrl + '/account/edit', newData)
            .then(response => {
                this.props.enqueueSnackbar('Sửa tài khoản thành công', { 
                    variant: 'success',
                });                
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data[oldData.tableData.id] = newData;
                    return { ...prevState, data };
                });
            })
            .then(err => {
                console.log(err)
            })
    }
    deleteAccount = (oldData) => {
        return axios.post(baseUrl+ '/account/delete', {id: oldData.id})
            .then(response => {
                this.setState(prevState => {
                    let data = [...prevState.data];
                    
                    this.props.enqueueSnackbar('Xóa tài khoản thành công', { 
                        variant: 'success',
                    });    
                    data = data.filter(d => d.id != oldData.id)
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                console.log('delete Center bug: ' + err)
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        return(
            <div className="root-setting-account">
                <ReactNotification />
                <MaterialTable
                    title="Tài khoản kế toán"
                    columns={this.state.columns}
                    data={this.state.data}
                    options = {{
                        grouping: true,
                        pageSize: 10,
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewAccount(newData) ,
                        onRowUpdate: (newData, oldData) => this.editAccount(oldData, newData),
                        onRowDelete: oldData => this.deleteAccount(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy tài khoản',
                          editRow:{
                            deleteText: 'Bạn có chắc muốn xóa dòng này ?',
                            cancelTooltip: 'Đóng',
                            saveTooltip: 'Lưu'
                          },
                          deleteTooltip: "Xóa",
                          addTooltip: "Thêm mới"
                        },
                        toolbar: {
                          searchTooltip: 'Tìm kiếm',
                          searchPlaceholder: 'Tìm kiếm',
                          nRowsSelected: '{0} hàng được chọn'
                        },
                        pagination: {
                          labelRowsSelect: 'dòng',
                          labelDisplayedRows: ' {from}-{to} của {count}',
                          firstTooltip: 'Trang đầu tiên',
                          previousTooltip: 'Trang trước',
                          nextTooltip: 'Trang tiếp theo',
                          lastTooltip: 'Trang cuối cùng'
                        }
                    }}
                />
                
            </div>
        );
    }
}

export default withSnackbar(Account);