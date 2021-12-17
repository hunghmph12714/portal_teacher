import React, {useState, useEffect} from 'react';
import './SingleQuestion.scss';
import Mcq from './Mcq'
import axios from 'axios'
// import CKEditor from 'ckeditor5-vee-math';
// var Latex = require('react-latex');

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor-lms-vee/build/ckeditor';

import {TextField, Grid, Select, FormControl, InputLabel} from '@material-ui/core'

const SingleQuestion = (props) => {
    const [content, setContent] = useState('')
    const [statement, setStatement] = useState('')
    const [question_type, setQuestionType] = useState('')
    // useEffect(() => {
    //     ClassicEditor.create( document.querySelector( '#editor-vee' ) )
    //     .then( editor => {
    //         console.log(editor)
    //     } )
    //     .catch( error => {
    //         console.error( 'There was a problem initializing the editor.', error );
    //     } );
    // },[])
    return (
        <div className="single-question-root">
            <Grid container spacing={2}>
                <Grid item md={8}>
                    <TextField
                        className="question-statement"
                        label="Câu hỏi"
                        variant="outlined" 
                        size="small"
                        name="title"
                        value = {statement}
                        fullWidth
                        onChange = {event => setStatement(event.target.value)}
                    />
                </Grid>
                <Grid item md={4}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel htmlFor="outlined-age-native-simple">Loại câu hỏi</InputLabel>
                        <Select
                            native
                            value={question_type}
                            onChange={event => setQuestionType(event.target.value)}
                            label="Loại câu hỏi"
                        >
                            <option aria-label="None" value="" />
                            <option value={'mcq'}>Trắc nghiệm</option>
                            <option value={'fib'}>Điền vào chỗ trống</option>
                            <option value={'order'}>Sắdp xếp thứ tự</option>
                            <option value={'matrix'}>Nối đáp án</option>
                            <option value={'complex'}>Câu hỏi phức</option>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <div id="editor-vee"></div>
            <CKEditor
                editor={ClassicEditor}
                config={{
                    toolbar: {
                        items: [
                            'heading', 'MathType', 'ChemType',
                            '|',
                            'bold',
                            'italic',
                            'link',
                            'bulletedList',
                            'numberedList',
                            'imageUpload',
                            'mediaEmbed',
                            'insertTable',
                            'blockQuote',
                            'undo',
                            'redo'
                        ]
                    },
                }}
                data= {content}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log( 'Editor is ready to use!', editor );
                }}
                onChange={ ( event, editor ) => {
                    setContent(editor.getData())
                } }
            />
            {/* <Latex displayMode={true}>{content}</Latex>
            <Latex>{content}</Latex> */}
            {question_type == 'mcq' ? (
                <Mcq id={props.id}/>
            ): question_type == 'fib' ? (
                <div />
            ): ''}
        </div>
    )
}
export default SingleQuestion