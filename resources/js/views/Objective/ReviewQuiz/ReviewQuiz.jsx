import React, {useState, useEffect} from 'react'
import './ReviewQuiz.scss'
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-vee-final/build/ckeditor';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import {useSnackbar} from 'notistack';
import DoneIcon from '@material-ui/icons/Done';
import FaceIcon from '@material-ui/icons/Face';

const option_label = ['A', 'B', 'C', 'D'];
const question_level = {'NB': 1, 'TH': 2, 'VDT': 3, 'VDC': 4}
const ReviewQuiz = (props) => {
    const {enqueueSnackbar} = useSnackbar();

    const [quiz, setQuiz] = useState({})
    const [questions, setQuestions] = useState([])
    const [ packageQuiz, setPackageQuiz] = useState([])
    const [current_package, setCurrentPackage] = useState('')
    const [criterias, setCriterias] = useState([])
    const [removed_criterias, setRemovedCriterias] = useState([])
    const [student, setStudent] = useState({})
    const [upload, setUpload] = useState([])
    useEffect(() => {
        axios.post('/event/show-check-quiz', {quiz_code: props.quiz_code})
            .then(response => {
                let questions = response.data.questions.map((q, index) => {
                  
                    if(q.question_type == 'fib'){
                        q.content = q.content.split('!@#')
                        q.content = q.content.map(qe => {
                            let i = qe.replace('<p>', '').replace('</p>', '')

                            return i
                        })
                    }
                    return q
                    
                })
                setCurrentPackage(response.data.packages[0]['subject'])
                setQuestions(questions)
                setPackageQuiz(response.data.packages)
                setQuiz(response.data.quiz)
                setCriterias(response.data.criterias)
                // setStudent(response.data.student)
                // setUpload(response.data.upload)
            })
    }, [props.open])
    function handleCorrectionUpload(files){
        let fd = new FormData()
        fd.append('correction_upload', files[0], files[0].name)
        
        fd.append('attempt_id', quiz.attempt_id)

        axios.post('/attempt/upload-correction', fd)
            .then(response => {
                
            })
            .catch(err => [
                console.log(err)
            ])
    }
    function addCriteria(){
        setCriterias([...criterias, {content: '', title: '', domain: current_package, id: -1}])
    }
    function deleteCriteria(index){
        let c = [...criterias]
        if(c[index].id != -1){
            setRemovedCriterias([...removed_criterias, c[index]])
        }
        c.splice(index, 1);
        setCriterias(c)
    }
    function onTitleCriteriaChange(event, index){
        let c = [...criterias]
        c[index].title = event.target.value
        setCriterias(c)
    }
    function onContentCriteriaChange(index, value){
        let c = [...criterias]
        c[index].content = value
        setCriterias(c)
    }
    function onScoreChange(e, i){
        let q = [...questions]
        q[i].score = e.target.value
        setQuestions(q)
    }
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
        axios.post('/event/mark', {criterias: criterias, questions: questions, 
                removed_criterias: removed_criterias, attempt_id: quiz.attempt_id})
            .then(response => { 
                enqueueSnackbar('Lưu thành công', {variant: 'success'})
                setCriterias(response.data)
                setRemovedCriterias([])
            })
            .catch(err => {
                enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'})
            })
    }
    return(
        <Dialog 
            open={props.open} 
            onClose={props.handleCloseQuiz}
            maxWidth="lg"
        >
            <Grid container spacing={2}>
                <Grid item md={12}>
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
                </div>
                </Grid>
                

            </Grid>
            

            <div className='quiz-content'>

            
            <Grid container spacing={2} className='quiz-main-content'>
                <Grid item md={12} sm={12} >
                    {questions.map((q, i)=> {
                        
                        if(q.domain == current_package){
                            return(
                                <Grid container spacing={5} className='single-question'>
                                    <Grid item md={8} className="quiz-questions">
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
                                                                // value={q.a_fib[index]}
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
                                                                            // checked={q.a_option == o.id}
                                                                            // onChange={(e) => onMcqChange(e, i, o.id)}
                                                                        />
                                                                        <div>
                                                                            <b>{option_label[oi]}.</b> 
                                                                        </div>
                                                                        <div>
                                                                            {ReactHtmlParser(o.content)}
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ):''}
                                                {(q.question_type == 'essay') ? (
                                                    <div className="essay"></div>
                                                ):''}
                                                
                                            </Grid>
                                        </Grid>

                                    </div>
                                    </Grid>
                                    <Grid item md={4} className="quiz-comments">
                                        <Grid container spacing={3}>
                                            <Grid item md={8}>
                                                <h6>Kiến thức liên quan</h6>
                                                {q.topics.map(t => {
                                                    return(
                                                        <Chip variant="outlined" 
                                                            color="secondary"
                                                            label={t.title}
                                                            style={{marginRight: '5px'}}
                                                        />
                                                    )
                                                })}
                                            </Grid>
                                            <Grid item md={4}>
                                                <h6>Độ khó</h6>
                                                <Rating name="customized-10" defaultValue={question_level[q.question_level]} max={4} readOnly/>
                                            </Grid>
                                            
                                            
                                            
                                        </Grid>

                                    </Grid>
                                </Grid>
                                
                            )
                        }
                        
                    })}

                </Grid>
            </Grid>
            
            
            </div>
            
        </Dialog>
    )
}
export default ReviewQuiz