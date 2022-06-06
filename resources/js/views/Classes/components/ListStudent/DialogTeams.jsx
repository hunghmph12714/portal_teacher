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
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IjN1eWVyblJBRFVXNG9XMmZnaFY2MWtNWVJXbkdKcTR5VDQxa05BVnNCcE0iLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hNDg5NGMyNy00NDQwLTQ1OTQtOTI0NS1hNjBkYjkwYzhmNWYvIiwiaWF0IjoxNjU0NTAwNDU2LCJuYmYiOjE2NTQ1MDA0NTYsImV4cCI6MTY1NDUwNTEyMywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhUQUFBQW1qckNzSVBtdjlZYmEza0orL1pBcmdPWUkyRCt6d3NzQ1pzWThld3NQblU9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJWaWV0RWxpdGUgTWFpbiBBcHAiLCJhcHBpZCI6IjBmZWZlNWM0LWVjYjQtNDA1NC1hMDJlLTMyNGEzNzIxOTI4NCIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiVHLhuqduIiwiZ2l2ZW5fbmFtZSI6IlRow6BuaCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE0LjI0OC44Mi4xMTEiLCJuYW1lIjoiVHLhuqduIFRy4buLbmggQsOsbmggVGjDoG5oIChIUy5LVENOKSIsIm9pZCI6ImYxZTk3YzlhLTc4ODUtNDliYi04Mzg0LWU3MzA4ZjA4NDI2NCIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMDQwRjczRjBCIiwicmgiOiIwLkFWWUFKMHlKcEVCRWxFV1NSYVlOdVF5UFh3TUFBQUFBQUFBQXdBQUFBQUFBQUFCV0FJZy4iLCJzY3AiOiJEaXJlY3RvcnkuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwgZW1haWwgTWFpbC5SZWFkIHByb2ZpbGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgVXNlci5SZWFkV3JpdGUuQWxsIG9wZW5pZCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6InI3U0w2bFBOMy1kcC1ORlJrNW5SU2NrMVFKYVdZYUFZcERkRE5xMjJZeG8iLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiJhNDg5NGMyNy00NDQwLTQ1OTQtOTI0NS1hNjBkYjkwYzhmNWYiLCJ1bmlxdWVfbmFtZSI6InRoYW5odHRiQHZpZXRlbGl0ZS5lZHUudm4iLCJ1cG4iOiJ0aGFuaHR0YkB2aWV0ZWxpdGUuZWR1LnZuIiwidXRpIjoiOXpocGx4S3FEazZNODhKUkFUOElBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJHZy1YWjRqQTN0SVNranVKYzA2TTROYzhJbThFUTdKTHRRcTFQLW1HcThvIn0sInhtc190Y2R0IjoxNDgwNzA0MzkzfQ.ObpL_2Wy7yd8_uT7OU__ZmntXNs9hpWSpsFj1VvpbXJVFox-O_3Id3TnMXLyTFSAUopjMAbqc6rWordMi7h9uMjxEuPdZSQuya2NrFnANMYc6rphfk0RDC1VGjbUYLMnoFZ4gagXEzQQc9RVjd5yGldQS6bSj8p5PrebtATwXFwBJXooTO-7eFYBhow_Krnc5heKGjr6M-3E88W_G1LMFGGIZo5bD7pTB32rkiDC54qi23i8dGwXfRmZkBMhZhLjJD_DWrmfRqnoHDP4PT5b_xxNrg7DrI464rn8mqs0O8_JlreFIug_K44u8z8oiCrRk7e66RCPBNtR-DdDY723Ew' }
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