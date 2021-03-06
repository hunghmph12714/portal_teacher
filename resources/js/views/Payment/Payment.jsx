import React , {useState, useEffect} from 'react'
import './Payment.scss'
import { DialogForm } from './components'
import { withSnackbar } from 'notistack'
import NumberFormat from 'react-number-format';
import { format } from 'date-fns'
import {
    IconButton,
    Tooltip,
} from "@material-ui/core";

import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Chip from '@material-ui/core/Chip';
import MaterialTable from "material-table";
import DeleteIcon from '@material-ui/icons/Delete';
import PostAddIcon from '@material-ui/icons/PostAdd';
import EditIcon from '@material-ui/icons/Edit';
import PrintIcon from '@material-ui/icons/Print';
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
const PaymentView = React.memo(props => {
    const {reload, handleOpenCreateDialog, handleOpenEditDialog, handleDeletePayment} = props
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            var r = await axios.get(baseUrl + '/payment/get')            
            setData(r.data)
        }
        fetchdata()
    },[reload])
    return(
        <MaterialTable
            className = "payment-table"
            title="Danh sách phiếu chi"
            data={data}
            options={{
                pageSize: 20,
                grouping: true,
                filtering: true,
                pageSizeOptions: [20, 50, 100],
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
                    tooltip: 'Thêm phiếu chi',
                    isFreeAction: true,
                    text: 'Thêm phiếu chi',
                    onClick: (event) => {handleOpenCreateDialog()},
                },
            ]}
            icons={{
                Filter: () => <span />
            }}
            localization={{
                body: {
                    emptyDataSourceMessage: 'Không tìm thấy phiếu chi'
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
                {
                    title: "",
                    className: "action",
                    field: "action",
                    disableClick: true,
                    sorting: false,
                    filtering: false,
                    headerStyle: {
                        padding: '0px',
                        width: '130px',
                    },
                    cellStyle: {
                        width: '130px',
                        padding: '0px',
                    },
                    render: rowData => (
                        <div style = {{display: 'block'}}>
                            <Tooltip title="Hạch toán" arrow>
                                <span>
                                    <IconButton onClick={() => {handleOpenEditDialog(rowData)}} disabled = {rowData.amount == rowData.transactions.map(t => t.amount).reduce((acc, cur) => {return acc+cur} , 0)}>
                                        <PostAddIcon fontSize='inherit' />
                                    </IconButton>
                                </span>                                
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa" arrow>
                                <IconButton onClick={() => {handleOpenEditDialog(rowData)}}>
                                    <EditIcon fontSize='inherit' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa phiếu chi" arrow>
                                <IconButton onClick={() => {
                                    if (window.confirm('Xóa phiếu chi?')) 
                                    handleDeletePayment(rowData.id)}
                                }>
                                <DeleteIcon fontSize='inherit' />
                                </IconButton>
                            </Tooltip>    
                            <Tooltip title="In phiếu chi" arrow>
                                <IconButton onClick={() => {
                                    window.open('/paper/print/' + rowData.id, '_blank')
                                }}>
                                <PrintIcon fontSize='inherit' />
                                </IconButton>
                            </Tooltip>                            
                        </div>
                    )
                },
            //Số phiếu thu
                {
                    title: "ID",
                    field: "payment_number",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                        width: '100px'
                    },
                    cellStyle: {
                        padding: '0px',
                        width: '100px'
                    },
                    render: rowData => {
                        return (
                            <span>
                                PC{rowData.payment_number}
                            </span>
                        )
                    }
                },
            //Thời  gian chứng từd
                {
                    title: "Chứng từ",
                    field: "time_formated",
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
            //Cơ sở
                {
                    title: "Cơ sở",
                    field: "ctname",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        padding: '0px',
                    },
                },
            // Người nhận
                {
                    title: "Người nhận",
                    field: "name",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        padding: '0px',
                    },
                },
            // Địa chỉ
                {
                    title: "Địa chỉ",
                    field: "address",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        padding: '0px',
                    },
                },
            // Lý do
                {
                    title: "Lý do",
                    field: "description",
                    headerStyle: {
                        padding: '0px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        padding: '0px',
                    },
                },
            //Nguoi tạo
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
            
            ]}
            detailPanel={rowData => {
            return (
                <MaterialTable 
                    title= {"Hạch toán"}
                    options = {{
                        paging: false,
                        search: false
                    }}
                    data= {rowData.transactions}
                    columns={[
                        //Thời  gian thực hiện giao dịch
                            {
                                title: "Thời gian",
                                field: "time",
                                grouping: false,                                
                                headerStyle: {
                                    padding: '5px 15px',
                                    fontWeight: '600',
                                    width: '130px',
                                },
                                cellStyle: {
                                    padding: '5px 15px',
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
                                        <span> >> <Chip className="credit-account" style={customChip(color)} label={rowData.credit_level_2} size="small" clickable/> </span>
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
                />
            )
            
            }}
        />
    )
})
class Payment extends React.Component {
    constructor(props){
        super(props)
        this.state = {      
            reload: false,
            open: false,
            type: 'create',  
            selected_data : [],  
        }
    }
    
    handleCloseDialog = () => {
        this.setState({
            open: false, 
            selected_data: []
        })
    }
    //s
    handleOpenCreateDialog = () => {
        this.setState({
            open: true, 
            type: 'create',
            selected_data: []
        })
    }
    handleReloadTable = () => {
        this.setState({reload : !this.state.reload})
    }
    handleOpenEditDialog = (rowData) => {
        this.setState({
            selected_data: rowData,
            type: 'edit',
            open: true,
        })
    }
    handleDeletePayment = (payment_id) => {
        axios.post(baseUrl + '/payment/delete', {payment_id: payment_id})
            .then(response => {
                this.setState({
                    reload: !this.state.reload
                })
                this.props.enqueueSnackbar('Xóa thành công', {variant: 'success'})
            })
            .catch(err => {
                console.log(err)
            })
    }
    render(){
        document.title = 'Phiếu chi'
        return (
            <React.Fragment>
                <DialogForm 
                    open = {this.state.open}
                    type = {this.state.type}
                    payment = {this.state.selected_data}
                    handleCloseDialog = {this.handleCloseDialog}
                    handleReloadTable = {this.handleReloadTable}
                />                  
                <PaymentView
                    reload = {this.state.reload}
                    handleOpenCreateDialog = {this.handleOpenCreateDialog}
                    handleOpenEditDialog = {this.handleOpenEditDialog}
                    handleDeletePayment = {this.handleDeletePayment}
                    
                />
            </React.Fragment>
        )
    }

}
export default withSnackbar(Payment)