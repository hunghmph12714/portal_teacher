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
import { useSnackbar } from 'notistack';

const config = {
    headers: { Accept: 'application/json',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6InZDS3prX0lKeVRaR0tGT1JSQ1VyNnRiWXNDZnlxaTBfRlQxb3J6X2Vab2siLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hNDg5NGMyNy00NDQwLTQ1OTQtOTI0NS1hNjBkYjkwYzhmNWYvIiwiaWF0IjoxNjU0NTcwMzU4LCJuYmYiOjE2NTQ1NzAzNTgsImV4cCI6MTY1NDU3NTAyMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyWmdZUGcrNDRJMFExVis4UnBqNDR2OG04VGVCYjVoUEdKN1gxNm81cFZEbXZaZThka0EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IlZpZXRFbGl0ZSBNYWluIEFwcCIsImFwcGlkIjoiMGZlZmU1YzQtZWNiNC00MDU0LWEwMmUtMzI0YTM3MjE5Mjg0IiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJUcuG6p24iLCJnaXZlbl9uYW1lIjoiVGjDoG5oIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTQuMjMyLjQxLjYiLCJuYW1lIjoiVHLhuqduIFRy4buLbmggQsOsbmggVGjDoG5oIChIUy5LVENOKSIsIm9pZCI6ImYxZTk3YzlhLTc4ODUtNDliYi04Mzg0LWU3MzA4ZjA4NDI2NCIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMDQwRjczRjBCIiwicmgiOiIwLkFWWUFKMHlKcEVCRWxFV1NSYVlOdVF5UFh3TUFBQUFBQUFBQXdBQUFBQUFBQUFCV0FJZy4iLCJzY3AiOiJEaXJlY3RvcnkuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwgZW1haWwgTWFpbC5SZWFkIHByb2ZpbGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgVXNlci5SZWFkV3JpdGUuQWxsIG9wZW5pZCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6InI3U0w2bFBOMy1kcC1ORlJrNW5SU2NrMVFKYVdZYUFZcERkRE5xMjJZeG8iLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiJhNDg5NGMyNy00NDQwLTQ1OTQtOTI0NS1hNjBkYjkwYzhmNWYiLCJ1bmlxdWVfbmFtZSI6InRoYW5odHRiQHZpZXRlbGl0ZS5lZHUudm4iLCJ1cG4iOiJ0aGFuaHR0YkB2aWV0ZWxpdGUuZWR1LnZuIiwidXRpIjoibnl2MU5mdmNyMHlJaWhSX09MRXdBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJHZy1YWjRqQTN0SVNranVKYzA2TTROYzhJbThFUTdKTHRRcTFQLW1HcThvIn0sInhtc190Y2R0IjoxNDgwNzA0MzkzfQ.p5AO2uogFakeYmHdnWrUWX8A4j65O8nzA4PA8VIhz29GQoW-6Ov7SRw6LIMD6ofeP63p0vkySyWELURxikYMTiJJF3_sX1UfwFR6pqjEal75OsIhGzdt8SiYgcd3s4B5wb6vRWqbJqKm_Z4RwGsMXpf9VKq-WTeSKO_fFI7fDAUEpAUQnX2Lj5ue6LeqTGj0kukqlQaGBcML1H31uoAsJivbEfkKke7RQbFN99Z_ytnY-zqWEQ9gVRaDdyQDm0bsgyF0P0Z9yAByb2ie9nT8UQVc7kfpYLreWIxMPuknivVpDKxIY1h1AWOhNzUYFD9bjyiLxMenQj0SHoL5-0tQXA' }
};
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
            axios.post('https://graph.microsoft.com/v1.0/users', data, config)
                .then(response => {
                    // console.log(response)
                    let body = {
                        "addLicenses": [
                            // {
                            //     "skuId": "94763226-9b3c-4e75-a931-5c89701abe66"
                            // },
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