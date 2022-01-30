import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './BudgetStats.scss'
import { Grid, TextField, FormLabel, Paper,Tooltip, IconButton, colors
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { withSnackbar } from 'notistack'
import DateFnsUtils from "@date-io/date-fns"; // choose your lib

import NumberFormat from 'react-number-format';
import { format, isThisSecond } from 'date-fns'
import SendIcon from '@material-ui/icons/Send';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import vi from "date-fns/locale/vi";
import Select , { components }  from "react-select";
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Chip from '@material-ui/core/Chip';
import MUITable from 'mui-tables';

const data = [
    { name: 'Bob', demographics: { age: 29, gender: "male" } },
    { name: 'Alice', demographics: { age: 34, gender: "female" } }
];

const columns = {
    static: [
        {
            name: 'name',
            title: 'Name',
            calculateCellDefinition: (entry) => ({
                display: entry.name,
                value: entry.name
            })
        },
        {
            name: 'age',
            title: 'Age',
            calculateCellDefinition: (entry) => ({
                // Never ask a woman's age fool!
                display: entry.demographics.age,
                value: entry.demographics.age
            }),
            type: 'metric',
            summary: true,
            summaryOptions: 'SUM',
            format: 'float'
        }
    ]
};

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
const DetailView = React.memo(props => {
    const col = [
        {
            title: "Chi phí",
            field: "account",
            headerStyle: {
                fontWeight: '600',
            },
        },
        {
            title: "Dự trù",
            field: "amount",
            headerStyle: {
                fontWeight: '600',
                textAlign: 'right'
            },
            type: "currency", 
            currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
        },                  
        {
            title: "Tỷ lệ",
            field: "limit",         
            headerStyle: {
                fontWeight: '600',
            },            
            // defaultGroupOrder: 2
        },
        {
            title: "Thực tế",
            field: "actual",
            filtering: false,
            headerStyle: {
                fontWeight: '600',
                textAlign: 'right'
            },
            type: "currency", 
            currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
            
        },
        {
          title: "Chênh lệch",
          field: "dif",
          headerStyle: {
            fontWeight: '600',
            textAlign: 'right'
            },
            type: "currency", 
                currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
        }
    ]
    
    const [data, setData] = useState([])
    useEffect(() => {
        axios.post('/budget/stats', {id : props.budget_id})
            .then(response => {
                setData(response.data)
            })
    } ,[])
    return (
        <MaterialTable
            title="Danh sách phân bố ngân sách"
            data={data}
            options={{
                pageSize: 5,
                grouping: true,
                filtering: false,
                exportButton: true,
                rowStyle: rowData => {
                    if(rowData.amount < rowData.actual){
                        return {backgroundColor: colors.orange[200],}
                    }
                }, 
            }}
            
            localization={{
                body: {
                    emptyDataSourceMessage: 'Không tìm thấy phân bố ngân sách'
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
        columns={col}
            
    />
    )
})
const TransactionView = React.memo(props => {
    const {reload} = props
    const tableRef = React.createRef();
    const [data, setData] = useState([])
    useEffect(() => tableRef.current && tableRef.current.onQueryChange() ,[reload])
    return(
        <MaterialTable
            title="Danh sách giao dịch"
            tableRef={ tableRef }
            data={(query) => new Promise((resolve, reject) => {
                axios.post(baseUrl + '/transaction/get', {filter: query.filters, page: query.page, per_page: query.pageSize, budget_id: props.budget_id})
                    .then(response => {
                        resolve(
                            {
                                data: response.data.data,
                                page: response.data.page,
                                totalCount: response.data.total
                            }
                        )
                         
                    })
                })
            }
            options={{
                pageSize: 10,
                pageSizeOptions: [10, 20, 50, 100],
                grouping: true,
                filtering: true,
                exportButton: true,
                rowStyle: rowData => {                          
                },
                filterCellStyle: {
                    paddingLeft: '0px'
                }
            }}
            // onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
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
            
            //Thời  gian thực hiện giao dịch
                {
                    title: "Thời gian",
                    field: "time",
                    grouping: false,
                    headerStyle: {
                        fontWeight: '600',
                        width: '130px',
                    },
                    cellStyle: {
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
                        fontWeight: '600',
                        width: '80px',
                        textAlign: 'right',
                    },
                    cellStyle: {
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
                        fontWeight: '600',
                    },
                    cellStyle: {
                    },
                },
            //Tag
                {
                    title: "Tag",
                    field: "tags",
                    headerStyle: {
                        fontWeight: '600',
                    },
                    cellStyle: {
                    },
                    render: rowData => {
                        return (<span>
                            {rowData.tags.map(tag => {
                                return (<Chip color="secondary" size="small" label={tag.name} clickable/>)
                            })}
                        </span>)
                    }
                },
            
            //Người tạo
                {
                    title: "Người tạo",
                    field: "uname",
                    headerStyle: {
                        fontWeight: '600',
                        width: '100px',
                    },
                    cellStyle: {
                        width: '100px',
                    },                            
                },
            //Ngày tạo
                {
                title: "Ngày tạo",
                field: "created_at",
                headerStyle: {
                    fontWeight: '600',
                    width: '100px',
                },
                cellStyle: {
                    width: '100px',
                },
                render: rowData => {
                    let date = format(new Date(rowData.created_at),  'dd-MM-yyyy')
                    return (<span>{date}</span>)
                }
                },
            
            ]}
        />
    )
})
class BudgetStats extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            open_dialog : false,
            dialog_type : 'create',
            selected_transaction : '',
            reload: false,
            accounts: [],
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
        document.title = 'Ngân sách'
        return(
            <div>
                <DetailView
                    budget_id = {this.props.match.params.id}
                />
                <TransactionView
                    reload = {this.state.reload}
                    handleOpenCreate = {this.handleOpenCreateDialog}
                    handleOpenEdit = {this.handleOpenEditDialog}
                    handleDeleteTransaction = {this.handleDeleteTransaction}
                    budget_id = {this.props.match.params.id}
                />
            </div>
        )
    }
}
export default withSnackbar(BudgetStats)