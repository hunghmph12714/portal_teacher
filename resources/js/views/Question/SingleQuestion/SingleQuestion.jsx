import React, {useState, useEffect} from 'react';
import './SingleQuestion.scss';
import Mcq from './Mcq'
import Fib from './Fib'
import axios from 'axios'
// import CKEditor from 'ckeditor5-vee-math';
// var Latex = require('react-latex');

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5lmsvee/build/ckeditor';

import {TextField, Button, Grid, Select, FormControl, InputLabel} from '@material-ui/core'

const SingleQuestion = (props) => {
    const [content, setContent] = useState('')
    const [statement, setStatement] = useState('')
    const [question_type, setQuestionType] = useState('')
    const [answer, setAnswer] = useState('')
    const [options, setOptions] = useState([
        {content: '', weight: 0, set: ''},
        {content: '', weight: 0, set: ''},
    ])
    function createQuestion(){
        axios.post('/question/create', {
            config: props.config,
            content: content,
            statement: statement,
            question_type: question_type,
            answer: answer, options: options
        })
            .then(response => {

            })
            .catch(err => {

            })
    }
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
                                <InputLabel htmlFor="outlined-age-native-simple">Loại câu hỏi</InputLabel>
                                <Select
                                    native
                                    value={question_type}
                                    onChange={event => setQuestionType(event.target.value)}
                                    label="Loại câu hỏi"
                                >
                                    <option aria-label="None" value="" />
                                    <option value={'mcq'}>Trắc nghiệm</option>
                                    <option value={'essay'}>Tự luận</option>
                                    <option value={'fib'}>Điền vào chỗ trống</option>
                                    <option value={'order'}>Sắp xếp thứ tự</option>
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
                        }}
                        onChange={ ( event, editor ) => {
                            setContent(editor.getData())
                        } }
                    />
                    {/* <Latex displayMode={true}>{content}</Latex>
                    <Latex>{content}</Latex> */}
                    <hr/>
                    {question_type == 'mcq' ? (
                        <Mcq id={props.id} options={options} setOptions={setOptions} />
                    ): question_type == 'fib' ? (
                        <Fib id={props.id} options={options} setOptions={setOptions} />
                    ): ''}
                    <hr/>
                    <div style={{marginTop: '20px'}}>
                        <h4 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom:'20px'}}>Đáp án | Giải thích</h4>
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
                            data= {answer}
                            onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                // console.log( 'Editor is ready to use!', editor );
                            }}
                            onChange={ ( event, editor ) => {
                                setAnswer(editor.getData())
                            } }
                        />

                    </div>
                </div>
            </Grid>
            <Grid md={2} className="question-add" xs={12}>
                <Button variant="outlined" className="question-btn" color="primary" fullWidth
                    onClick={() => createQuestion()}> Lưu và thêm mới </Button>
                <Button variant="outlined" className="question-btn" color="primary" fullWidth> Lưu và thoát </Button>
                <Button variant="outlined" className="question-btn" color="secondary" fullWidth> Xem trước </Button>
            </Grid>
        </Grid>
        
    )
}
export default SingleQuestion