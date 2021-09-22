import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Transaction.scss'
import { Grid, TextField, FormLabel, Paper,Tooltip, IconButton,
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
import vi from "date-fns/locale/vi";
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
const TagSelect = React.memo(props => {
    const [data, setData] = useState([])
    const fetchdata = async() => {
        const r = await axios.get(window.Laravel.baseUrl + "/tag/get")
        let data = r.data.map(c => {
            return {label: c.name, value: c.id}
        })
        setData(data)
    }
    useEffect(() => {        
        fetchdata()
    }, [])    
    return(        
        <div className = "tag-input">
            <Select                
                key = "tag-select"
                className="select-box"
                isMulti
                value = {props.tags}
                name = "tags"
                placeholder="Chọn nhãn dán"
                options={data}
                onChange={props.handleChange}
            />                 
        </div>
    )
})
const ClassSelect = React.memo(props => {
    const {center, course, student} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            var r = await axios.get(baseUrl + '/class/get-all/'+center+'/'+course)
            // if(student){
            //     r = await axios.post(baseUrl + '/class/student', {'student_id': student.value})
            // }
            setClasses(r.data.map(c => {
                return {label: c.code + ' - ' +c.name, value: c.id}
            }))        
            
        }
        fetchdata()
    }, [student])
    
    return( 
        <Select className = "select-box"
            isMulti={props.isMulti}
            key = "class-select"
            value = {props.selected_class}
            name = "selected_class"
            placeholder="Chọn lớp"
            isClearable
            options={classes}
            onChange={props.handleChange}
        />)
})
const TransactionView = React.memo(props => {
    const {reload} = props
    const [filters, setFilters] = useState({
        student: '',
        selected_class: '',
        from: null,
        to: null,
        credit: '',
        debit: '',
        tags:[],
        touched: false,
    })
    const tableRef = React.createRef();
    const [data, setData] = useState([])
    useEffect(() => tableRef.current && tableRef.current.onQueryChange() ,[reload])
    // useEffect(() => console.log(tableRef.) ,[reload])
    
    function handleStudentChange(value){
        setFilters({...filters, student: value, touched: true})
    }
    function handleClassChange(value){
        setFilters({...filters, selected_class: value, touched: true})
    }
    function handleToChange(date){
        setFilters({...filters, to: date, touched: true})
    }
    function handleFromChange(date){
        setFilters({...filters, from: date, touched: true})
    }
    function handleDebitChange(debit){
        setFilters({...filters, debit: debit, touched: true})
    }
    function handleCreditChange(credit){
        setFilters({...filters, credit: credit, touched: true})
    }
    function handleTagChange(tags){
        setFilters({...filters, tags:tags, touched: true})
    }
    function handleFilter(){
        console.log(filters)
        tableRef.current && tableRef.current.onQueryChange() 
    }
    return(
        <div>
            <div className="filter">
                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <FormLabel color="primary">Khoảng thời gian</FormLabel>
                        <Grid container spacing={2}>
                            <Grid item md={6} sm={12}> 
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                                <KeyboardDatePicker
                                    fullWidth
                                    autoOk
                                    size= "small"
                                    className="input-from-range"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    label="Từ ngày"
                                    views={["year", "month", "date"]}
                                    value={filters.from}
                                    onChange={handleFromChange}
                                />  
                            </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item md={6} sm={12}> 
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} className='to'>
                                <KeyboardDatePicker
                                    fullWidth
                                    autoOk
                                    minDate = {filters.from}
                                    className="input-to-range"
                                    size= "small"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    label="Đến ngày"
                                    views={["year", "month", "date"]}
                                    value={filters.to}
                                    onChange={handleToChange}
                                />  
                                </MuiPickersUtilsProvider>
                            </Grid>

                    </Grid>
                    </Grid>
                    
                    <Grid item md={4}>
                        <FormLabel color="primary">Học sinh</FormLabel>
                        <div className="student">
                            <StudentSearch
                                student_name={filters.student}
                                handleStudentChange={handleStudentChange}
                            />
                        </div>
                    </Grid>
                    <Grid item md={4}>
                        <FormLabel color="primary">Lớp học</FormLabel>
                        <div className="class">
                            <ClassSelect 
                                selected_class = {filters.selected_class}
                                handleChange={handleClassChange}
                                course = {-1}
                                center = {-1}
                                student = {filters.student}
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <FormLabel color="primary">Tài khoản nợ</FormLabel>
                        <div className="account">
                        <AccountSearch
                            account={filters.debit}
                            handleAccountChange={handleDebitChange}
                        />
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel color="primary">Tài khoản có</FormLabel>
                        <div className="account">
                        <AccountSearch
                            account={filters.credit}
                            handleAccountChange={handleCreditChange}
                        />
                        </div>
                    </Grid>
                    <Grid item md={4}>
                        <FormLabel color="primary">Tag</FormLabel>
                        <div className="tag"> 
                            <TagSelect 
                                tags = {filters.tag}
                                isMulti = {true}
                                handleChange = {handleTagChange}
                            />
                        </div>
                    </Grid>
                    <Grid item md={2}>
                        <Button variant="outlined" color="primary" fullWidth className="btn" onClick={handleFilter}> 
                        Lọc giao dịch </Button>
                    </Grid>
                </Grid>
            </div>
            {/* <Grid container spacing={2}> 
                <Grid item> </Grid>
            </Grid> */}
            <div className="transaction-table">
                <MaterialTable
                    title="Danh sách giao dịch"
                    tableRef={ tableRef }
                    data={(query) => new Promise((resolve, reject) => {
                        axios.post(baseUrl + '/transaction/get', {filter: filters, page: query.page, per_page: query.pageSize})
                            .then(response => {
                                resolve(
                                    {
                                        filters: {},
                                        data: response.data.data,
                                        page: response.data.page,
                                        totalCount: response.data.total
                                    }
                                )
                                query.filters = filters
                            })
                        })
                    }
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
            </div>
        </div>
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
        document.title = 'Giao dịch'
        return(
            <div>
                
                <TransactionView
                    reload = {this.state.reload}
                    handleOpenCreate = {this.handleOpenCreateDialog}
                    handleOpenEdit = {this.handleOpenEditDialog}
                    handleDeleteTransaction = {this.handleDeleteTransaction}
                />
                <DialogTransaction 
                    open= {this.state.open_dialog}
                    handleClose = {this.handleCloseDialog}
                    dialogType = {this.state.dialog_type}
                    transaction_id = {this.state.selected_transaction}
                />
            </div>
        )
    }
}
export default withSnackbar(Transaction)