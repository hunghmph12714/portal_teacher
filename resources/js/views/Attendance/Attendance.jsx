import React , {useState, useEffect} from 'react'
import './Attendance.scss'
import axios from 'axios'
import { withSnackbar } from 'notistack';
import Select , { components }  from "react-select";
import Divider from '@material-ui/core/Divider';
import { format } from 'date-fns'
import {
    Tooltip,
  } from "@material-ui/core";
import { Grid } from '@material-ui/core';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import 'react-notifications-component/dist/theme.css'
import Chip from '@material-ui/core/Chip';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';

const baseUrl = window.Laravel.baseUrl;
const customChip = (color = '#ccc') => ({
  border: '1px solid ' + color,
  color: '#000',
  fontSize: '12px',
})
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const ClassSelect = React.memo(props => {
    const {center, course} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            setClasses(r.data.map(c => {
                    // console.log(c)
                    return {label: c.code + ' - ' +c.name, value: c.id}
                })
            )
        }
        fetchData()
    }, [])
    
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
    useEffect(() => {
        if(!props.selected_session || props.selected_session.length == 0){
           setSessions(tmp_sessions)
        }else{
            setSessions(sessions.filter(s => s.date == props.selected_session[0].date))
        }        
    }, [props.selected_session])
    return( 
        
        <div className = "select-input">
            <Select                
                key = "session-select"
                isMulti
                value = {props.selected_session}
                name = "selected_session"
                placeholder="Chọn Ca học"
                options={sessions}
                onChange={props.handleChange}
            />                 
        </div>
    )
})

class Attendance extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            data : [],
            selected_class : null,
            selected_session: [],
            open_attendance: false,
            selected_data : [],
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
        if(!newValue){ this.setState({data: []}) }
        if(this.state.selected_session != newValue){
            this.setState({
                selected_session: (newValue) ? newValue:[],
            })
            axios.post(baseUrl+'/attendance/get', {class_id: this.state.selected_class.value, sessions: newValue})
                .then(response=> {
                    this.setState({data: response.data})
                })
                .catch(err=> {
                    console.log(err)
                })
        }
    }
    handleChange = (newValue , event)=> {
        this.setState({
            [event.name]: newValue
        })    
    };
    handleOpenAttendance = (event, data) => {
        this.setState({open_attendance : true, selected_data: data})
    }
    handleCloseAttendance = ( ) => {
        this.setState({open_attendance: false, selected_data: []})
        axios.post('/attendance/get', {class_id: this.state.selected_class.value, sessions: this.state.selected_session})
            .then(response=> {
                this.setState({data: response.data})
            })
    }
    handleSubmitAttendance = () => {
        axios.post(baseUrl+'/attendance/edit', {attendance: this.state.selected_data})
            .then(response => {
                this.setState({open_attendance: false, selected_data: []})
            })
            .catch(err => {
            })
    }
    onAttendanceChange =  (type, s_id) => {
        let t = ['present','late','absence','n_absence','holding']
        this.setState(prevState => {
            let selected_session = prevState.selected_session
            selected_session = selected_session.map(s => {
                if(s.value == s_id){
                    s.selected = (s.selected == type) ? -1 : type
                }
                return s
            })
            console.log(prevState.data)
            let selected_data = prevState.selected_data 
            selected_data = selected_data.map(d => {
                d.attendance = d.attendance.map(a => {
                    if(a.session_id == s_id){
                        a.attendance = t[type]
                    }
                    return a
                })
                return d
            })
            console.log(prevState.data)
            return {...prevState, selected_session, selected_data}
        })
        
    }
    onAttendanceStudentChange = (student_id, session_id, type) => {
        this.setState(prevState => {
            let selected_data = [...prevState.selected_data]
            selected_data = selected_data.map( d => {
                if(d.student.sid == student_id){
                    d.attendance = d.attendance.map(a => {
                        if(a.session_id == session_id){
                            a.attendance = type
                        }
                        return a
                    })
                }
                return d
            })
            return {...prevState, selected_data}
        })
    }
    onScoreStudentChange =  (student_id, session_id , e) =>{
        e.persist()
        this.setState(prevState => {
            let selected_data = [...prevState.selected_data]
            selected_data = selected_data.map( d => {
                if(d.student.sid == student_id){
                    d.attendance = d.attendance.map(a => {
                        if(a.session_id == session_id){
                            // console.log(session_id)
                            a.score = e.target.value
                        }
                        return a
                    })
                }
                return d
            })
            return {...prevState, selected_data}
        })
    }
    onBtvnScoreChange =  (student_id, session_id , e) =>{
        e.persist()
        this.setState(prevState => {
            let selected_data = [...prevState.selected_data]
            selected_data = selected_data.map( d => {
                if(d.student.sid == student_id){
                    d.attendance = d.attendance.map(a => {
                        if(a.session_id == session_id){
                            // console.log(session_id)
                            a.btvn_score = e.target.value
                        }
                        return a
                    })
                }
                return d
            })
            return {...prevState, selected_data}
        })
    }
    render(){
        return(
            <div className="root-attendance">
                <Grid container spacing={1} className="select-session">
                    <Grid item lg={4} sm={12} xs={12}>
                        <ClassSelect 
                            selected_class = {this.state.selected_class}
                            handleChange={this.handleClassChange}
                            course = {-1}
                            center = {-1}
                        />
                    </Grid>
                    <Grid item lg={7} sm={12} xs={12}>
                        <SessionDateSelect 
                            selected_class = {this.state.selected_class}
                            selected_session = {this.state.selected_session}
                            handleChange={this.handleSessionChange}                        
                        />
                    </Grid>
                </Grid>
                <Divider/>
                {this.state.selected_session.length != 0 ? (
                <MaterialTable
                    title="Danh sách học sinh"
                    data={this.state.data}
                    options={{
                        pageSize: 10,
                        selection: true,
                        exportButton: true,
                        rowStyle: rowData => {},
                        filterCellStyle: {
                          paddingLeft: '0px'
                        }
                    }}
                    onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                    actions={[                       
                        {
                            icon: () => <AccessibilityNewIcon />,
                            tooltip: 'Điểm danh học sinh',
                            text: 'Điểm danh',
                            onClick: (event,data) => this.handleOpenAttendance(event,data),
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Lớp học rỗng'
                        },
                        toolbar: {
                            searchTooltip: 'Tìm kiếm',
                            searchPlaceholder: 'Tìm kiếm',
                            nRowsSelected: '{0} học sinh được chọn'
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
                    columns={[
                    //   {
                    //     title: "",
                    //     field: "action",
                    //     filtering: false,
                    //     disableClick: true,
                    //     sorting: false,
                    //     headerStyle: {
                    //         padding: '0px',
                    //         width: '90px',
                    //     },
                    //     cellStyle: {
                    //         width: '90px',
                    //         padding: '0px',
                    //     },
                    //     render: rowData => (
                    //         <div style = {{display: 'block'}}>
                    //             {/* {rowData.tableData.id} */}
                    //             <Tooltip title="Chỉnh sửa" arrow>
                    //               <IconButton onClick={() => {this.handleOpenEditDialog(rowData)}}>
                    //                 <EditOutlinedIcon fontSize='inherit' />
                    //               </IconButton>
                    //             </Tooltip>
                    //             <Tooltip title="Xóa ghi danh" arrow>
                    //               <IconButton onClick={() => {
                    //                 if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                    //                   this.handleDeactivateClass(rowData.id, rowData.tableData.id)}
                    //                 }>
                    //               <DeleteForeverIcon fontSize='inherit' />
                    //               </IconButton>
                    //             </Tooltip>                                
                    //         </div>
                    //     )
                    //   },

                    //Học sinh
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
                                <b>{rowData.student.sname}</b>
                                <br /> {rowData.student.dob}
                            </Typography>
                            
                          )
                        }
                      },
                    //Phụ huynh
                      {
                        title: "Phụ huynh",
                        field: "pname",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '3px 0px',
                        },
                        render: rowData => 
                          (                              
                            <Typography variant="body2" component="p">
                                <b>{rowData.student.pname}</b> 
                                <br />{rowData.student.phone} 
                                <br />{rowData.student.pemail}
                            </Typography>                              
                          )

                      },
                    //Quan hệ
                    {
                        title: "Quan hệ",
                        field: "rname",
                        headerStyle: {
                            padding: '0px',
                            width: '120px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                            width: '120px',
                        },
                        render: rowData => {
                          return (                              
                            <Chip style={customChip(rowData.student.color)} variant="outlined" label={rowData.student.rname} size="small" />                         
                          )
                        }               
                    },
                    //Điểm danh
                      {
                        title: "Điểm danh",
                        field: "attendance",         
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },  
                        cellStyle: {
                            padding: '0px 8px 0px 0px',
                        },
                        render: rowData => {
                          return rowData.attendance.map(a => {
                            return (
                                <Tooltip title={a.session_id}>
                                    <Chip variant="outlined" label={a.attendance} size="small"  className="attendance" />
                                </Tooltip> 
                            )
                          })                          
                        }
                      },
                    // Ghi chú
                      {
                          title: "Ghi chú",
                          field: "note",
                          headerStyle: {
                              padding: '0px',
                              fontWeight: '600',
                          },
                          cellStyle: {
                              padding: '0px',
                          },
                          render: rowData => {
                            return rowData.attendance.map(a => {
                              return (
                                  <Tooltip title={a.session_id}>
                                    <span>{a.attendance_note}</span>    
                                  </Tooltip> 
                              )
                            })                          
                          }
                      },                  
                    //Điểm 
                    {
                        title: "Điểm",
                        field: "score",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },  
                        render: rowData => {
                            return rowData.attendance.map(a => {
                                return (
                                    <Tooltip title={a.session_id}>
                                        <span>{a.score}</span>  
                                    </Tooltip> 
                                )
                            })                          
                        }                          
                    },
                    
                    ]}
                />
                ) : ('')}
                {this.state.selected_session ? (
                    <Dialog 
                        open={this.state.open_attendance} onClose={this.handleCloseAttendance} aria-labelledby="form-dialog-title"
                        fullWidth
                        maxWidth='xl'>
                    <DialogTitle id="form-dialog-title">Điểm danh học sinh</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        <Table className='' aria-label="simple table"  size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Học sinh</TableCell>
                                    <TableCell align="center">
                                        Có mặt<br/>
                                        {
                                            this.state.selected_session.map(s => {
                                                return (
                                                    <Tooltip title={s.label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceChange(0, s.value)} checked={s.selected==0}/>
                                                    </Tooltip>
                                                )
                                            })
                                        }
                                    </TableCell>
                                    <TableCell align="center">Muộn<br/>
                                        {
                                            this.state.selected_session.map(s => {
                                                return (
                                                    <Tooltip title={s.label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceChange(1, s.value)} checked={s.selected==1}/>
                                                    </Tooltip>
                                                )
                                            })
                                        }

                                    </TableCell>
                                    <TableCell align="center">Có phép<br/>
                                        {
                                            this.state.selected_session.map(s => {
                                                return (
                                                    <Tooltip title={s.label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceChange(2, s.value)} checked={s.selected==2}/>
                                                    </Tooltip>
                                                )
                                            })
                                        }</TableCell>
                                    <TableCell align="center">Không phép<br/>
                                        {
                                            this.state.selected_session.map(s => {
                                                return (
                                                    <Tooltip title={s.label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceChange(3, s.value)} checked={s.selected==3}/>
                                                    </Tooltip>
                                                )
                                            })
                                        }</TableCell>
                                    <TableCell align="center">Chưa điểm danh<br/>
                                        {
                                            this.state.selected_session.map(s => {
                                                return (
                                                    <Tooltip title={s.label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceChange(4, s.value)} checked={s.selected==4}/>
                                                    </Tooltip>
                                                )
                                            })
                                        }</TableCell>
                                    <TableCell align="center">Bài tập trên lớp<br/>
                                        {
                                            this.state.selected_session.map(s => {
                                                return (
                                                    <Tooltip title={s.label} arrow>                                                       
                                                        <TextField
                                                            className="score_input"
                                                            placeholder="Tổng điểm"
                                                            name="max_score"                                                          
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => this.onScoreStudentChange(row.student.sid, s.session_id, e)}
                                                        />
                                                    </Tooltip>  
                                                )
                                            })
                                        }
                                    </TableCell>
                                    <TableCell align="center">Bài tập về nhà<br/>
                                        {
                                            this.state.selected_session.map(s => {
                                                return (
                                                    <Tooltip title={s.label} arrow>                                                       
                                                        <TextField
                                                            className="score_input"
                                                            placeholder="Tổng điểm"
                                                            name="max_score"                                                          
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => this.onScoreStudentChange(row.student.sid, s.session_id, e)}
                                                        />
                                                    </Tooltip>  
                                                )
                                            })
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {this.state.selected_data.map((row, index) => (
                                <TableRow key={row.key}>
                                    <TableCell component="th" scope="row">
                                        {index+1}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" component="p">                                    
                                            <b>{row.student.sname}</b>
                                            <br /> {row.student.dob}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                // console.log(session_info)
                                                return (
                                                    
                                                    <Tooltip title={session_info[0].label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceStudentChange(row.student.sid, s.session_id, 'present')} 
                                                        checked={s.attendance=='present'}/>
                                                    </Tooltip>
                                                    
                                                )
                                            })
                                        }
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                // console.log(session_info)
                                                return (
                                                    
                                                    <Tooltip title={session_info[0].label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceStudentChange(row.student.sid, s.session_id, 'late')} 
                                                        checked={s.attendance=='late'}/>
                                                    </Tooltip>                                                    
                                                )
                                                
                                            })
                                        }
                                        
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                // console.log(session_info)
                                                return (
                                                    
                                                    <Tooltip title={session_info[0].label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceStudentChange(row.student.sid, s.session_id, 'absence')} 
                                                        checked={s.attendance=='absence'}/>
                                                    </Tooltip>                                                    
                                                )
                                            })
                                        }
                                        
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                // console.log(session_info)
                                                return (
                                                    
                                                    <Tooltip title={session_info[0].label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceStudentChange(row.student.sid, s.session_id, 'n_absence')} 
                                                        checked={s.attendance=='n_absence'}/>
                                                    </Tooltip>                                                    
                                                )
                                            })
                                        }
                                        
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                // console.log(session_info)
                                                return (
                                                    
                                                    <Tooltip title={session_info[0].label} arrow>
                                                        <Checkbox onChange={() => this.onAttendanceStudentChange(row.student.sid, s.session_id, 'holding')} 
                                                        checked={s.attendance=='holding'}/>
                                                    </Tooltip>                                                    
                                                )
                                            })
                                        }                                        
                                    </TableCell> 
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                return (
                                                    <Tooltip title={session_info[0].label} arrow>                                                       
                                                        <TextField
                                                            className="score_input"
                                                            value={s.score}
                                                            name = {'score_'+s.session_id} 
                                                            key = {'score_'+s.session_id} 
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => this.onScoreStudentChange(row.student.sid, s.session_id, e)}
                                                        />
                                                    </Tooltip>                                                    
                                                )
                                            })
                                        }                                        
                                    </TableCell> 
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                return (
                                                    <Tooltip title={session_info[0].label} arrow>                                                       
                                                        <TextField
                                                            className="score_input"
                                                            value={s.btvn_score}
                                                            name = {'btvn_score'+s.session_id} 
                                                            key = {'btvn_score'+s.session_id} 
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => this.onBtvnScoreChange(row.student.sid, s.session_id, e)}
                                                        />
                                                    </Tooltip>                                                    
                                                )
                                            })
                                        }                                        
                                    </TableCell> 
                                    <TableCell align="center">
                                        {
                                            row.attendance.map(s => {
                                                let session_info = this.state.selected_session.filter(ss=>ss.value == s.session_id)
                                                return (
                                                    <Tooltip title={session_info[0].label} arrow>                                                       
                                                        <TextField
                                                            className="btvn_complete"
                                                            value={s.btvn_complete}
                                                            name = {'btvn_complete'+s.session_id} 
                                                            key = {'btvn_complete'+s.session_id} 
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => this.onBtvnCompleteChange(row.student.sid, s.session_id, e)}
                                                        />
                                                    </Tooltip>                                                    
                                                )
                                            })
                                        }                                        
                                    </TableCell> 
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </DialogContentText>
                    
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleCloseAttendance} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={this.handleSubmitAttendance} color="primary">
                        Lưu
                    </Button>
                    </DialogActions>
                </Dialog>
            
                ): ('')}
                
            </div>
        )
    }
}
export default withSnackbar(Attendance);
