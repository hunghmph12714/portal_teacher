import React, {useState, useEffect} from 'react'
// import './Fib.scss'
import {Grid, TextField} from '@material-ui/core'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5lmsvee/build/ckeditor';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
const Fib = (props) => {
    const [options, setOptions] = useState([
        {content: '', options: {}, weight: 0, set: ''},
        {content: '', options: {}, weight: 0, set: ''},
    ])
    return(
        <div style={{marginTop: '15px'}}>
            <h4 style={{fontSize: '1.1rem', fontWeight: 'bold'}}>Các đáp án được chấp nhận</h4>
            {/* <p> </p> */}
        {options.map((o, index) => {return(

            <Grid container spacing={2} >
                <Grid item md={1}>
                    <ControlPointIcon key={index} onClick={(e) => {
                        e.preventDefault()
                        let opt = [...options]
                        opt.splice(index+1, 0 , {content: '', weight: 0, options: {}, set: ''})
                        setOptions(opt)
                    }
                        
                    } style={{cursor: 'pointer', marginTop: '7px',}}/>
                    <RemoveCircleOutline key={index} style={{marginLeft: '12px', marginTop: '7px', cursor: 'pointer'}}
                        onClick={(e) => {
                            e.preventDefault()
                            let opt = [...options]
                            if(opt.length > 1){
                                opt.splice(index, 1)
                            }
                            setOptions(opt)
                        }}
                    />
                </Grid>
                <Grid item md={7}>
                    <TextField
                        label="Đáp án"
                        variant="outlined" 
                        size="small"
                        name="content"
                        value = {o.content}
                        fullWidth
                        onChange = {event => {
                            let opt = [...options]
                            opt[index].content = event.target.value
                            setOptions(opt)
                        }}
                    />
                </Grid>
                <Grid item md={2}>
                    <TextField
                        className="question-statement"
                        label="Trọng số"
                        variant="outlined" 
                        size="small"
                        name="weight"
                        type="number"
                        value = {o.weight}
                        fullWidth
                        onChange = {event => {
                            let opt = [...options]
                            opt[index].weight = (event.target.value >=1 ) ? 1 : event.target.value
                            setOptions(opt)
                        }}
                    />
                </Grid>
                <Grid item md={2}>
                    <TextField
                        className="question-statement"
                        label="Nhóm {}"
                        variant="outlined" 
                        size="small"
                        name="set"
                        value = {o.set}
                        fullWidth
                        onChange = {event => {
                            let opt = [...options]
                            opt[index].set = event.target.value
                            setOptions(opt)
                        }}
                    />
                </Grid>
                
                
            </Grid>
            )
        })}
        </div>
    )
}
export default Fib