import React , {useState, useEffect} from 'react'
import { StudentSearch, ParentSearch } from '../../components'
import './Fee.scss'
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
            <Select
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
            <Select
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
const ListFee = React.memo(props => {
    const [fees, setFee] = useState([])
    const [show_all, setAll] = useState(false)
    useEffect(() => {
        const fetchData = async() => {
            let sum = 0;
            const r  = await axios.post(baseUrl + '/fee/get', {student_id: props.student_id, show_all: show_all})
            let data = r.data
            sum = data.filter( t => {
                if(t.id < 0 && t.id != -9999){
                    return t.amount
                }} ).map(x => x.amount).reduce((acc, tr) => acc + parseInt(tr), 0)
            data.unshift({month: '', time: '', content:'Tổng', cname: '', amount: sum, id: -9999})
            
            console.log(data)
            setFee(data)
        }
        fetchData()
    }, [props.reload, show_all])
    return (
        <MaterialTable
            title= "Bảng kê Học Phí học sinh"
            data={fees}
            localization={{
                pagination: {
                    labelDisplayedRows: '{from}-{to} của {count}'
                },
                toolbar: {
                    nRowsSelected: '{0} học phí được chọn'
                },
                header: {
                    actions: 'Hành động'
                },
                body: {
                    emptyDataSourceMessage: 'Không có học phí phát sinh',
                    filterRow: {
                        filterTooltip: 'Filter'
                    }
                }
            }}
            columns={[
                { title: 'Tháng', field: 'month',headerStyle: { fontWeight: '600', }, },
                { title: 'Ngày', field: 'time' ,headerStyle: { fontWeight: '600', }, },
                { title: 'Nội dung', field: 'content' ,headerStyle: { fontWeight: '600', },},
                { title: 'Lớp', field: 'cname', headerStyle: { fontWeight: '600', },},
                { title: 'Số tiền', 
                    field: 'amount', type: 'currency', currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0}, 
                    headerStyle: {
                        fontWeight: '600',
                        textAlign: 'right'
                    },
                    cellStyle:{
                        paddingRight: '34px',
                    }
                },
            ]}
            parentChildData={(row, rows) => rows.find(a => a.id === row.parent_id)}
            options={{
                selection: true,
                exportButton: true,
                pageSize: 20,
                selectionProps: rowData => ({
                    disabled: rowData.id === -9999,
                    color: 'primary'
                }),
                rowStyle: rowData => {
                    if(rowData.amount < 0){
                        return { backgroundColor: colors.orange[100], }
                    }
                    if(rowData.id == -9999){
                        return { boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset'}
                    }                                    
                },                                
            }}  
            actions={[
                {                                  
                    icon: () => (<span className="thu-hoc-phi">Thu học phí</span>),
                    onClick: (evt, data) => props.submitFeeGather(data)
                },
                {                                  
                    icon: () => (show_all) ? (<DoneIcon/>) : (<DoneAllIcon/>),
                    tooltip: 'Xem toàn bộ lịch sử giao dịch',
                    isFreeAction: true,
                    text: 'Xem toàn bộ',
                    onClick: (evt) => {setAll(!show_all)},
                },
            ]}
        />
    )

})

// const studentInfo =
class Fee extends React.Component{
    constructor(props){
        super(props)

        this.state = {           
            student_id: '',
            student_name: '',
            student_dob: new Date(),
            student_school: '',
            student_grade: '',
            student_gender: 'Khác',
            student_email: '',
            student_phone: '',
            student_changed: false,

            parent_id: '',
            parent_name: '',
            parent_alt_name: '',
            parent_email: '',
            parent_alt_email: '',
            parent_phone: '',
            parent_alt_phone: '',
            parent_note: '',            
            selected_relationship: '',
            parent_changed: false,
            reload: false,
            selected_fee: [],
            selected_amount: 0,
            center: [],
            name: '',
            account:[],
        }
    }
    handleClassChange = (newValue , event) => {
        if(this.state.selected_class != newValue){
            this.setState({selected_session: []})
            this.setState({
                selected_class : (newValue)?newValue:[],                
            })
        }       
        
    }    
    handleStudentChange = (newValue) => {
        this.setState({            
            student_name: {__isNew__: false, value: newValue.value, label: newValue.label},
            student_id: newValue.sid,
            student_dob: new Date(newValue.dob),
            student_school: {label: newValue.school, value: newValue.school},
            student_email: newValue.s_email,
            student_phone: newValue.s_phone,
            student_gender: newValue.gender,
            student_grade: newValue.grade,

            parent_name: newValue.p_name,
            parent_phone: {__isNew__: false, value: newValue.pid, label: newValue.p_phone}, 
            parent_email: newValue.p_email,
            parent_alt_name: newValue.alt_fullname,
            parent_alt_email: newValue.alt_email,
            parent_alt_phone: newValue.alt_phone,
            parent_id: newValue.pid,

            selected_relationship: {color: newValue.color, label: newValue.r_name, value: newValue.r_id},
            parent_note : (newValue.note)?newValue.note:'',
            open: false,
        })         
    }
    handleParentChange = (newValue) => {
        // console.log(newValue)
        this.setState({
            parent_name: newValue.fullname,
            parent_phone: {__isNew__: false, value: newValue.pid, label: newValue.phone},
            parent_email: newValue.email,
            parent_alt_name: newValue.alt_fullname,
            parent_alt_email: newValue.alt_email,
            parent_alt_phone: newValue.alt_phone,
            parent_id: newValue.pid,
            selected_relationship: {color: newValue.color, label: newValue.r_name, value: newValue.rid},
            parent_note : (newValue.note)?newValue.note:'',
        }) 
    }
    onChange = e => {      
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    handleDateChange = date => {
        this.setState({ student_dob: date, student_changed: true });
    };
    handleChange = (newValue , event)=> {
        this.setState({            
            [event.name]: newValue
        })    
    };
    handleCenterChange = (event) => {
        this.setState({ center: event.target.value })
    }
    handleAccountChange = (event) => {
        this.setState({ account : event.target.value })
    }
    handleGetFee = () => {
        this.setState({reload : !this.state.reload})
    }
    submitFeeGather = (data) => {
        this.setState({
            open: true,
            selected_fee: data,
            selected_amount : data.filter( t => {
                if(t.id < 0 && t.id != -9999){
                    return t.amount
                }} ).map(x => x.amount).reduce((acc, tr) => acc + parseInt(tr), 0)
        })
    }
    handleClose = () => {
        this.setState({open: false})
    }
    handleReceiptCreate = () => {
        axios.post(baseUrl + '/fee/gather', {
            transactions: this.state.selected_fee,
            center: this.state.center,
            name: this.state.name,
            account: this.state.account, student: {id: this.state.student_id, name: this.state.student_name}
        })
            .then(repsonse => {
                this.setState({open: false})
                this.props.enqueueSnackbar('Đã thu học phí', {variant: 'success'})
                setTimeout(this.props.history.push('/receipt'), 1000)
            })
    }
    render(){
        return(
            <React.Fragment>
                <Paper className="form-fee form-index">
                    <Grid container spacing={1} className="select-session">
                        <Grid item lg={5} sm={12} xs={12}>
                            <StudentSearch
                                student_name={this.state.student_name}
                                handleStudentChange={this.handleStudentChange}
                            />
                        </Grid>
                        <Grid item lg={5} sm={12} xs={12}>
                            <ParentSearch
                                parent_name = {this.state.parent_name}
                                handleParentChange = {this.handleParentChange}
                            />
                        </Grid>
                        <Grid item lg={2} sm={12} xs={12}>
                            <Button variant="contained" color="primary" fullWidth onClick = {this.handleGetFee}>
                                Kiểm tra
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider/>                
                </Paper>
                <Paper className="form-fee">
                    <Grid container spacing={1}>                        
                        <Grid item lg={12} sm={12} xs={12}>
                            <ListFee
                                submitFeeGather = {this.submitFeeGather}
                                student_id = {this.state.student_id}
                                reload = {this.state.reload}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-fee" fullWidth maxWidth="md" className="receipt-dialog">
                    <DialogTitle id="form-dialog-title">Tạo phiếu thu</DialogTitle>
                    <DialogContent>
                    
                        <CenterSelect 
                            receipt_center = {this.state.center}
                            handleChange={this.handleCenterChange}
                        />
                        <NameText 
                            name =  {this.state.name}
                            onChange = {this.onChange}
                        />
                        <AccountSelect 
                            account = {this.state.account}
                            handleChange={this.handleAccountChange}
                        />
                        <TextField
                            fullWidth
                            value={this.state.selected_amount}
                            name = "amount"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={this.handleReceiptCreate} color="primary">
                        Tạo phiếu thu
                    </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            
        )
    }
}
export default withSnackbar(Fee);
