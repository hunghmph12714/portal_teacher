import React, {useState} from 'react'
import axios from 'axios'
import './StatusDialog.scss'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button  from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreatableSelect from 'react-select/creatable';

const StatusDialog = (props) => {
    const {state, open, handleClose, ...rest} = props
    const reasons = [
        {value: 'Phụ huynh không nghe điện thoại', label: 'Phụ huynh không nghe điện thoại'},
        {value: 'Phụ huynh cần tư vấn thêm', label: 'Phụ huynh cần tư vấn thêm'},
        {value: 'Phụ huynh đổi ý', label: 'Phụ huynh đổi ý'},
        {value: 'Học phí quá cao', label: 'Học phí quá cao'},
        {value: 'Không tìm được giờ học hợp lý', label: 'Không tìm được giờ học hợp lý'},
        {value: 'Đã tìm được chỗ khác', label: 'Đã tìm được chỗ khác'},
        {value: 'Không tìm được giáo viên ưng ý', label: 'Không tìm được giáo viên ưng ý'},
        {value: 'Thất bại do tư vấn chậm trễ', label: 'Thất bại do tư vấn chậm trễ'},
    ]
    const [selected_reason, setSelectedReason] = useState('');
    const [reason, setReason]= useState('');
    const [comment, setComment] = useState('');
    function handleChange(value){
        setReason(value)
        setSelectedReason(value.value)
    }
    function onCommentChange(value){
        setComment(value.target.value)
    }
    function handleEditEntrance(){
        props.handleStatusChange(props.selectedEntrance, selected_reason, comment)
        props.handleClose()
    }
    return(

        <Dialog 
            {...rest}
            fullWidth 
            maxWidth='sm'
            scroll='paper'
            className=''
            id = "status-dialog"
            open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Nguyên nhân thay đổi trạng thái</h4>
            </DialogTitle>
            <DialogContent>
                <h5> Nguyên nhân thay đổi </h5>
                <CreatableSelect
                    isClearable={false}
                    onChange={handleChange}
                    options={reasons}
                    className="select-reason"
                />
                <h5> Ghi chú trạng thái </h5>
                <TextField  label="Ghi chú" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    margin = "dense"
                    name = 'note'
                    value = {comment}
                    onChange = {onCommentChange}
                />
            </DialogContent>    
            <DialogActions>
                <Button onClick={handleEditEntrance} color="primary" id="btn-save">
                    Xác nhận thay đổi
                </Button>                
            </DialogActions>
        </Dialog>
    )
}
export default StatusDialog