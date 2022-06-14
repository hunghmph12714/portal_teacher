import React , { useState, useEffect } from 'react';
import { ClassSearch } from '../../../../components';
// import './DialogTeams.scss'
import axios from 'axios';
import _ from "lodash";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import qs from 'qs';
import { useSnackbar } from 'notistack';


const DialogTeams = (props) => {
    
    const [sgd_id, setSgdId] = useState('')
    const [ms_id, setMsId] = useState('')
    const [disable, setDisable] = useState(false)
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
    }, [props.open])
    function onSgdIdChange(e){
        setSgdId(e.target.value)
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
            axios.post('https://login.microsoftonline.com/a4894c27-4440-4594-9245-a60db90c8f5f/oauth2/v2.0/token', 
            qs.stringify({
                    grant_type: 'password',
                    client_id: '0fefe5c4-ecb4-4054-a02e-324a37219284',
                    client_secret: 'zsm8Q~uNXgDXoojtr-TAjw0wz45aBuCRzjfpDcCB',
                    scope: 'openid',
                    username: 'thanhttb@vietelite.edu.vn',
                    password: 'V33du2020',
                    // client_type: 'Single-Page Application'
                }), {
                headers: { 
                  "Content-Type": "application/x-www-form-urlencoded"
                }})
                .then(response => {
                    let config = {
                        headers: { Accept: 'application/json',
                            Authorization: `Bearer ${response.access_token}` }
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
                .catch(err => {
                    console.log(err)
                })
            
        }
        
        
    }
    return (
        <Dialog 
            fullWidth 
            maxWidth='sm'
            scroll='body'
            open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title"
            classes={{ paperScrollPaper: 'dialog-with-select' }}
        >
                <DialogTitle id="form-dialog-title">Quản lý tài khoản Teams</DialogTitle>
            <DialogContent className="dialog-create-student dialog-with-select">
                Học sinh: <b>{props.selected_data.fullname}</b><br/>
                {ms_id ? (
                    <>
                    <span>Mã số Teams: <b>{ms_id}</b></span><br/>
                    <span>Email Teams: <b>{sgd_id}@vietelite.edu.vn</b></span><br/>
                    <span>Mã số Vee: <b>{sgd_id}</b></span><br/>

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
                        onChange = {(e) => onSgdIdChange(e)}
                    />
                ): ''}
               
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Hủy bỏ
                </Button>
                {(props.type == 'edit') ?  
                    (<Button onClick={handleSubmitEdit} color="primary" id="btn-save" disabled={disable}>
                        Lưu
                    </Button>)
                    : 
                    (<Button onClick={() => handleCreateTeams()} color="primary" id="btn-save" disabled={disable}>
                        Xác nhận
                    </Button>)
                }
                
                
            </DialogActions>
        </Dialog>
    )
}

export default DialogTeams