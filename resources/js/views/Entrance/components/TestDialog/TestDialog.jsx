import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, Button,TextField
} from '@material-ui/core/';
import Select from 'react-select'
import './TestDialog.scss'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import axios from 'axios'
import {DropzoneArea} from 'material-ui-dropzone'

import { useSnackbar } from 'notistack';

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
const TestDialog = props => {
    const {state ,open, handleCloseDialog, selectedEntrance, statusOptions, courseOptions, ...rest} = props
    const [test_note, setTestNote] = useState('')
    const [test_score, setTestScore] = useState('');
    const [status, setStatus] = useState({value: '', label: ''})
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [test_answers, setTestAnswer] = useState('');
    const [test_results, setTestResult] = useState('');
    useEffect(() => {
        

    }, [selectedEntrance])    
    function handleEditEntrance(){
        let fd = new FormData()
        for(let i = 0 ; i < test_answers.length ; i++){
            fd.append('image'+i , test_answers[i], test_answers[i].name)
        }
        for(let i = 0 ; i < test_results.length ; i++){
            fd.append('results'+i , test_results[i], test_results[i].name)
        }
        fd.append('id' , selectedEntrance.eid)
        fd.append('count_answers', test_answers.length)
        fd.append('count_results', test_results.length)
        fd.append('note', test_note)
        fd.append('score', test_score)
        axios.post('/entrance/appointment/edit', fd)
            .then(response => {
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                props.fetchdata();
                props.handleCloseDialog();
            })
            .catch(err => {

            })
        
    }
    function handleUploadFile(files){
        setTestAnswer(files)
    }
    function handleUploadFileResult(files){
        setTestResult(files)
    }
    function handleNoteChange(value){
        setTestNote(value.target.value)
    }
    
    function handleScoreChange(value){
        setTestScore(value.target.value)
    }
    return(
        <Dialog 
            {...rest}
            id="test-dialog"
            fullWidth 
            maxWidth='lg'
            scroll='paper'
            className='root-edit-entrance'
            open={props.open} onClose={props.handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Kiểm tra đầu vào - {props.selectedEntrance.sname}</h4>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3} className="container-grid" {...rest}>
                    <Grid item md={12} lg={6} sm={12} xs={12} className="test-answers-upload"> 
                        <div className="answer-upload">
                            <DropzoneArea 
                                onChange={handleUploadFile}
                                acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                filesLimit = {5}
                                maxFileSize = {10000000}
                                initialFiles = {test_answers.slice(0,5)}
                                dropzoneText = "Kéo thả hoặc chọn bài LÀM của học sinh (Ảnh, PDF, Word)"
                                
                            />
                        </div>
                        <div className="result-upload">
                            <DropzoneArea
                                className="results"
                                onChange={handleUploadFileResult}
                                acceptedFiles = {['image/*', 'application/pdf','application/msword']}
                                filesLimit = {5}
                                maxFileSize = {10000000}
                                initialFiles = {test_results.slice(0,5)}
                                dropzoneText = "Kéo thả hoặc chọn bài CHỮA của học sinh (Ảnh, PDF, Word)"
                            />    
                         </div>
                    </Grid>
                    <Grid item md={12} lg={3} sm={12} xs={12}>
                        <TextField  label="Kết quả" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'test_score'
                            value = {test_score}
                            onChange = {handleScoreChange}
                        /> 
                    </Grid>
                    <Grid item md={12} lg={3} sm={12} xs={12}>
                        <TextField  label="Nhận xét" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'test_note'
                            value = {test_note}
                            onChange = {handleNoteChange}
                        /> 
                        
                    </Grid>
                </Grid>     
            </DialogContent>    
            <DialogActions>
                <Button onClick={props.handleCloseDialog} color="primary">
                    Hủy bỏ
                </Button>
                <Button onClick={() => handleEditEntrance()} color="primary" id="btn-save">
                    Lưu thay đổi
                </Button>                
            </DialogActions>
        </Dialog>
    )

}
export default TestDialog