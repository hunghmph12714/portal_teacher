import React from 'react'
import './ScoreForm.scss'
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
class ScoreForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return (
            <Dialog 
                open={this.props.open_score} onClose={this.props.handleCloseScore} aria-labelledby="form-dialog-title"
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
                                Bài tập về nhà<br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>                                                       
                                                <TextField
                                                    className="btvn_input"
                                                    fullWidth
                                                    placeholder="Tổng"
                                                    name="max_score"                                                          
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => this.props.onBtvnMaxScoreChange(s.value, e)}
                                                />
                                            </Tooltip>
                                        )
                                    })
                                }
                            </TableCell>
                            <TableCell align="center">
                                Bài tập trên lớp <br/>
                                {
                                    this.props.selected_session.map(s => {
                                        return (
                                            <Tooltip title={s.label} arrow>                                                       
                                                <TextField
                                                    className="btvn_input"
                                                    fullWidth
                                                    placeholder="Tổng"
                                                    name="max_score"                                                          
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => this.props.onMaxScoreChange(s.value, e)}
                                                />
                                            </Tooltip>
                                        )
                                    })
                                }
                            </TableCell>   
                            <TableCell align="center">
                                <strong>Nhận xét của buổi học </strong><br/> 
                                Hoàn thành tốt bài tập về nhà <br/>
                                Chưa tập trung <br/>
                                Có tiến bộ hơn <br/>
                            </TableCell>                         
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
                                        return (
                                            <Tooltip title={session_info[0].label} arrow>                                                       
                                                <Grid container justify="center" alignItems="center">
                                                    <Grid item md={5}>
                                                        <TextField
                                                            className="btvn_input"
                                                            value={s.btvn_score}
                                                            placeholder= "Số bài đúng"
                                                            fullWidth
                                                            name = {'btvn_score_'+s.session_id} 
                                                            key = {'btvn_score_'+s.session_id} 
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => this.props.onBtvnScoreChange(row.student.sid, s.session_id, e)}
                                                        />
                                                    </Grid> 
                                                    <Grid item md={1}>
                                                        /
                                                    </Grid> 
                                                    <Grid item md={5}>
                                                        <TextField
                                                            className="btvn_input"
                                                            fullWidth
                                                            placeholder= "Số bài đã làm"
                                                            value={s.btvn_complete}
                                                            name = {'btvn_complete_'+s.session_id} 
                                                            key = {'btvn_complete_'+s.session_id} 
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => this.props.onBtvnCompleteChange(row.student.sid, s.session_id, e)}
                                                        />
                                                    </Grid>
                                                </Grid>
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
                                                    className="btvn_input"
                                                    placeholder="Điểm"
                                                    fullWidth
                                                    value={s.score}
                                                    name = {'score'+s.session_id} 
                                                    key = {'score'+s.session_id} 
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
                                        // console.log(session_info)
                                        return (
                                            <TextField
                                                className="note-detail"
                                                label = {session_info[0].time}
                                                key = {session_info[0].time}
                                                value = {s.comment}
                                                size='small'
                                                fullWidth
                                                variant="outlined"
                                                onChange = {(e) => this.props.onCommentChange(row.student.sid, s.session_id,e)}
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
export default ScoreForm