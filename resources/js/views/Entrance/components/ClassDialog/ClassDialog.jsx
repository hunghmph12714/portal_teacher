import React, {useState} from 'react'
import axios from 'axios'
import './ClassDialog.scss'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button  from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
const ClassDialog = (props) => {
    const {state, open, classes, handleClose, ...rest} = props
    const [selected_class, setClass]= useState('');
    const [enroll_date, setEnroll] = useState(new Date());
    React.useEffect(() => {
        if(props.selectedEntrance ){
            let d = new Date(props.selectedEntrance.enroll_date)
            if(props.selectedEntrance.class_id){
                console.log(props.selectedEntrance.class_id)
                let c = props.classes.filter(cl => cl.value == props.selectedEntrance.class_id )
                console.log(c[0])
                setClass(c[0])
                setEnroll(d)
            }
        }
    }, [props.selectedEntrance])
    function handleChange(value){
        setReason(value)
        setSelectedReason(value.value)
    }
    function onClassChange(value){
        setClass(value)
    }
    function onEnrollChange(value){
        setEnroll(value)
    }
    function handleEditEntrance(){
        axios.post('/entrance/enroll-class', {id: props.selectedEntrance.eid, enroll_date: enroll_date, class: selected_class})
            .then(response => {
                props.handleClose()
                props.fetchdata()
            })
            .catch(err => {
                
            })
    }
    function handleConfirm(){
        axios.post('/entrance/confirm', {id: props.selectedEntrance.eid, enroll_date: enroll_date, class: selected_class})
            .then(response => {
                props.handleClose()
                props.fetchdata()
            })
            .catch(err => {

            })
    }
    return(

        <Dialog 
            {...rest}
            fullWidth 
            maxWidth='sm'
            scroll='paper'
            className=''
            id = "class-dialog"
            open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Nhập học</h4>
            </DialogTitle>
            <DialogContent>
                <h5> Chọn lớp </h5>
                <Select
                    isClearable={false}
                    onChange={onClassChange}
                    options={classes}
                    value={selected_class}
                    className="select-reason"
                />
                <h5> Chọn ngày nhập học </h5>
                <div className="date-time">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                        <KeyboardDateTimePicker
                            minutesStep= {15}
                            value={enroll_date}                            
                            onChange={(value) => onEnrollChange(value)}
                            placeholder="Chọn ngày nhập học"                            
                            className="input-date"
                            variant="inline"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                        />        
                    </MuiPickersUtilsProvider>     
                </div>
            </DialogContent>    
            <DialogActions>
                {
                    (props.confirm) ? (
                        <Button onClick={handleConfirm} color="primary" id="btn-save">
                            Nhập học
                        </Button> 
                    ): ""
                }
                <Button onClick={handleEditEntrance} color="primary" id="btn-save">
                    Xác nhận thay đổi
                </Button>                
            </DialogActions>
        </Dialog>
    )
}
export default ClassDialog