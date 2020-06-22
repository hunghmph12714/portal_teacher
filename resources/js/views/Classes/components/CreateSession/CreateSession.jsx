import React from 'react'
import axios from 'axios'
import './CreateSession.scss'
    import { withSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { format } from 'date-fns';
import {
    KeyboardTimePicker,
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import  DateFnsUtils from "@date-io/date-fns"; // choose your lib
const baseUrl = window.Laravel.baseUrl
class CreateSession extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            from_date: null,
            to_date:null, 
            student_involved: false,
            transaction_involved: false,
        }
    }
    handleFromDate = date => {
        this.setState({ from_date: date });
    };
    handleToDate = date => {
        this.setState( {to_date: date });
    }
    handleCheckBoxChange = (e) => {
        this.setState({
            [e.target.name] : !this.state[e.target.name]
        })
    }
    render(){
        const last_session = (this.props.selectedClass.last_session)?new Date(this.props.selectedClass.last_session) : ''
        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Thêm ca học lớp {this.props.selectedClass.code}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Các ca học sẽ được thêm tự động theo lịch học đã cài đặt. <br/>  
                    {
                        (this.props.selectedClass.last_session) ? 'Ca học cuối cùng : '+ format(new Date(this.props.selectedClass.last_session), 'd/M/yyyy') : 'Chưa có ca học nào'
                    }
                </DialogContentText>
                    <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox checked={this.state.student_involved} onChange={this.handleCheckBoxChange} name="student_involved" />}
                            label="Thêm học sinh"
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={this.state.transaction_involved && this.state.student_involved}
                                onChange={this.handleCheckBoxChange}
                                name="transaction_involved"
                                disabled = {!this.state.student_involved}
                                color="primary"
                            />
                            }
                            label="Tạo công nợ"
                        /> 
                    </FormGroup>
                    <div className="date-time">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            autoOk
                            minDate = {last_session}
                            className="input-date"
                            variant="inline"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            placeholder= "Từ ngày"
                            views={["year", "month", "date"]}
                            value={this.state.from_date}
                            onChange={this.handleFromDate}

                        />                     
                        </MuiPickersUtilsProvider>
                    </div>
                    
                    <div className="date-time">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            autoOk
                            minDate={this.state.from_date}
                            className="input-date"
                            variant="inline"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            placeholder= "Đến ngày"
                            views={["year", "month", "date"]}
                            value={this.state.to_date}
                            onChange={this.handleToDate}

                        />                     
                        </MuiPickersUtilsProvider>
                    </div>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.props.handleClose} color="primary" variant="outlined">
                    Hủy
                </Button>
                <Button onClick={() => this.props.handleCreateSession(this.state.from_date, this.state.to_date, this.props.selectedClass.id)} color="secondary" variant="outlined">
                    Tạo mới
                </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export default withSnackbar(CreateSession)