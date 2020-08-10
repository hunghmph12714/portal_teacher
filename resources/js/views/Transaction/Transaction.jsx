import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Transaction.scss'
import { Grid, TextField, FormLabel, Paper,Tooltip, IconButton
} from '@material-ui/core';
import { AccountSearch, TransactionForm, DialogTransaction } from './components';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { withSnackbar } from 'notistack'
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import NumberFormat from 'react-number-format';
import { format, isThisSecond } from 'date-fns'
import SendIcon from '@material-ui/icons/Send';
import { StudentSearch } from '../../components';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import Select , { components }  from "react-select";
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
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

const TransactionView = React.memo(props => {
    const {reload} = props
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            var r = await axios.post(baseUrl + '/transaction/get', {})            
            setData(r.data)
        }
        fetchData()
    },[reload])
    return(
        <MaterialTable
            title="Danh sách giao dịch"
            data={data}
            options={{
                pageSize: 20,
                pageSizeOptions: [20, 50, 100],
                grouping: true,
                filtering: true,
                exportButton: true,
                rowStyle: rowData => {                          
                },
                filterCellStyle: {
                    paddingLeft: '0px'
                }
            }}
            onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
            actions={[                       
                {
                    icon: () => <AddBoxIcon />,
                    tooltip: 'Thêm giao dịch',
                    isFreeAction: true,
                    text: 'Thêm giao dịch',
                    onClick: (event) => {
                        props.handleOpenCreate()
                    },
                },
            ]}
            icon={{
                Filter: () => <div />
            }}
            localization={{
                body: {
                    emptyDataSourceMessage: 'Không tìm thấy giao dịch'
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
                },
                grouping: {
                    placeholder: 'Kéo tên cột vào đây để nhóm'
                }
            }}
            columns={[
            //Actions
                {
                    title: "",
                    field: "action",
                    filtering: false,
                    disableClick: true,
                    sorting: false,
                    headerStyle: {
                        padding: '0px',
                        width: '80px',
                    },
                    cellStyle: {
                        width: '80px',
                        padding: '0px 5px 0px 0px',
                    },
                    render: rowData => (
                        <div style = {{display: 'block'}}>
                            {/* {rowData.tableData.id} */}
                            <Tooltip title="Chỉnh sửa" arrow>
                                <IconButton onClick={() => {props.handleOpenEdit(rowData)}}>
                                <EditOutlinedIcon fontSize='inherit' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Vô hiệu hóa giao dịch" arrow>
                                <IconButton onClick={() => {
                                if (window.confirm('Bạn có muốn vô hiệu hóa giao dịch này ? ')) 
                                    props.handleDeleteTransaction(rowData.id, rowData.tableData.id)}
                                }>
                                <DeleteForeverIcon fontSize='inherit' />
                                </IconButton>
                            </Tooltip>                                
                        </div>
                    )
                },
            //Thời  gian thực hiện giao dịch
                {
                    title: "Thời gian",
                    field: "time",
                    grouping: false,
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                        width: '130px',
                    },
                    cellStyle: {
                        padding: '0px',
                        width: '130px',
                    },
                    render: rowData => (<span> {rowData.time_formated} </span>)
                },
            //Số tiền  
                {
                    title: "Số tiền",
                    field: "amount",
                    type: "currency", 
                    grouping: false,
                    headerStyle: {
                        padding: '0px 0px',
                        fontWeight: '600',
                        width: '80px',
                        textAlign: 'right',
                    },
                    cellStyle: {
                        padding: '0px 15px 0px 0px',
                        width: '80px',
                        
                    },
                    render: rowData => {
                        return (                                
                            <Typography variant="body2" component="p">                                    
                                <b><NumberFormat value={rowData.amount} displayType={'text'} thousandSeparator={true}/></b>
                            </Typography>
                        )
                    },                            
                    
                },
            //Tài khoản nợ
                {
                    title: "TK nợ",
                    field: "debit_level_2",
                    grouping: false,
                    headerStyle: {
                        fontWeight: '600',
                        textAlign: 'right',
                        width: '100px',
                    },
                    cellStyle: {
                        padding: '0px 15px 0px 0px',
                        textAlign: 'right',
                        width: '100px',
                    },
                    render: rowData => {
                        var color = '#fef3d8'
                        if(rowData.debit_type === 'equity') {
                            color = '#f6deda';
                        }
                        if(rowData.debit_type === 'assets') {
                            color = '#bfdced';
                        }
                        if(rowData.debit_type === 'liabilties') {
                            color = '#fdeab5';
                        }
                        return (
                            <Chip style={customChip(color)} variant="outlined" label={rowData.debit_level_2} size="small" clickable/>
                        )
                    }
                },    
            //Tài khoản có
                {
                    title: "TK có",
                    field: "credit_level_2",
                    grouping: false,
                    headerStyle: {
                        fontWeight: '600',
                        width: '100px',
                    },
                    cellStyle: {
                        padding: '3px 0px',
                        width: '100px',
                    },
                    render: rowData => {
                        var color = '#fef3d8'
                        if(rowData.credit_type === 'equity') {
                            color = '#f6deda';
                        }
                        if(rowData.credit_type === 'assets') {
                            color = '#bfdced';
                        }
                        if(rowData.credit_type === 'liabilties') {
                            color = '#fdeab5';
                        }
                        return (
                            <span> <Chip className="credit-account" style={customChip(color)} label={rowData.credit_level_2} size="small" clickable/> </span>
                        )
                    }
                },          
            // Miêu tả
                {
                    title: "Nội dung",
                    field: "content",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        padding: '0px',
                    },
                },
            //Tag
                {
                    title: "Tag",
                    field: "tags",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        padding: '0px',
                    },
                    render: rowData => {
                        return (<span>
                            {rowData.tags.map(tag => {
                                return (<Chip color="secondary" size="small" label={tag.name} clickable/>)
                            })}
                        </span>)
                    }
                },
            // Học sinh
                {
                    title: "Học sinh",
                    field: "sname",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                        
                    },
                    cellStyle: {
                        padding: '0px',
                    },
                    render: rowData => {
                    return (                                
                        <Typography variant="body2" component="p">                                    
                            <b>{rowData.sname}</b>
                            <br /> {rowData.dob}
                        </Typography>
                        
                    )
                    },
                    
                    renderGroup: (sname, groupData) => (
                        <Chip variant="outlined" label={sname} size="small" />      
                    )
                },
            //Lớp học
                {
                    title: "Lớp học",
                    field: "cname",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                        width: '100px',
                    },
                    cellStyle: {
                        padding: '0px',
                        width: '100px',
                    },
                },
            //Người tạo
                {
                    title: "Người tạo",
                    field: "uname",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                        width: '100px',
                    },
                    cellStyle: {
                        padding: '0px',
                        width: '100px',
                    },                            
                },
            //Ngày tạo
                {
                title: "Ngày tạo",
                field: "created_at",
                headerStyle: {
                    padding: '0px',
                    fontWeight: '600',
                    width: '100px',
                },
                cellStyle: {
                    padding: '0px',
                    width: '100px',
                },
                render: rowData => {
                    let date = format(new Date(rowData.created_at),  'dd-MM-yyyy')
                    return (<span>{date}</span>)
                }
                },
            
            ]}
            detailPanel={rowData => {
            return (
                <div> {rowData.step} </div>
            )
            
            }}
                
        />
    )
})
class Transaction extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            open_dialog : false,
            dialog_type : 'create',
            selected_transaction : '',
            reload: false,
        }
    }
    handleDeleteTransaction = (id, table_id) => {
        axios.post(baseUrl + '/transaction/delete', {id: id})
            .then(response => {
                this.props.enqueueSnackbar('Xóa thành công', {variant: 'success'})
                this.setState({ reload: !this.state.reload })
            })            
            .catch(err => {
                
            })
    }
    handleOpenCreateDialog = () => {
        this.setState({ open_dialog: true, dialog_type : 'create', selected_transaction: '' })
    }
    handleOpenEditDialog = (transaction) => {        
        this.setState({ open_dialog: true, dialog_type : 'edit', selected_transaction: transaction.id})
    }
    handleCloseDialog =  () => {
        this.setState({ open_dialog : false, reload: !this.state.reload })
    }
    render(){
        return(
            <React.Fragment>
                <DialogTransaction 
                    open= {this.state.open_dialog}
                    handleClose = {this.handleCloseDialog}
                    dialogType = {this.state.dialog_type}
                    transaction_id = {this.state.selected_transaction}
                />
                <TransactionView
                    reload = {this.state.reload}
                    handleOpenCreate = {this.handleOpenCreateDialog}
                    handleOpenEdit = {this.handleOpenEditDialog}
                    handleDeleteTransaction = {this.handleDeleteTransaction}
                />
            </React.Fragment>
        )
    }
}
export default withSnackbar(Transaction)