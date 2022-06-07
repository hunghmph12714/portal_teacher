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
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6InBWbWJWQ2xyMXk0TVJlNnQ4M0E5LXRlRDVhcTJrOExCdEtFYjV6LTZZZUUiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hNDg5NGMyNy00NDQwLTQ1OTQtOTI0NS1hNjBkYjkwYzhmNWYvIiwiaWF0IjoxNjU0NTg3ODAwLCJuYmYiOjE2NTQ1ODc4MDAsImV4cCI6MTY1NDU5MjgyNSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhUQUFBQXhJQXZZYk44bTczUU01MXNUN1RjbEwxc2x0RU1OY2RmODBlc2plVmtWM2c9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJWaWV0RWxpdGUgTWFpbiBBcHAiLCJhcHBpZCI6IjBmZWZlNWM0LWVjYjQtNDA1NC1hMDJlLTMyNGEzNzIxOTI4NCIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiVHLhuqduIiwiZ2l2ZW5fbmFtZSI6IlRow6BuaCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE0LjIzMi40MS42IiwibmFtZSI6IlRy4bqnbiBUcuG7i25oIELDrG5oIFRow6BuaCAoSFMuS1RDTikiLCJvaWQiOiJmMWU5N2M5YS03ODg1LTQ5YmItODM4NC1lNzMwOGYwODQyNjQiLCJwbGF0ZiI6IjUiLCJwdWlkIjoiMTAwMzIwMDA0MEY3M0YwQiIsInJoIjoiMC5BVllBSjB5SnBFQkVsRVdTUmFZTnVReVBYd01BQUFBQUFBQUF3QUFBQUFBQUFBQldBSWcuIiwic2NwIjoiRGlyZWN0b3J5LlJlYWQuQWxsIERpcmVjdG9yeS5SZWFkV3JpdGUuQWxsIGVtYWlsIE1haWwuUmVhZCBwcm9maWxlIFVzZXIuUmVhZCBVc2VyLlJlYWQuQWxsIFVzZXIuUmVhZFdyaXRlLkFsbCBvcGVuaWQiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJyN1NMNmxQTjMtZHAtTkZSazVuUlNjazFRSmFXWWFBWXBEZEROcTIyWXhvIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiYTQ4OTRjMjctNDQ0MC00NTk0LTkyNDUtYTYwZGI5MGM4ZjVmIiwidW5pcXVlX25hbWUiOiJ0aGFuaHR0YkB2aWV0ZWxpdGUuZWR1LnZuIiwidXBuIjoidGhhbmh0dGJAdmlldGVsaXRlLmVkdS52biIsInV0aSI6ImlTQ1hPYzcyLUV1SW9QM3ZoNVV3QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiR2ctWFo0akEzdElTa2p1SmMwNk00TmM4SW04RVE3Skx0UXExUC1tR3E4byJ9LCJ4bXNfdGNkdCI6MTQ4MDcwNDM5M30.P4w2myQfM5JR_23EqOtcqOT0bdwrlVtEw3yRSGGXxKHdn74rQVyHUN4x-lVlRXkeXu0u54HaNboKuFr_NM8mRl6MQoUQCesS6K6h4betu7MG2B00wCNhRVdZRebLNn_eV6eDHQBLKR42b7H1GheHdDDFwp2w-wT3NuU7kXw8bxYhnAnRsDvpKgWdfdyxW_jEAiJsGhdYdrnSJrXuUq7y2a0kMQGdNKItLyPaExAUxYCgV054mYX8NrvnQ5uvn6SBekPLVyXLq0dzBMj9zJ8kRxLYsnords7JJMF-CapEb1PsZhF2isp76VyNrDlFqC5GychyyrIyYz7SZrSDmPKVUQ' }
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