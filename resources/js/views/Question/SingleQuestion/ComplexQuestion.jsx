import React, {useState, useEffect} from 'react';
// import './ComplexQuestion.scss';
import Mcq from './Mcq'
import Fib from './Fib'
import axios from 'axios'
// import CKEditor from 'ckeditor5-vee-math';
// var Latex = require('react-latex');

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5lmsvee/build/ckeditor';
import {PreviewQuestion} from './'
import { useSnackbar } from 'notistack';
import {TextField, Button, Grid, Select, FormControl, InputLabel} from '@material-ui/core'

const ComplexQuestion = (props) => {
    const {enqueueSnackbar} = useSnackbar()
    const [content, setContent] = useState('')
    const [statement, setStatement] = useState('')
    const [question_type, setQuestionType] = useState('')
    const [answer, setAnswer] = useState('')
    const [options, setOptions] = useState([
        {content: '', weight: 0, set: ''},
        {content: '', weight: 0, set: ''},
    ])
    const [preview_open, setPreviewOpen] = useState(false)
    function handleOpenPreview(){
        setPreviewOpen(true)
    }
    function handleClosePreview(){
        setPreviewOpen(false)
    }
    useEffect(() => {
        // console.log(props.question)
        
    }, [])
    
    return (
        <Grid container spacing={2}  >
            <Grid md={10} xs={12} className="question-detail"> 
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
                                <InputLabel htmlFor="ougtlined-age-native-simple">Loại câu hỏi</InputLabel>
                                <Select
                                    native
                                    value={question_type}
                                    onChange={event => setQuestionType(event.target.value)}
                                    label="Loại câu hỏi"
                                >
                                    <option aria-label="None" value="" />
                                    <option value={'mc'}>Trắc nghiệm</option>
                                    <option value={'essay'}>Tự luận</option>
                                    <option value={'fib'}>Điền vào chỗ trống</option>
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
                                    'heading', 
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
                                    'redo',
                                    'MathType', 'ChemType',

                                ]
                            },
                        }}
                        data= {content}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log( 'Editor is ready to use!', editor );
                            editor.setData( content );

                        }}
                        onChange={ ( event, editor ) => {
                            setContent(editor.getData())
                        } }
                    />
                    {/* <Latex displayMode={true}>{content}</Latex>
                    <Latex>{content}</Latex> */}
                    <hr/>
                    {question_type == 'mc' ? (
                        <Mcq id={props.id} options={options} setOptions={setOptions} />
                    ): question_type == 'fib' ? (
                        <Fib id={props.id} options={options} setOptions={setOptions} />
                    ): question_type == 'complex' ? (
                        ''
                    ):''}
                </div>
            </Grid>
        </Grid>    
        
    )
}
export default ComplexQuestion