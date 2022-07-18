import React , { useState, useEffect } from 'react';
import { ClassSearch } from '../../../../components';
import './DialogTeams.scss'
// import './DialogTeams.scss'
import axios from 'axios';
import _ from "lodash";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { StudentProfile } from '../../../Students/components';
import TextField from '@material-ui/core/TextField';
import qs from 'qs';
import { useSnackbar } from 'notistack';
import { de } from 'date-fns/locale';


const DialogTeams = (props) => {
    
    const [sgd_id, setSgdId] = useState('')
    const [ms_id, setMsId] = useState('')
    const [disable, setDisable] = useState(false)
    const [note_disable, setNoteDisable] = useState(false)
    const [entrances, setEntrances] = useState([])
    const [notes, setNotes] = useState([])
    const [note, setNote] = useState('')
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if(props.selected_data.sgd_id){
            setSgdId(props.selected_data.sgd_id)
            setMsId(props.selected_data.ms_id)
            setDisable(true)
        }else{
            if(props.selected_data){
                setSgdId(props.selected_data.id)
                setMsId('')
                setDisable(false)
            }
            
        }
        if(props.selected_data.id){
            fetchProfile()
        }
    }, [props.open])
    useEffect(() => {
        
    },[])
    function onSgdIdChange(e){
        setSgdId(e.target.value)
    }
    function onNoteChange(e){
        setNote(e.target.value)
    }
    function handleSubmitEdit(){

    }
    function handleCreateTeams(){
        setDisable(true)
        if(sgd_id){
            let si = sgd_id.toString()
            let data = {
                "accountEnabled": true,
                "displayName": `${props.selected_data.fullname}(Student)`,
                "mailNickname": si,
                "userPrincipalName": `${si}@vietelite.edu.vn`,
                "usageLocation": "VN",
                "passwordProfile": {
                    "forceChangePasswordNextSignIn": true,
                    "password": "V33du2022"
                }
            }
           axios.post('/azure-token', {})
            .then(response => {
                let config = {
                    headers: { Accept: 'application/json',
                        Authorization: `Bearer ${response.data.access_token}` }
                };
                axios.post('https://graph.microsoft.com/v1.0/users', data, config)
                .then(response => {
                    // console.log(response)
                    let body = {
                        "addLicenses": [
                            {
                                "skuId": "314c4481-f395-4525-be8b-2ec4bb1e9d91"
                            }
                        ],
                        "removeLicenses": []
                    }
                    let user_id = response.data.id
                    axios.post(`https://graph.microsoft.com/v1.0/users/${user_id}/assignLicense`, body, config)
                    .then(r => {
                        axios.post('/student/save-sgd-id', {id: props.selected_data.id, sgd_id: sgd_id, ms_id: user_id})
                            .then(response => {
                                props.handleClose()
                                enqueueSnackbar('Tạo tài khoản Teams thành công', {variant: 'success'})
                                setDisable(false)   
                            })
                            .catch(err => {
                                
                            })
                    })
                    .catch(err => {
    
                    })
                })
                .catch(err => {
                    enqueueSnackbar('Token Microsoft đã hết hạn, vui lòng gia hạn', {variant: 'error'})
                })
            })
            .catch(err => {})
            
        }
        
        
    }
    function fetchProfile(){
        axios.post('/student/get-profile', {student_id: props.selected_data.id})
        .then(response => {
            setEntrances(response.data.entrances)
            setNotes(response.data.notes)
        })
        .catch(err => {

        })
    }
    function handleCreateNote(){
        setNoteDisable(true)
        axios.post('/student/note/create', {
            id: props.selected_data.id,
            class_id: props.selected_data.detail.class_id, 
            note: note,
        })
            .then(response => {
                setNoteDisable(false)
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                fetchProfile()
                // fetchMessages()
            })
            .catch(err => {
                setNoteDisable(false)
            })
    }
    function deleteNote(id){
        axios.post('/student/note/delete', {id: id})
            .then(response => {
                fetchProfile()
                enqueueSnackbar('Đã xoá ghi chú', {variant: 'success'});
            })
            .catch(err => {

            })
    }
    return (
        <Dialog 
            fullWidth 
            maxWidth='lg'
            scroll='body'
            open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title"
            classes={{ paperScrollPaper: 'dialog-with-select' }}
        >
                <DialogTitle id="form-dialog-title" >Hồ sơ học sinh</DialogTitle>
            <DialogContent className="dialog-create-student dialog-with-select">
                <Grid
                        container
                        spacing={3}
                    >
                    <Grid
                        item
                        lg={4}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        <StudentProfile
                            avatar={props.selected_data.avatar}
                            id={props.selected_data.id}
                        />
                        <Typography variant="h4" component="div" style={{marginBottom: '15px' , marginTop:'15px', fontWeight:'bold', textDecoration:'underline'}}>
                            Thông tin học sinh
                        </Typography>
                        <span>Họ tên học sinh: <b>{props.selected_data.fullname}</b></span><br/>
                        <span>Ngày sinh: <b>{props.selected_data.dob}</b></span><br/>
                       {ms_id ? (
                            <>
                            <span>Mã số Teams: <b>{ms_id}</b></span><br/>
                            <span>Email Teams: <b>{sgd_id}@vietelite.edu.vn</b></span><br/>
                            </>
                        ): ""}
                        {!props.selected_data.sgd_id ? (
                            <TextField 
                                style={{marginTop: '15px'}}
                                id="outlined-basic" 
                                label="Mã số học sinh"
                                variant="outlined" size="small"
                                name="sgd_id"
                                fullWidth
                                className="text-input"
                                value = {sgd_id}
                                disabled
                                onChange = {(e) => onSgdIdChange(e)}
                            />
                        ): ''}
                        {(props.type == 'edit') ?  
                            (<Button onClick={handleSubmitEdit} color="primary" id="btn-save" disabled={disable}>
                                Lưu
                            </Button>)
                            : 
                            (<Button onClick={() => handleCreateTeams()} color="primary" id="btn-save" disabled={disable}>
                                Tạo tài khoản Microsoft Teams
                            </Button>)
                        }
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        
                        <Typography variant="h4" component="div" style={{marginBottom: '15px', fontWeight:'bold', textDecoration:'underline'}}>
                            Thông tin ghi danh
                        </Typography>
                        {entrances.map(e => {
                            return(
                                <Card variant='outlined' style={{marginBottom: '15px'}}> 
                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            Nguyện vọng: <b>{e.note}</b><br/>
                                            Môn đăng ký: <b>{e.course}</b><br/>
                                            Thời gian: <b>{e.created_at}</b><br/>
                                            Điểm: <b>{e.test_score}</b><br/>
                                            Nhận xét: <b>{e.note}</b><br/>
                                        </Typography>
                                        
                                    </CardContent>
                                </Card>
                            )
                        })} 
                    </Grid> 
                    <Grid item lg={4} md={4} xs={12}>
                        <Typography variant="h4" component="div" style={{marginBottom: '15px', fontWeight:'bold', textDecoration:'underline'}}>
                            Ghi chú
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item md={8} sm={12}>
                                <TextField  label="Ghi chú" 
                                    className = "input-text"
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    fullWidth
                                    name = 'note'
                                    value = {note}
                                    onChange = {onNoteChange}
                                /> 
                            </Grid>
                            <Grid item md={4} sm={12}>
                                <Button disabled={note_disable} onClick={() => handleCreateNote()} color="primary" id="btn-save">
                                    Lưu ghi chú
                                </Button> 
                            </Grid>
                        </Grid>              
                        {notes.map( a => {
                                return(
                                    <div className="root-notes">
                                        <Grid container spacing = {2} className="messages" 
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item md={2} sm={2}>
                                                <Avatar src={a.avatar} />
                                            </Grid>
                                            <Grid item md={10} sm={10} className="notes-content">
                                                <div>
                                                    <span className="user_name"> {a.name} </span> 
                                                    {(a.code) ? 
                                                        <span className="method"> • { a.code } </span> : ""   
                                                    }
                                                    {(a.sname) ? 
                                                        <span className="method"> • { a.sname } </span> : ""   
                                                    }
                                                    <p className="content">{ a.content }</p>
                                                    <span className="delete">
                                                        <a onClick={() => deleteNote(a.id)}>Xoá</a>
                                                    </span>
                                                    <span className="time"> • {a.created_at_formated} </span>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                )
                        })}

                        
                    </Grid>   
                </Grid>
                
               
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Đóng
                </Button>
                
                
            </DialogActions>
        </Dialog>
    )
}

export default DialogTeams