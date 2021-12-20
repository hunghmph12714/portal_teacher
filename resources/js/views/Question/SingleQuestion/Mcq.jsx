import React, {useState, useEffect} from 'react'
import './Mcq.scss'
import {Grid, TextField} from '@material-ui/core'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5lmsvee/build/ckeditor';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
const Mcq = (props) => {
    const [options, setOptions] = useState([
        {content: '', options: {}, weight: 0},
        {content: '', options: {}, weight: 0},
    ])
    return(
        <div style={{marginTop: '15px'}}>
            <h4 style={{fontSize: '1.1rem', fontWeight: 'bold'}}>Các phương án lựa chọn</h4>
        {options.map((o, index) => {return(

            <Grid container spacing={2} >
                <Grid item md={1}>
                    <ControlPointIcon key={index} onClick={(e) => {
                        e.preventDefault()
                        let opt = [...options]
                        opt.splice(index+1, 0 , {content: '', weight: 0, options: {}})
                        setOptions(opt)
                    }
                        
                    } style={{cursor: 'pointer',marginTop: '7px',}}/>
                    <RemoveCircleOutline key={index} style={{marginLeft: '12px', marginTop: '7px',cursor: 'pointer'}}
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
                <Grid item md={8}>
                    <CKEditor
                        editor  ={ClassicEditor}
                        config={{
                            toolbar: {
                                items: [
                                    'bold',
                                    'italic',
                                    'imageUpload',
                                    'mediaEmbed',
                                    'MathType', 'ChemType',

                                ]
                            },
                        }}
                        data= {o.content}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log( 'Editor is ready to use!', editor );
                        }}
                        onChange={ ( event, editor ) => {
                            let opt = [...options]
                            opt[index].content = editor.getData()
                            setOptions(opt)
                        } }
                    />
                </Grid>
                <Grid item md={3}>
                    <TextField
                        className="question-statement"
                        label="Trọng số (Từ -1 đến 1)"
                        variant="outlined" 
                        size="small"
                        name="weight"
                        type="number"
                        min={0}
                        max={1}
                        value = {o.weight}
                        fullWidth
                        onChange = {event => {
                            let opt = [...options]
                            opt[index].weight = (event.target.value >=1 ) ? 1 : event.target.value
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
export default Mcq