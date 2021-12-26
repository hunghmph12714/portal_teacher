import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, Button,TextField, GridList, GridListTile, InputAdornment, RadioGroup,FormControlLabel,Radio
} from '@material-ui/core/';
import Select from 'react-select'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import axios from 'axios'
import NumberFormat from 'react-number-format';
import { useSnackbar } from 'notistack';

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import { parse } from 'date-fns';

const PreviewQuestion = props => {
    const {open, handleCloseDialog, ...rest} = props
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [selected, setSelected] = useState('')
    useEffect(() => {
        // console.log(props.selectedAccount)
        

    }, [])    
    
    
    return(
        <Dialog 
            {...rest}
            id="account-dialog"
            fullWidth 
            maxWidth='md'
            scroll='paper'
            className='root-edit-budget'
            open={props.open} onClose={props.handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Xem trước câu hỏi</h4>
            </DialogTitle>
            <DialogContent>
                <b>Câu 1: </b>
                {ReactHtmlParser(props.question.content)}
                <RadioGroup aria-label="quiz" name="quiz" style={{marginLeft: '10px'}} 
                    onChange={(event) => setSelected(event.target.value)} value={selected}
                >
                    {props.question.options.map((o, index) => {
                        return(
                            <FormControlLabel key={'op_'+o.id} value={'a'+o.id} control={<Radio />} label={ReactHtmlParser(o.content)} />
                        )
                    })}
                </RadioGroup>
                
            </DialogContent>    
            <DialogActions>
                             
            </DialogActions>
        </Dialog>
    )

}
export default PreviewQuestion