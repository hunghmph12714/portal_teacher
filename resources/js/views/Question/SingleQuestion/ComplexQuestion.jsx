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
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import {TextField, Button, Grid, Select, FormControl, InputLabel} from '@material-ui/core'

const ComplexQuestion = (props) => {
    const {enqueueSnackbar} = useSnackbar()
    
    useEffect(() => {
        // console.log(props.question)
        
    }, [])
    function onStatementChange(value, index){
        let q = [...props.questions]
        q[index].statement = value
        props.setComplexQuestion(q)
    }
    function onQuestionTypeChange(value, index){
        let q = [...props.questions]
        q[index].question_type = value
        props.setComplexQuestion(q)
    }
    function onContentChange(value, index){
        let q = [...props.questions]
        q[index].content = value
        props.setComplexQuestion(q)
    }
    function setOptions(value, index){
        let q = [...props.questions]
        q[index].options = value
        props.setComplexQuestion(q)
    }
    return (
        <>
            {props.questions.map((q, index) => {
                return(
                    <>
                    <strong>Câu {index+1}</strong>
                    <Grid container spacing={2}  >
                        
                        <Grid item md={1}>
                            <ControlPointIcon key={'add' + index} onClick={(e) => {
                                e.preventDefault()
                                let opt = [...props.questions]
                                opt.splice(index+1, 0 , {content: '', statement: '',question_type: '', options: [{
                                    content: '', weight: 0, set: ''    
                                    }],},)
                                props.setComplexQuestion(opt)
                            }
                                
                            } style={{cursor: 'pointer',marginTop: '7px',}}/>
                            <RemoveCircleOutline key={'remove' + index} style={{marginLeft: '12px', marginTop: '7px',cursor: 'pointer'}}
                                onClick={(e) => {
                                    e.preventDefault()
                                    let opt = [...props.questions]
                                    if(opt.length > 1){
                                        opt.splice(index, 1)
                                    }
                                    props.setComplexQuestion(opt)
                                }}
                            />
                        </Grid>
                        <Grid md={11} xs={12} className="question-detail"> 
                            
                            <div className="single-question-root">
                                
                                <Grid container spacing={2}>
                                    
                                    <Grid item md={8}>
                                        <TextField
                                            className="question-statement"
                                            label="Câu hỏi"
                                            variant="outlined" 
                                            size="small"
                                            name="title"
                                            value = {q.statement}
                                            fullWidth
                                            onChange = {event => onStatementChange(event.target.value, index)}
                                        />
                                    </Grid>
                                    <Grid item md={4}>
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel htmlFor="ougtlined-age-native-simple">Loại câu hỏi</InputLabel>
                                            <Select
                                                native
                                                value={q.question_type}
                                                onChange={event => onQuestionTypeChange(event.target.value, index)}
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
                                    data= {q.content}
                                    onReady={editor => {
                                        // You can store the "editor" and use when it is needed.
                                        // console.log( 'Editor is ready to use!', editor );
                                        editor.setData( q.content );

                                    }}
                                    onChange={ ( event, editor ) => {
                                        onContentChange(editor.getData(), index)
                                    } }
                                />
                                {/* <Latex displayMode={true}>{content}</Latex>
                                <Latex>{content}</Latex> */}
                                <hr/>
                                {q.question_type == 'mc' ? (
                                    <Mcq id={props.id} options={q.options} setComplexOptions={setOptions} type="complex" index={index}/>
                                ): q.question_type == 'fib' ? (
                                    <Fib id={props.id} options={q.options} setComplexOptions={setOptions} index={index}/>
                                ): q.question_type == 'complex' ? (
                                    ''
                                ):''}
                            </div>
                        </Grid>
                    </Grid></>    

                )
            })}
        </>    
        
    )
}
export default ComplexQuestion