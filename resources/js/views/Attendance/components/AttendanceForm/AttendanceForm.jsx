import React from 'react'
import './AttendanceForm.scss'
import axios from 'axios'
import { withSnackbar } from 'notistack';
import Select , { components }  from "react-select";
import Divider from '@material-ui/core/Divider';
import { format } from 'date-fns'
import { Grid } from '@material-ui/core';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import 'react-notifications-component/dist/theme.css'
import Chip from '@material-ui/core/Chip';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';import {
    Tooltip,
  } from "@material-ui/core";
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
class AttendanceForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return (
            <Dialog 
                open={this.props.open_attendance} onClose={this.props.handleCloseAttendance} aria-labelledby="form-dialog-title"
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
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceChange(0, s.value)} checked={s.selected==0}/>
                                            </Tooltip>
                                        )
                                    })
                                }
                            </TableCell>
                            <TableCell align="center">Muộn<br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceChange(1, s.value)} checked={s.selected==1}/>
                                            </Tooltip>
                                        )
                                    })
                                }

                            </TableCell>
                            <TableCell align="center">Có phép<br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceChange(2, s.value)} checked={s.selected==2}/>
                                            </Tooltip>
                                        )
                                    })
                                }</TableCell>
                            <TableCell align="center">Không phép<br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceChange(3, s.value)} checked={s.selected==3}/>
                                            </Tooltip>
                                        )
                                    })
                                }</TableCell>
                            <TableCell align="center">Chưa điểm danh<br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceChange(4, s.value)} checked={s.selected==4}/>
                                            </Tooltip>
                                        )
                                    })
                                }
                            </TableCell>
                            <TableCell align="center" className="note-head">
                                Ghi chú điểm danh <br/> (Lý do nghỉ - Thời gian đi muộn)                               
                            </TableCell>
                            {/* <TableCell align="center">Bài tập trên lớp<br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>                                                       
                                                <TextField
                                                    className="score_input"
                                                    placeholder="Tổng điểm"
                                                    name="max_score"                                                          
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => this.props.onScoreStudentChange(row.student.sid, s.session_id, e)}
                                                />
                                            </Tooltip>  
                                        )
                                    })
                                }
                            </TableCell>
                            <TableCell align="center">Bài tập về nhà<br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>                                                       
                                                <TextField
                                                    className="score_input"
                                                    placeholder="Tổng điểm"
                                                    name="max_score"                                                          
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => this.props.onScoreStudentChange(row.student.sid, s.session_id, e)}
                                                />
                                            </Tooltip>  
                                        )
                                    })
                                }
                            </TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.selected_data.map((row, index) => (
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
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        // console.log(session_info)
                                        return (
                                            
                                            <Tooltip title={session_info[0].label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceStudentChange(row.student.sid, s.session_id, 'present')} 
                                                checked={s.attendance=='present'}/>
                                            </Tooltip>
                                            
                                        )
                                    })
                                }
                            </TableCell>
                            <TableCell align="center">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        // console.log(session_info)
                                        return (
                                            
                                            <Tooltip title={session_info[0].label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceStudentChange(row.student.sid, s.session_id, 'late')} 
                                                checked={s.attendance=='late'}/>
                                            </Tooltip>                                                    
                                        )
                                        
                                    })
                                }
                                
                            </TableCell>
                            <TableCell align="center">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        // console.log(session_info)
                                        return (
                                            
                                            <Tooltip title={session_info[0].label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceStudentChange(row.student.sid, s.session_id, 'absence')} 
                                                checked={s.attendance=='absence'}/>
                                            </Tooltip>                                                    
                                        )
                                    })
                                }
                                
                            </TableCell>
                            <TableCell align="center">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        // console.log(session_info)
                                        return (
                                            
                                            <Tooltip title={session_info[0].label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceStudentChange(row.student.sid, s.session_id, 'n_absence')} 
                                                checked={s.attendance=='n_absence'}/>
                                            </Tooltip>                                                    
                                        )
                                    })
                                }
                                
                            </TableCell>
                            <TableCell align="center">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        // console.log(session_info)
                                        return (
                                            
                                            <Tooltip title={session_info[0].label} arrow>
                                                <Checkbox onChange={() => this.props.onAttendanceStudentChange(row.student.sid, s.session_id, 'holding')} 
                                                checked={s.attendance=='holding'}/>
                                            </Tooltip>                                                    
                                        )
                                    })
                                }
                                
                            </TableCell>
                            <TableCell align="center" className="note">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        // console.log(session_info)
                                        return (
                                            <TextField
                                                className="note-detail"
                                                label = {session_info[0].time}
                                                key = {session_info[0].time}
                                                size='small'
                                                fullWidth
                                                variant="outlined"
                                                onChange = {(e) => this.props.onAttendanceNoteStudentChange(row.student.sid, s.session_id,e)}
                                            />    
                                                                               
                                        )
                                    })
                                }                                        
                            </TableCell> 
                            {/* <TableCell align="center">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        return (
                                            <Tooltip title={session_info[0].label} arrow>                                                       
                                                <TextField
                                                    className="score_input"
                                                    value={s.score}
                                                    name = {'score_'+s.session_id} 
                                                    key = {'score_'+s.session_id} 
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => this.props.onScoreStudentChange(row.student.sid, s.session_id, e)}
                                                />
                                            </Tooltip>                                                    
                                        )
                                    })
                                }                                        
                            </TableCell> 
                            <TableCell align="center">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        return (
                                            <Tooltip title={session_info[0].label} arrow>                                                       
                                                <TextField
                                                    className="score_input"
                                                    value={s.btvn_score}
                                                    name = {'btvn_score'+s.session_id} 
                                                    key = {'btvn_score'+s.session_id} 
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => this.props.onBtvnScoreChange(row.student.sid, s.session_id, e)}
                                                />
                                            </Tooltip>                                                    
                                        )
                                    })
                                }                                        
                            </TableCell>  */}
                            {/* <TableCell align="center">
                                {
                                    row.attendance.map(s => {
                                        let session_info = this.props.selected_session.filter(ss=>ss.value == s.session_id)
                                        return (
                                            <Tooltip title={session_info[0].label} arrow>                                                       
                                                <TextField
                                                    className="btvn_complete"
                                                    value={s.btvn_complete}
                                                    name = {'btvn_complete'+s.session_id} 
                                                    key = {'btvn_complete'+s.session_id} 
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => this.props.onBtvnCompleteChange(row.student.sid, s.session_id, e)}
                                                />
                                            </Tooltip>                                                    
                                        )
                                    })
                                }                                        
                            </TableCell>  */}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </DialogContentText>
            
            </DialogContent>
            <DialogActions>
            <Button onClick={this.props.handleCloseAttendance} color="primary">
                Hủy
            </Button>
            <Button onClick={this.props.handleSubmitAttendance} color="primary">
                Lưu
            </Button>
            </DialogActions>
        </Dialog>
        )
    }
}
export default AttendanceForm