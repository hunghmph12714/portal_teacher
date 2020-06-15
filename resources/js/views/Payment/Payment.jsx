import React , {useState, useEffect} from 'react'
import './Payment.scss'
import { AccountSearch } from '../Transaction/components';
import { TransactionForm } from '../Transaction/components';
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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    const {reload} = props
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            var r = await axios.get(baseUrl + '/payment/get')            
            setData(r.data)
        }
        fetchData()
    },[reload])
    return(
        <MaterialTable
            title="Danh sách phiếu chi"
            data={data}
            options={{
                pageSize: 20,
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
                    tooltip: 'Thêm phiếu chi',
                    isFreeAction: true,
                    text: 'Thêm phiếu chi',
                    onClick: (event) => {
                        this.props.history.push('/entrance/create')
                    },
                },
            ]}
            icon={{
                Filter: () => <div />
            }}
            localization={{
                body: {
                    emptyDataSourceMessage: 'Không tìm thấy phiếu chi hoặc sever gặp lỗi'
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
            //Thời  gian chứng từ
                {
                    title: "Chứng từ",
                    field: "created_at",
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
                    render: rowData => (<span> {format(new Date(rowData.created_at) , 'd/M/yyyy')} </span>)
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
            name: '',
            amount: '',
            address:'',
            description: '',    
            payment_time: new Date,
            reload: false,
            remaining_amount: '',
            transaction_count: 0,
            transactions: [],
        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
            remaining_amount: (e.target.name == 'amount') ? e.target.value : 0
        })
    }
    handlePaymentTimeChange  = (date) => {
        this.setState({ payment_time : date })
    }
    onChangeTransactionCount = (e) => {
        let t = []
        let c = (e.target.value > 10) ? 10 : e.target.value        
        for(let i = 0 ; i < c ; i++){
            t.push({debit: '', credit: '', time: new Date(), student: '', amount: 0, content: '', selected_class: null, selected_session: null, note: '', tags:[]})
        }
        this.setState({
            transaction_count: c,
            transactions: t,  
        })
    }
    handleDateChange = (key, date) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].time = date;
            return {...prevState, transactions}
        })
    }
    handleDebitChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].debit = newValue;
            return {...prevState, transactions}
        })
    }
    handleCreditChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].credit = newValue;
            return {...prevState, transactions}
        })
    }
    handleStudentChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key].student = newValue;
            return {...prevState, transactions}
        }) 
    }
    handleClassChange = (key, newValue) => {

        if(this.state.transactions[key].selected_class != newValue || !this.state.transactions[key].selected_class){
            this.setState(prevState => {
                let transactions = prevState.transactions;
                transactions[key]['selected_session'] = [] 
                transactions[key]['selected_class'] = (newValue)?newValue:[]
                return {...prevState, transactions}
            })
        }
    }
    handleSessionChange = (key, newValue) => {
        if(this.state.transactions[key].selected_session != newValue ){
            this.setState(prevState => {
                let transactions = prevState.transactions;
                transactions[key]['selected_session'] = (newValue)? newValue: [] 
                return {...prevState, transactions}
            })
        }
    }
    handleAmountChange = (key, newValue) => {
        let amount = newValue.target.value
        let reg_amount = 0
        for(let i = 0; i<this.state.transactions.length; i++){
            if(i !== key){
                reg_amount += this.state.transactions[i].amount;
            }
        }
        if(amount <= this.state.remaining_amount - reg_amount){
            this.setState(prevState => {
                let transactions = prevState.transactions;
                transactions[key]['amount'] = (newValue) ? amount: 0
                return {...prevState, transactions}
            })
        }
        else{
            this.props.enqueueSnackbar('Số tiền không hợp lệ', {variant: 'warning', })
        }
    }
    handleNoteChange = (key, newValue) => {
        let note = newValue.target.value
        this.setState(prevState => {
            
            let transactions = prevState.transactions;
            transactions[key]['note'] = (newValue) ? note : ''
            return { ...prevState, transactions}
        })
    }
    handleTagChange = (key, newValue) => {
        this.setState(prevState => {
            let transactions = prevState.transactions;
            transactions[key]['tags'] = newValue
            return {...prevState, transactions}
        })
    }
    onSubmitTransaction = (e) => {
        e.preventDefault();
        let data = this.state        
        axios.post(baseUrl + '/payment/create', data)
            .then(response => {
                this.setState({reload: !this.state.reload})
                this.props.enqueueSnackbar('Tạo thành công', {
                    variant: 'success'
                })
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra, vui lòng kiểm tra lại', {
                    variant: 'error'
                })
            })        
    }
    render(){
        return (
            <React.Fragment>
                <div className="root-payment">
                <form noValidate autoComplete="on">
                        <Paper elevation={4} className="paper-payment">
                            <h2>Lập phiếu chi</h2>
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
                                    <FormLabel color="primary">Địa chỉ</FormLabel>
                                    <TextField
                                        fullWidth
                                        value={this.state.address}
                                        onChange={e => this.onChange(e)}
                                        name = "address"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} id="payment-form">
                                <Grid item xs={12} sm={6}>
                                    <FormLabel color="primary">Lý do</FormLabel>
                                    <TextField
                                        fullWidth
                                        value={this.state.description}
                                        onChange={e => this.onChange(e)}
                                        name = "description"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
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
                                <Grid item xs={12} sm={3}>
                                    <FormLabel color="primary">Ngày chứng từ</FormLabel>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            autoOk
                                            fullWidth
                                            value={this.state.payment_time}                            
                                            onChange={this.handlePaymentTimeChange}
                                            placeholder="Ngày chứng từ"                            
                                            className="input-date"
                                            variant="inline"
                                            size="small"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                        />
                                                    
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                            <Grid container justify="flex-start" alignItems="center" spacing={2}>
                                <Grid item xs={4} md={2} xl={1}>
                                    <Typography variant="button"><b>Hạch toán</b></Typography>
                                </Grid>
                                <Grid item xs={4} xl={1} md={1}>
                                    <TextField
                                        fullWidth
                                        value={this.state.transaction_count}
                                        onChange={e => this.onChangeTransactionCount(e)}
                                        name = "transaction_count"
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        inputProps={{ min: "0", max: "10", step: "1" }}
                                    />
                                </Grid>
                                <Grid item xs={4} xl={2} md={2}>
                                    <Typography variant="button">giao dịch</Typography>
                                </Grid>
                            </Grid>                      
                            {this.state.transactions.map((transaction, key) => {
                                return (
                                    <TransactionForm
                                        debit = {transaction.debit}
                                        credit = {transaction.credit}
                                        time = {transaction.time}
                                        student = {transaction.student}
                                        amount = {transaction.amount}
                                        content = {transaction.content}
                                        selected_class = {transaction.selected_class}
                                        selected_session = {transaction.selected_session}
                                        content = {transaction.note}
                                        tags = {transaction.tags}

                                        onChange = { this.onChange }
                                        handleDateChange = { (date) => this.handleDateChange(key, date ) }
                                        handleDebitChange = { (newValue) => this.handleDebitChange(key, newValue) }
                                        handleCreditChange = { (newValue) => this.handleCreditChange(key, newValue) }
                                        handleStudentChange = {(newValue) => this.handleStudentChange(key, newValue)}
                                        handleClassChange = {(newValue) => this.handleClassChange(key, newValue)}
                                        handleSessionChange = {(newValue) => this.handleSessionChange(key, newValue) }
                                        handleAmountChange = { (newValue) => this.handleAmountChange(key, newValue)}
                                        handleNoteChange = { newValue => this.handleNoteChange(key, newValue) }
                                        handleTagChange = { newValue => this.handleTagChange(key, newValue) }
                                        submitButton = {false}
                                        onSubmitTransaction = {{}}                   
                                    />
                                )
                            })}
                            <Button
                                variant="contained"
                                color="secondary"
                                className="submit-btn"
                                onClick = {(e) => this.onSubmitTransaction(e)}
                                endIcon={<SendIcon/>}
                            >
                                Tạo mới
                            </Button>
                        </Paper>
                    </form>
                    
                </div>
                <PaymentView
                        reload = {this.state.reload}
                    />
            </React.Fragment>
        )
    }

}
export default withSnackbar(Payment)