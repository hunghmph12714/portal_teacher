import React, {useState, useEffect} from 'react'
import './Mcq.scss'
import {Grid, } from '@material-ui/core'
// import { CKEditor } from 'ckeditor4-react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5-vee-math/build/ckeditor';

const Mcq = (props) => {
    const [options, setOptions] = useState([
        {content: '', options: {}},
        {content: '', options: {}},
    ])
    return(
        <div>
        {options.map((o, index) => {return(
            <Grid container spacing={2}>
                <Grid item md={4}>

                </Grid>
                <Grid item md={8}>
                    <p> </p>
                    {/* <CKEditor   
                        editorUrl="/public/js/ckeditor/ckeditor.js"
                        data= {o.content}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log( 'Editor is ready to use!', editor );
                        }}
                        onChange={ ( event, editor ) => {
                            let tmp_options = [...options]
                            tmp_options[index].content = editor.getData()
                            setOptions(tmp_options)
                            // setContent(editor.getData())
                        } }
                    /> */}
                </Grid>
            </Grid>
            )
        })}
        </div>
    )
}
export default Mcq