import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './UserClass.scss'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button  from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import {useSnackbar} from 'notistack'
const UserClass = (props) => {
    const {state, open, handleClose, ...rest} = props
    const [classes, setClasses] = useState([])
    const { enqueueSnackbar } = useSnackbar()
    const [selectedClasses, setSelectClasses] = useState([])
    useEffect(() => {
        if(open){
            axios.get(window.Laravel.baseUrl + "/class/get/-1/-1")
            .then(response => {    
                setClasses(response.data.map(c => {
                    return {label: c.code, value: c.id}
                }))
            })
            .catch(err => {
                console.log('class get bug: ' + err)
            })
        setSelectClasses(props.user_classes.map(uc => {
            return {label: uc.code, value: uc.id}
        }))
        }
        
    }, [open])
    function handleUserClass(){
        axios.post('/user/class-permission', {user_id: props.user_id, selectedClasses})
            .then(response => {
                handleClose()
                enqueueSnackbar('Thêm lớp thành công', {variant: 'success'})
            })
            .catch(err => {

            })
    }
    
    function onClassChange(values){
        setSelectClasses(values)
    }
    return(
        <Dialog 
            {...rest}
            fullWidth 
            maxWidth='md'
            scroll='paper'
            className=''
            id = "status-dialog"
            open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Phân lớp cho người dùng</h4>
            </DialogTitle>
            <DialogContent>

                <h5>Lựa chọn lớp học</h5>
                <Select
                
                    closeMenuOnSelect= {false}
                    isMulti
                    value= {selectedClasses}
                    onChange={onClassChange}
                    options={classes}
                    className="select-status"
                />
                
            </DialogContent>    
            <DialogActions>
                <Button onClick={handleUserClass} color="primary" id="btn-save">
                    Xác nhận thay đổi
                </Button>                
            </DialogActions>
        </Dialog>
    )
}
export default UserClass