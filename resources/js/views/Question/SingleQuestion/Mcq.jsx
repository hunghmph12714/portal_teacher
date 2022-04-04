import React, {useState, useEffect, useRef} from 'react'
import './Mcq.scss'
import {Grid, TextField} from '@material-ui/core'
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5-vee-final/build/ckeditor';
import { Editor } from '@tinymce/tinymce-react';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
const Mcq = (props) => {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
        console.log(editorRef.current.getContent());
        }
    };
    return(
        <div style={{marginTop: '15px'}}>
            <h4 style={{fontSize: '1.1rem', fontWeight: 'bold'}}>Các phương án lựa chọn</h4>
        {props.options.map((o, index) => {return(

            <Grid container spacing={2} >
                <Grid item md={1}>
                    <ControlPointIcon key={'add' + index} onClick={(e) => {
                        e.preventDefault()
                        let opt = [...props.options]
                        opt.splice(index+1, 0 , {content: '', weight: 0})
                        if(props.type == 'complex'){
                                props.setComplexOptions(opt, props.index)
                            }else{
                                props.setOptions(opt)
                            }
                    }
                        
                    } style={{cursor: 'pointer',marginTop: '7px',}}/>
                    <RemoveCircleOutline key={'remove' + index} style={!props.type == 'complex' ? {marginLeft: '12px', marginTop: '7px',cursor: 'pointer'}: { marginTop: '7px',cursor: 'pointer'}}
                        onClick={(e) => {
                            e.preventDefault()
                            let opt = [...props.options]
                            if(opt.length > 1){
                                opt.splice(index, 1)
                            }
                            if(props.type == 'complex'){
                                props.setComplexOptions(opt, props.index)
                            }else{
                                props.setOptions(opt)
                            }
                            
                        }}
                    />
                </Grid>
                <Grid item md={8}>
                    {/* <CKEditor
                        editor  ={ClassicEditor}
                        config={{
                            // toolbar: {
                            //     items: [
                            //         'bold',
                            //         'italic',
                            //         'underline',
                            //         'strikethrough',
                            //         'imageUpload',
                            //         'mediaEmbed',
                            //         'MathType', 'ChemType',

                            //     ]
                            // },
                        }}
                        data= {o.content}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log( 'Editor is ready to use!', editor );
                            editor.setData( o.content )
                        }}
                        onChange={ ( event, editor ) => {
                            let opt = [...props.options]
                            opt[index].content = editor.getData()
                            if(props.type == 'complex'){
                                props.setComplexOptions(opt, props.index)
                            }else{
                                props.setOptions(opt)
                            }
                        } }
                    /> */}
                    <Editor
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={o.content}
                        init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount image imagetools'
                        ],
                        toolbar: 'undo redo image | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
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
                            let opt = [...props.options]
                            opt[index].weight = (event.target.value >=1 ) ? 1 : event.target.value
                            if(props.type == 'complex'){
                                props.setComplexOptions(opt, props.index)
                            }else{
                                props.setOptions(opt)
                            }
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