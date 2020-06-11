import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Transaction.scss'
import { Grid, TextField, FormLabel, Paper   } from '@material-ui/core';
import { AccountSearch, TransactionForm } from './components';
import { withSnackbar } from 'notistack'
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import NumberFormat from 'react-number-format';
import { format } from 'date-fns'
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
const ClassSelect = React.memo(props => {
    const {center, course, student} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            var r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            if(student){
                r = await axios.post(baseUrl + '/class/student', {'student_id': student.value})
            }
            setClasses(r.data.map(c => {
                return {label: c.code + ' - ' +c.name, value: c.id}
            }))        
            
        }
        fetchData()
    }, [student])
    
    return( 
        <Select
            key = "class-select"
            value = {props.selected_class}
            name = "selected_class"
            placeholder="Chọn lớp"
            isClearable
            options={classes}
            onChange={props.handleChange}
        />)
})
const SessionDateSelect = React.memo(props => {
    const {selected_class} = props
    const Vndate = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const [sessions, setSessions] = useState([])
    const [tmp_sessions, setTmpSession] = useState([])
    const fetchData = async() => {
        const r = await axios.post(baseUrl + '/session/get', {class_id: selected_class.value, from_date: -1, to_date: -1})
        let data = r.data.map(c => {
            let date = new Date(c.date)
            c.date = format(date , 'd/M/yyyy')
            c.day = format(date, 'i') 
            c.from = format(new Date(c.from), 'HH:mm')
            c.to = format(new Date(c.to), 'HH:mm')
            c.time = c.from + '-' + c.to
            return {label: Vndate[c.day]+ ': '+c.date+' ('+c.time+' )', value: c.sid, date : c.date, time: c.from, selected: -1}
        })
        setSessions(data)
        setTmpSession(data)
    }
    useEffect(() => {        
        if(selected_class){
            fetchData()            
        }
    }, [props.selected_class])
    
    return( 
        <div className = "select-input">
            <Select                
                key = "session-select"                
                value = {props.selected_session}
                name = "selected_session"
                placeholder="Chọn Ca học"
                options={sessions}
                onChange={props.handleChange}
            />                 
        </div>
    )
})
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
                        this.props.history.push('/entrance/create')
                    },
                },
            ]}
            icon={{
                Filter: () => <div />
            }}
            localization={{
                body: {
                    emptyDataSourceMessage: 'Không tìm thấy giao dịch hoặc sever gặp lỗi'
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
            debit: [],
            credit: [],
            time: new Date(),
            student : null,
            amount :'',
            content:'',
            selected_class: [],
            selected_session: null,
            tags: [],
            reload: false,
        }
    }
    
    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleDebitChange = (newValue) => {
        this.setState({ debit: newValue })
    }
    handleCreditChange = (newValue) => {
        this.setState({ credit: newValue })
    }
    handleDateChange = date => {
        this.setState({ time: date });
    };
    handleStudentChange = (newValue) => {
        if(!newValue || newValue.__isNew__){
            this.setState({
                student: newValue
            }) 
        }
        else{
            this.setState({
                student: {__isNew__: false, value: newValue.value, label: newValue.label},                
            }) 
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
    handleSessionChange = (newValue) => {
        if(this.state.selected_session != newValue){
            this.setState({
                selected_session: (newValue) ? newValue:[],
            })            
        }
    } 
    handleTagChange = (newValue) => {
        this.setState({tags: newValue});
    }
    onSubmitTransaction = (event) => {
        event.preventDefault()
        let data = this.state
        data.time = data.time.getTime()/1000
        this.setState({time: new Date(data.time*1000)})
        axios.post(baseUrl + '/transaction/add', this.state)
            .then(response => {
                this.setState({ reload: !this.state.reload })
                this.props.enqueueSnackbar('Tạo giao dịch thành công!', {
                    variant: 'success'
                })
                
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra !', {
                    variant: 'error'
                })
            })
    }
    render(){
        return(
            <React.Fragment>
                <div className="root-transaction">
                    <TransactionForm
                        debit = {this.state.debit}
                        credit = {this.state.credit}
                        time = {this.state.time}
                        student = {this.state.student}
                        amount = {this.state.amount}
                        content = {this.state.content}
                        selected_class = {this.state.selected_class}
                        selected_session = {this.state.selected_session}
                        tags = {this.state.tags}

                        onChange = { this.onChange }
                        handleDateChange = {this.handleDateChange}
                        handleDebitChange = { this.handleDebitChange }
                        handleCreditChange = {this.handleCreditChange}
                        handleDateChange = {this.handleDateChange}
                        handleStudentChange = {this.handleStudentChange}
                        handleClassChange = {this.handleClassChange}
                        handleSessionChange = {this.handleSessionChange}
                        handleTagChange = {this.handleTagChange}
                        submitButton = {true}
                        onSubmitTransaction = {this.onSubmitTransaction}                   
                    />
                </div>
                <TransactionView
                    reload = {this.state.reload}
                />
            </React.Fragment>
        )
    }
}
export default withSnackbar(Transaction)