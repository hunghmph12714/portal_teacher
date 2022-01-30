import React , {useState, useEffect} from 'react'
import { StudentSearch, ParentSearch } from '../../components'
import './Fee.scss'
import axios from 'axios'
import {
    Tooltip,IconButton
  } from "@material-ui/core";
import { withSnackbar, useSnackbar } from 'notistack';
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
import ReactTooltip from 'react-tooltip';
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
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import MathJax from 'react-mathjax'

// import {CKEditor} from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5-classic-with-mathtype';
import vi from "date-fns/locale/vi";
const baseUrl = window.Laravel.baseUrl
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
    DatePicker,
} from "@material-ui/pickers";
import { flatMap } from 'lodash';
const tex = `f(x) = \\int_{-\\infty}^\\infty
    \\hat f(\\xi)\\,e^{2 \\pi i \\xi x}
    \\,d\\xi`
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
        <FormControl variant="outlined" size="small" className="select-box" fullWidth>
            <InputLabel>Cơ sở</InputLabel>
            <Select className = "select-box-margin"
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
            <Select className = "select-box-margin"
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
            className="select-box-margin"
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
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [show_all, setAll] = useState(true)
    const [columns, setCol] = useState([
        { title: 'Tháng', field: 'month',headerStyle: { fontWeight: '600', }, },
        { title: 'Ngày', field: 'time' ,headerStyle: { fontWeight: '600', }, },
        { title: 'Nội dung', field: 'content' ,headerStyle: { fontWeight: '600', }, 
            render: rowData => {
                var detail = rowData.detail.split('+')
                // console.log(detail)
                return (      
                    <div>
                        <a data-tip data-for={rowData.content + rowData.cname}> {rowData.content} </a>
                        <ReactTooltip id={rowData.content + rowData.cname} aria-haspopup='true' >
                            {detail.map(d => {
                                return(
                                    <span>{d} <br/></span>
                                )
                            })}
                        </ReactTooltip>
                    </div>                         
                                                 
                )
            },
        },
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
    ])
    useEffect(() => {
        const fetchdata = async() => {
            let sum = 0;
            const r  = await axios.post(baseUrl + '/fee/get', {students: props.students, show_all: show_all, from: props.from, to: props.to})
            let data = r.data
            sum = data.filter( t => {
                if(t.id < 0 && t.id != -9999){
                    return t.amount
                }} ).map(x => x.amount).reduce((acc, tr) => acc + parseInt(tr), 0)
            data.push({month: '', time: '', content:'Tổng', cname: '', amount: sum, id: -9999, detail: ''})
            
            // console.log(data)
            setFee(data)
        }
        fetchdata()
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
            columns= {columns}
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
            onSelectionChange={(rows) => {
                let s = 0
                
                rows.map(r => {
                    if(r.id > 0){
                        s += r.amount;
                    }
                })
                // s = s/2
                let format_sum = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s)
                const x = enqueueSnackbar('Tổng số tiền đã chọn: ' + format_sum, {
                    'variant': 'success', 
                    preventDuplicate: true,
                    persist: true,
                })
                if(rows.length == 0){
                    closeSnackbar(x)
                }
            }}
            actions={[
                
                {                                  
                    icon: () => (
                        <div style = {{display: 'block'}}>
                            {   (props.loading_email) ? (
                                    <CircularProgress/>
                                ):(
                                    <Tooltip title={
                                        (props.student_email_note) ? props.student_email_note.sent_user + ' đã gửi lúc ' + 
                                        format(new Date(props.student_email_note.sent_time*1000), 'd/M/yyyy') : ''
                                    } arrow>                                                
                                        <IconButton>                                                    
                                            <MailOutlineIcon fontSize='inherit' />
                                        </IconButton>
                                    </Tooltip>
                                )
                            }                      
                        </div>
                    ),
                    onClick: (evt,data) => props.handleSendEmail(data)
                },
                {                                  
                    icon: () => (
                        <IconButton>                                                    
                            <PrintOutlinedIcon fontSize='inherit' />
                        </IconButton>
                    ),
                    onClick: (evt,data) => props.handlePrint(data)
                },
                {                                  
                    icon: () => (<span className="thu-hoc-phi">Thu học phí</span>),
                    isFreeAction: true,
                    onClick: (evt) => props.submitFeeGather(fees)
                },
                {                                  
                    icon: () => (show_all) ? (<DoneIcon/>) : (<DoneAllIcon/>),
                    tooltip: 'Xem toàn bộ lịch sử giao dịch',
                    isFreeAction: true,
                    text: 'Xem toàn bộ',
                    onClick: (evt) => {setAll(!show_all)},
                },
                {                                  
                    icon: () => <CachedIcon/>,
                    tooltip: 'Chuẩn hóa học phí',
                    isFreeAction: true,
                    text: 'Chuẩn hóa học phí',
                    onClick: (evt) => {props.normalize()},
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
            student_name: [],
            reload: false,
            selected_fee: [],
            selected_amount: 0,
            center: [],
            name: '',
            account:[],
            loading_email: false,
            students: [],
            from: null,
            to: null,
            description: '',
            preview: '',
            note: '', max_date: '', preview_open: false, tmp_data: null,
        }
        // axios.post('http://portal.vee.vn/api/user/login', {email: 'vee@v.vn', password:'123123'})
        //     .then(response => {
        //         axios.get('http://portal.vee.vn/api/user/all', {
        //             headers:{
        //                 'Authorization' : 'Bearer '+response.data.access_token
        //             }
        //         })
        //         .then(response => {
        //             console.log(response)
        //         })
        //     })
    }
    
    handleClassChange = (newValue , event) => {
        if(this.state.selected_class != newValue){
            this.setState({selected_session: []})
            this.setState({
                selected_class : (newValue)?newValue:[],                
            })
        }       
        
    }    
    handleStudentsChange = (newValue) => {
        if(newValue){
            this.setState({student_name: newValue})
        }       
        else  this.setState({student_name: []})
    }
    onChange = e => {      
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    handleFromChange = date => {
        this.setState({ from: date });
    };
    handleToChange = date => {
        this.setState({ to: date });
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
    
    handlePreviewEmail = (data) => {
        // evt.preventDefault()
        if(this.state.student_name.length > 1){
            this.props.enqueueSnackbar('Chỉ có thể gửi học phí của 1 học sinh cùng lúc',  {variant: 'warning'})
        }else{
            if(this.state.from && this.state.to ){
                axios.post(baseUrl + '/fee/send-email',{data:data, student_id: this.state.student_name[0].sid, from: this.state.from, to: this.state.to, preview: !this.state.preview_open})
                .then(response => {
                    // this.props.enqueueSnackbar('Đã gửi email cho phụ huynh. Vui lòng kiểm tra hộp thư đã gửi' , {variant: 'success'})
                    // this.setState({loading_email: false})
                    var date = new Date(this.state.from);
                    var today = new Date();
                    var max_date = new Date(date.getFullYear(), date.getMonth(), 10);
                   
                    if(today > max_date){
                        max_date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+2);
                    }else {max_date = new Date(max_date.getFullYear(), max_date.getMonth(), max_date.getDate())
                    console.log(max_date)
                    };
                    this.setState({
                        preview: response.data,
                        preview_open: true,
                        max_date: max_date.getDate() + "/"+ (max_date.getMonth()+1) +"/" + max_date.getFullYear(),
                        tmp_data: data
                    })
                })
                .catch(err => {})
            }
            else{
                this.props.enqueueSnackbar('Vui lòng chọn kỳ học phí', {variant: 'warning'})
            }
            
        }        
    }
    handleSendEmail = () => {
        this.setState({preview_open: false})
        axios.post(baseUrl + '/fee/send-email',{data:this.state.tmp_data, student_id: this.state.student_name[0].sid, 
            from: this.state.from, to: this.state.to, preview: false, max_date: this.state.max_date, note: this.state.note})
        .then(response => {
            this.props.enqueueSnackbar('Đã gửi email cho phụ huynh. Vui lòng kiểm tra hộp thư đã gửi' , {variant: 'success'})
            // this.setState({loading_email: false})            
            this.handlePreviewClose()
        })
        .catch(err => {})
    }
    handlePreviewClose= () => {
        this.setState({
            preview_open: false,
            preview: '',
            tmp_data: null,

        })
    }
    handlePrint = (data) => {
        if(this.state.student_name.length > 1){
            this.props.enqueueSnackbar('Chỉ có thể in học phí của 1 học sinh cùng lúc',  {variant: 'warning'})
        }else{
            if(this.state.from && this.state.to ){
                axios.post(baseUrl + '/fee/print', {data:data, student_id: this.state.student_name[0].sid, from: this.state.from, to: this.state.to})
                .then(response => {                
                    let newWin = window.open("In học phí", "", "width=1000,height=900");
                    newWin.document.write((response.data));
                })
                .catch(err => {})
            }
            else{
                this.props.enqueueSnackbar('Vui lòng chọn kỳ học phí', {variant: 'warning'})
            }
        }
        
    }
    submitFeeGather = (data) => {
        let student_name = this.state.student_name.map(s => s.s_name).toString();
        this.setState({
            open: true,
            description: 'Thu học phí ' + student_name,     
            name: student_name,
            selected_amount : data.filter( t => {
                if(t.id > 0){
                    return t.amount
                }} ).map(x => x.amount).reduce((acc, tr) => acc + parseInt(tr), 0)
        })
    }
    handleClose = () => {
        this.setState({open: false})
    }
    handleReceiptCreate = () => {
        if(this.state.selected_amount > 0){
            axios.post(baseUrl + '/fee/gather', {
                center: this.state.center,
                name: this.state.name,
                account: this.state.account, student: {id: this.state.student_id, name: this.state.student_name},
                total_amount: this.state.selected_amount,
                students: this.state.student_name,
                description: this.state.description
            })
                .then(repsonse => {
                    this.setState({open: false})
                    this.props.enqueueSnackbar('Đã thu học phí', {variant: 'success'})
                    setTimeout(this.props.history.push('/receipt'), 1000)
                })
                .catch(err => {
                    this.props.enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', {variant: 'error'})
                })
        }
        else{
            this.props.enqueueSnackbar('Số tiền thu không thể âm, vui lòng kiểm tra lại', {variant: 'error'})
        }
    }
    normalize = () => {
        if(this.state.student_name.length > 1){
            this.props.enqueueSnackbar('Không thể chuẩn hoá nhiều hơn 1 học sinh')
        }else{
            axios.post(baseUrl + '/fee/normalize', {student_ids: this.state.student_name})
            .then(response => {
                this.setState({reload : !this.state.reload})
            })
        }
        
    }
    
    render(){
        document.title = "Học phí"
        return(
            <div>
                
                <Paper className="form-fee form-index">
                    <Grid container spacing={1} className="select-session">
                        <Grid item lg={6} sm={12} xs={12}>
                            <StudentSearch
                                isMulti
                                student_name={this.state.student_name}
                                handleStudentChange={this.handleStudentsChange}
                            />
                        </Grid>
                        <Grid item lg={2} sm={12} xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>                                 
                                <DatePicker
                                    variant="inline"
                                    inputVariant="outlined"
                                    openTo="month"
                                    views={["year", "month"]}
                                    label="Từ tháng"
                                    value={this.state.from}
                                    format="MM/yyyy"    
                                    fullWidth
                                    size="small"
                                    onChange={this.handleFromChange}
                                />                  
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item lg={2} sm={12} xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>                                 
                                <DatePicker
                                    variant="inline"
                                    inputVariant="outlined"
                                    openTo="month"
                                    views={["year", "month"]}
                                    label="Đến tháng"
                                    value={this.state.to}
                                    format="MM/yyyy"    
                                    fullWidth
                                    size="small"
                                    onChange={this.handleToChange}
                                />                  
                            </MuiPickersUtilsProvider>
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
                                handleSendEmail = {this.handlePreviewEmail}
                                handlePrint = {this.handlePrint}
                                loading_email = {this.state.loading_email}
                                students = {this.state.student_name}
                                parent_id = {this.state.parent_id}
                                normalize = {this.normalize}
                                reload = {this.state.reload}
                                student_email_note = {this.state.fee_email_note}
                                from = {this.state.from} to = {this.state.to}
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
                            value={this.state.description}
                            name = "description"
                            variant="outlined"
                            size="small"
                            onChange = {this.onChange}
                            style = {{marginBottom: '14px'}}
                        />
                        <TextField
                            fullWidth
                            value={this.state.selected_amount}
                            name = "selected_amount"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                            }}
                            onChange = {this.onChange}
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={this.handleReceiptCreate} color="primary">
                        Thu học phí
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.preview_open} onClose={this.handlePreviewClose} aria-labelledby="form-dialog-preview" fullWidth maxWidth="md" className="preview-dialog">
                    <DialogTitle id="form-dialog-title">Xem trước</DialogTitle>
                    <DialogContent>
                        
                        <TextField
                            fullWidth
                            label="Ghi chú"
                            value={this.state.note}
                            name = "note"
                            variant="outlined"
                            size="small"
                            onChange = {this.onChange}
                            style = {{marginBottom: '15px'}}
                        />
                        <TextField
                            fullWidth
                            value={this.state.max_date}
                            name = "max_date"
                            label="Hạn nộp học phí"
                            variant="outlined"
                            size="small"
                            placeholder= "Hạn nộp học phí"
                            onChange = {this.onChange}
                            style = {{marginBottom: '15px'}}
                        />
                        <iframe srcDoc={this.state.preview} width="900" height="600"></iframe>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handlePreviewClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={this.handleSendEmail} color="primary">
                        Gửi
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
            
        )
    }
}
export default withSnackbar(Fee);
