import React from 'react';
import './Budget.scss'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import NumberFormat from 'react-number-format';
import AddBoxIcon from '@material-ui/icons/AddBox';

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
    Typography,
    Tooltip,
  } from "@material-ui/core";
import MaterialTable from "material-table";
import {MTableAction} from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icofont from "react-icofont";
import { withSnackbar } from 'notistack';
import axios from 'axios'
import { BudgetDetail } from './components';
const baseUrl = window.Laravel.baseUrl;

class Budget extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Tên ngân sách', field: 'name', headerStyle: {
                    fontWeight: '600',
                }, },
                { title: 'Cơ sở', field: 'center_id', headerStyle: {
                    fontWeight: '600',
                }},
                { title: 'Từ ngày', field: 'from_formated', type: 'date',headerStyle: {
                    fontWeight: '600',
                }, },
                { title: 'Đến ngày', field: 'to_formated', type: 'date',headerStyle: {
                    fontWeight: '600',
                }, },
                { title: 'Tình trạng', field: 'status',headerStyle: {
                    fontWeight: '600',
                }, lookup: {'Đang hoạt động':'Đang hoạt động','Quá hạn mức':'Quá hạn mức','Dừng hoạt động':'Dừng hoạt động'}},        
                         
                {
                    title: "Hạn mức",
                    field: "limit",
                    type: "currency", 
                    grouping: false,
                    headerStyle: {
                        fontWeight: '600',
                        width: '180px',
                        textAlign: 'right',
                    },
                    cellStyle: {
                        width: '180px',
                        
                    },
                    render: rowData => {
                        return (                                
                            <Typography variant="body2" component="p">                                    
                                <b><NumberFormat value={rowData.limit} displayType={'text'} thousandSeparator={true}/></b>
                            </Typography>
                        )
                    },     
                },
                {
                    title: "Thực tế",
                    field: "actual",
                    type: "currency", 
                    grouping: false,
                    headerStyle: {
                        fontWeight: '600',
                        width: '180px',
                        textAlign: 'right',
                    },
                    cellStyle: {
                        width: '180px',
                        
                    },
                    render: rowData => {
                        return (                                
                            <Typography variant="body2" component="p">                                    
                                <b><NumberFormat value={rowData.actual} displayType={'text'} thousandSeparator={true}/></b>
                            </Typography>
                        )
                    },     
                },
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never' , headerStyle: {
                    fontWeight: '600',
                    width: '180px',
                    textAlign: 'right',
                },},               
            ],
            data: [],
            c: 10000,
            centers: {},
            open_detail: false,
            selected_budget: {},
            accounts: [],
            selected_detail: [],
        }
    }
    getCenter = () => {
        axios.get(window.Laravel.baseUrl + "/get-center")
            .then(response => {
                let lp = {}
                for (const center of response.data){
                    lp[center.id] = center.name
                }
                let center_col = { title: 'Cơ sở', field: 'center_id', lookup : lp, 
                headerStyle: {
                    fontWeight: '600',
                }}
                this.setState(prevState => {
                    const columns = [...prevState.columns]
                    columns[1] = center_col
                    return {...prevState, columns}
                })
            })
    }
    getBudget = () =>{
        axios.post(window.Laravel.baseUrl + "/budget/get")
            .then(response => {
                this.setState({
                    data: response.data
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }
    getAccounts = () => {
        axios.post(window.Laravel.baseUrl + "/account/get")
            .then(response => {
                let accs = response.data.map(a => {
                    return {label: a.level_2 + ' - ' + a.name, value: a.id}
                })
                this.setState({
                    accounts: accs
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }
    componentDidMount(){
        this.getBudget()
        this.getCenter()
        this.getAccounts()
    }
    addNewBudget = (newData) => {        
        return axios.post(baseUrl + '/budget/create', newData)
            .then((response) => {
                
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.push(response.data);
                    return { ...prevState, data };
                });
                this.props.enqueueSnackbar('Thêm thành công', {variant: 'success'})
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'})
            })
    }
    editBudget = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/budget/edit', req)
            .then(response => {
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data[oldData.tableData.id] = newData;
                    return { ...prevState, data };
                });
                this.props.enqueueSnackbar('Sửa thành công', {variant: 'success'})
            })
            .then(err => {
                // this.props.enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'})
            })
    }
    deleteBudget = (oldData) => {
        return axios.post(baseUrl+ '/budget/delete', {id: oldData.id})
            .then(response => {
                this.props.enqueueSnackbar('Xoá thành công', {variant: 'success'})
                this.getBudget()
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'})
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    openDetailDialog = rowData => {
        axios.post('/budget/get-detail', {id: rowData.id})
            .then(response => {
                this.setState({open_detail: true, 
                    selected_budget: rowData, 
                    selected_detail: response.data})
            })
            .catch(err => {
                this.enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại sau', {variant: 'error'})
            })
        
    }
    closeDetailDialog = () => {
        this.setState({ open_detail: false, selected_budget: {}, selected_detail: [] })
    }
    handleBudgetStats = (event, rowData) => {
        this.props.history.push('/budget/'+rowData.id)
    }
    render(){
        document.title = 'Ngân sách'

        return(
            <div className="root-base-salary">
                <ReactNotification />
                <MaterialTable
                    title="Quản lý Ngân sách"
                    columns={this.state.columns}
                    data={this.state.data}
                    options= {{
                        grouping: true,
                        filtering: true,
                    }}
                    actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Chi tiết ngân sách',
                            isFreeAction: false,
                            text: 'Chi tiết ngân sách',
                            onClick: (e, rowData) => {
                                this.openDetailDialog(rowData)
                            },
                        },
                    ]}
                    editable={{
                        onRowAdd: newData => this.addNewBudget(newData) ,
                        onRowUpdate: (newData, oldData) => this.editBudget(oldData, newData),
                        onRowDelete: oldData => this.deleteBudget(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không có Ngân sách nào',
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
                    onRowClick = {(event, rowData) => this.handleBudgetStats(event, rowData)}
                />
                <BudgetDetail 
                    open = {this.state.open_detail}
                    handleCloseDialog = {this.closeDetailDialog}
                    selectedBudget = {this.state.selected_budget}
                    accountOptions = { this.state.accounts }
                    selectedAccount = { this.state.selected_detail }
                />
            </div>
        );
    }
}
export default withSnackbar(Budget)
