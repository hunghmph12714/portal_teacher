import React, {useState, useEffect} from 'react'
import './DialogQuiz.scss'
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-vee-final/build/ckeditor';
import Button from '@material-ui/core/Button';
import {useSnackbar} from 'notistack';

const option_label = ['A', 'B', 'C', 'D'];

const DialogQuiz = (props) => {
    const {enqueueSnackbar} = useSnackbar();

    const [quiz, setQuiz] = useState({})
    const [questions, setQuestions] = useState([])
    const [ packageQuiz, setPackageQuiz] = useState([])
    const [current_package, setCurrentPackage] = useState('')
   
    useEffect(() => {
        axios.post('/event/attempt', {ss_id: props.ss_id})
            .then(response => {
                let questions = response.data.questions.map((q, index) => {
                    // q.content = q.content.replace('<p></p>', '<br/>').replace('<p>', '').replace('</p>', '')
                  
                    if(q.question_type == 'fib'){
                        q.content = q.content.split('!@#')
                        q.content = q.content.map(qe => {
                            let i = qe.replace('<p>', '').replace('</p>', '')
                            return i
                        })
                    // }
                    // let local_questions = JSON.parse(window.localStorage.getItem('questions'))
                    // if(local_questions){
                    //     return {...q, a_fib: local_questions[index].a_fib, a_essay: local_questions[index].a_essay, a_option: local_questions[index].a_option, done: local_questions[index].done}
                    // }else
                    // return {...q, a_fib: [], a_option: '', a_essay: '', done: false}
                    return q}
                })
                setCurrentPackage(response.data.packages[0]['subject'])
                setQuestions(questions)
                setPackageQuiz(response.data.packages)
                setQuiz(response.data.quiz)
            })
    }, [props.ss_id])


    
    function handlePackageChange(subject){
        if(subject != current_package){
            setCurrentPackage(subject)
            let pq = [...packageQuiz]
            pq = pq.map(a => {
                if(a.subject == subject){
                    return {...a, active: true}
                }else{
                    return {...a, active: false}
                }
            })
            setPackageQuiz(pq)
        }
        
    }
    function handleSubmit(e){
        e.preventDefault()
        axios.post(baseUrl + 'quiz/finish', {quiz: quiz, questions: questions, ss_id: props.match.params.ss_id},{
            headers: {
                Accept:	'application/json',
                Authorization: 'Bearer '+ user.token
            }
        })
            .then(response => { 
                enqueueSnackbar('Nộp bài thành công', {variant: 'success'})
                props.history.push('/')
                
            })
            .catch(err => {

            })
    }
    return(
        <Dialog open={props.open} onClose={props.handleCloseDialog} fullScreen>
            <div className='quiz-counter'>

                <h4>Tổng số câu hỏi: {questions.length}</h4>
                {packageQuiz.map((pq, index) => {
                return(
                    <Button variant='outlined' className={pq.active ? 'subject-btn active' : 'subject-btn'} 
                        onClick = {() => handlePackageChange(pq.subject)}
                        fullWidth>{pq.subject} - {pq.question_number} Câu
                    </Button>
                    )
                })}
                <ul>
                    {questions.map((q, i) => {
                        if(q.domain == current_package){
                // setCountDone(c)
                            return(
                                <li onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById('cau-'+i).scrollIntoView()}}>
                                    {q.done ? (<span className='done'> {q.s_index} </span>) : (<span> {q.s_index} </span>)}
                                    
                                </li>
                            )
                        }
                        
                    })}
                </ul>
            </div>

            <div className='quiz-content'>
            <Grid container spacing={2} className='quiz-main-content'>
                <Grid item md={10} sm={12} className="quiz-questions">
                    {questions.map((q, i)=> {
                        
                        if(q.domain == current_package){
                            return(
                                
                                <div style={{marginBottom: '15px'}}>
                                    
                                    <Grid container spacing={2}>
                                            {q.complex == 'sub' && q.main_content ? (
                                                <Grid item md={12} id={'cau-'+i}>
                                                    <b>{q.main_statement}</b>
                                                    <div>{ReactHtmlParser(q.main_content)}</div>

                                                </Grid>
                                                
                                            ): ''}
                                    
                                        
                                        <Grid item md={1} id={'cau-'+i}>
                                            <b>Câu {q.s_index}.</b>
                                        </Grid>
                                        <Grid item md={11}>
                                            {q.statement}
                                            {/* <br></br> */}
                                            {(q.question_type == 'fib') ? (
                                                q.content.map((c, index) => {return (
                                                    <>
                                                        {ReactHtmlParser(c)}
                                                        {(index == q.content.length -1) ? '': 
                                                        <TextField variant="outlined"  
                                                            // onChange={(e) => onFibChange(e, i, index)}
                                                            size='small'
                                                            fullWidth
                                                            value={q.a_fib[index]}
                                                        />}
                                                    </>
                                                    )})
                                            ): ReactHtmlParser(q.content)}
                                            {(q.question_type == 'mc') ? (
                                                <div className='options'>
                                                    {q.options.map((o, oi) => {
                                                        return(
                                                            <div className="ckb">
                                                                <label>
                                                                    <input type="radio" 
                                                                        name={q.id} 
                                                                        id={o.id}
                                                                        checked={q.a_option == o.id}
                                                                        // onChange={(e) => onMcqChange(e, i, o.id)}
                                                                    />
                                                                    <div className={q.a_option == o.id ? 'answer active':"answer" }>
                                                                        <b>{option_label[oi]}.</b> 
                                                                    </div>
                                                                    <div className={q.a_option == o.id ? "option-name fadein active":"option-name fadein" } >
                                                                        {ReactHtmlParser(o.content)}
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ):''}
                                            {(q.question_type == 'essay') ? (
                                                <CKEditor
                                                    editor={ ClassicEditor }
                                                    config={{
                                                        toolbar: {
                                                            items: [
                                                                'imageUpload',    
                                                            ]
                                                        },
                                                        placeholder: '↑ Up ảnh bài làm hoặc đánh máy tại đây.'
                                                    }}
                                                    data={q.a_essay}
                                                    onChange={ ( event, editor ) => {
                                                        const data = editor.getData();
                                                        // onEssayChange(data, i)
                                                    }}
                                                />
                                            ):''}
                                            
                                        </Grid>
                                    </Grid>
                                </div>
                            )
                        }
                        
                    })}
                </Grid>
                <Grid item md={2} sm = {12}>

                </Grid>
            </Grid>
            </div>
            
            
        </Dialog>
    )
}
export default DialogQuiz