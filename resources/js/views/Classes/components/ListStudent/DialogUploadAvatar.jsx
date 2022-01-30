import React , { useState, useEffect } from 'react';
import { ClassSearch } from '../../../../components';
// import './DialogUploadAvatar.scss'
import axios from 'axios';
import _ from "lodash";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';
import { StudentProfile } from '../../../Students/components'
const baseUrl = window.Laravel.baseUrl
const initState = {
    
}
var disable = false
class DialogUploadAvatar extends React.Component {    
    constructor(props){
        super(props)        
        this.state = initState
    }
    render(){        
        return(
            <Dialog 
                fullWidth 
                maxWidth='sm'
                scroll='body'
                open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
                classes={{ paperScrollPaper: 'dialog-with-select' }}
            >
                <DialogTitle id="form-dialog-title">Thêm ảnh</DialogTitle>
            <DialogContent className="dialog-create-student dialog-with-select">
                <StudentProfile
                        avatar={this.props.avatar}
                        id={this.props.id}
                    />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.handleClose} color="primary">
                    Hủy bỏ
                </Button>
                {(this.props.type == 'edit') ?  
                    (<Button onClick={this.handleSubmitEdit} color="primary" id="btn-save" disabled={disable}>
                        Lưu
                    </Button>)
                    : 
                    (<Button onClick={this.handleDialogUploadAvatar} color="primary" id="btn-save" disabled={disable}>
                        Xác nhận
                    </Button>)
                }
                
                
            </DialogActions>
        </Dialog>
        )
    }
}
export default withSnackbar(DialogUploadAvatar)