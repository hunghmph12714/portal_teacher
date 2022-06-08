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
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IndnN2h6Rk5zYkV2bWhGWTBUUlk4MldYVWtxbWVieVdDczFrczFwRWZuajgiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hNDg5NGMyNy00NDQwLTQ1OTQtOTI0NS1hNjBkYjkwYzhmNWYvIiwiaWF0IjoxNjU0Njc4OTQ1LCJuYmYiOjE2NTQ2Nzg5NDUsImV4cCI6MTY1NDY4MzI0OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyWmdZTmdRcE9Lc1BLOHIxZng4dVQyL2ZiNkVSNWpDb3BxZld2NVRYZjV1dWZOQzJ3TUEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IlZpZXRFbGl0ZSBNYWluIEFwcCIsImFwcGlkIjoiMGZlZmU1YzQtZWNiNC00MDU0LWEwMmUtMzI0YTM3MjE5Mjg0IiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJUcuG6p24iLCJnaXZlbl9uYW1lIjoiVGjDoG5oIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTQuMjQ4LjgyLjExMSIsIm5hbWUiOiJUcuG6p24gVHLhu4tuaCBCw6xuaCBUaMOgbmggKEhTLktUQ04pIiwib2lkIjoiZjFlOTdjOWEtNzg4NS00OWJiLTgzODQtZTczMDhmMDg0MjY0IiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAwNDBGNzNGMEIiLCJyaCI6IjAuQVZZQUoweUpwRUJFbEVXU1JhWU51UXlQWHdNQUFBQUFBQUFBd0FBQUFBQUFBQUJXQUlnLiIsInNjcCI6IkRpcmVjdG9yeS5SZWFkLkFsbCBEaXJlY3RvcnkuUmVhZFdyaXRlLkFsbCBlbWFpbCBNYWlsLlJlYWQgcHJvZmlsZSBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyLlJlYWRXcml0ZS5BbGwgb3BlbmlkIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoicjdTTDZsUE4zLWRwLU5GUms1blJTY2sxUUphV1lhQVlwRGRETnEyMll4byIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImE0ODk0YzI3LTQ0NDAtNDU5NC05MjQ1LWE2MGRiOTBjOGY1ZiIsInVuaXF1ZV9uYW1lIjoidGhhbmh0dGJAdmlldGVsaXRlLmVkdS52biIsInVwbiI6InRoYW5odHRiQHZpZXRlbGl0ZS5lZHUudm4iLCJ1dGkiOiJISXd1Sko3N04wNllHbUR1c3BNY0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6IkdnLVhaNGpBM3RJU2tqdUpjMDZNNE5jOEltOEVRN0pMdFFxMVAtbUdxOG8ifSwieG1zX3RjZHQiOjE0ODA3MDQzOTN9.ifYPZOK6ZDT7e0iYqBr4beI1pS1pNZ1sAbE3ZBlN-1DxfxLNw_bB6qFhEDQNlROvNoLRtQIkC6Fr8F8nr38bp14HZqweC2GQOq2BPVgctVD7VFXBuf--ZHEk_Ae05_wYgYPKa3QLAIo53EwaYltisBlQIMt-RH_x-oB8aRklLKbbqncKzRFgjAqO9opUhKgGsVbq6VCyDLQcB_WxDt3kXtfVqidnXghBPQdA59H3wYw5dLgSCIEe5UNA92QMAHCOJ9Lw6gLZR_-dYWRCJmggScOkmkCxC7VSXbO21LQuY2dExidp93VA5b3wAlaGUgf005we1gqvwI7KFxneh8R5vQ' }
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