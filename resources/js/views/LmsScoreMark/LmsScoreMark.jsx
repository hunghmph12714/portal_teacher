import React, {useState, useEffect} from 'react'
import './LmsScoreMark.scss'
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
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DoneIcon from '@material-ui/icons/Done';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FaceIcon from '@material-ui/icons/Face';
import {DropzoneArea} from 'material-ui-dropzone'

const option_label = ['A', 'B', 'C', 'D'];
const question_level = {'NB': 1, 'TH': 2, 'VDT': 3, 'VDC': 4}
const LmsScoreMark = (props) => {
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
        axios.post('/event/attempt', {ss_id: props.match.params.ss_id})
            .then(response => {
                let questions = response.data.questions.map((q, index) => {
                    // q.content = q.content.replace('<p></p>', '<br/>').replace('<p>', '').replace('</p>', '')
                  
                    if(q.question_type == 'fib'){
                        q.content = q.content.split('!@#')
                        q.content = q.content.map(qe => {
                            let i = qe.replace('<p>', '').replace('</p>', '')
                            return i
                        })
                    }
                    // }
                    // let local_questions = JSON.parse(window.localStorage.getItem('questions'))
                    // if(local_questions){
                    //     return {...q, a_fib: local_questions[index].a_fib, a_essay: local_questions[index].a_essay, a_option: local_questions[index].a_option, done: local_questions[index].done}
                    // }else
                    // return {...q, a_fib: [], a_option: '', a_essay: '', done: false}
                    return q
                    
                })
                setCurrentPackage(response.data.packages[0]['subject'])
                setQuestions(questions)
                setPackageQuiz(response.data.packages)
                setQuiz(response.data.quiz)
                setCriterias(response.data.criterias)
                setStudent(response.data.student)
                setUpload(response.data.upload)
            })
    }, [])
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
        <Dialog open={true} fullScreen>
            <Grid container spacing={2}>
                <Grid item md={6}>
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
                <Grid item md={6}>
                    <div className='quiz-student'>
                        <h5>Họ tên Học sinh: </h5> <span>{student.fullname}</span>
                        <h5>Ngày sinh: </h5> <span>{student.dob}</span>
                        <h5>Lớp tại VietElite: </h5> <span>{student.classes}</span>
                    </div>
                </Grid>

            </Grid>
            

            <div className='quiz-content'>

            {upload ? (
                <Grid container spacing={2} className='quiz-main-content'>
                    <Grid item md={12} sm={12} >
                        <h3>Bài làm học sinh tải lên</h3>
                        {upload.map((u, index) => {
                            return (
                                <Chip variant="outlined" 
                                    color="primary" deleteIcon={<DoneIcon />} icon={<FaceIcon />} 
                                    label={'File '+(index+1)}
                                    onClick={()=> window.open("https://api.vietelite.edu.vn/" + u, "_blank")}
                                    style={{marginRight: '5px'}}
                                />
                            )
                        })}
                    </Grid>
                </Grid>
            ):""}
            <Grid container spacing={2} className='quiz-main-content'>
                <Grid item md={12} sm={12} >
                    {questions.map((q, i)=> {
                        
                        if(q.domain == current_package){
                            return(
                                <Grid container spacing={5} className='single-question'>
                                    <Grid item md={7} className="quiz-questions">
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
                                                    <div className="essay">{ReactHtmlParser(q.a_essay)}</div>
                                                ):''}
                                                
                                            </Grid>
                                        </Grid>

                                    </div>
                                    </Grid>
                                    <Grid item md={5} className="quiz-comments">
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
                                            <Grid item md={2}>
                                                <h6>Điểm</h6>
                                                <TextField variant="outlined"  
                                                    size='small'
                                                    // type="number"
                                                    value = {q.score}
                                                    onChange={e => onScoreChange(e, i)}
                                                />
                                            </Grid>
                                            {(q.question_type == 'mc') ? '' : (
                                                <Grid item md={10}>
                                                    <h6>Nhận xét</h6>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        
                                                        data= {q.comment}
                                                        onReady={editor => {
                                                            // You can store the "editor" and use when it is needed.
                                                            // console.log( 'Editor is ready to use!', editor );
                                                            // editor.setData( content );

                                                        }}
                                                        onChange={ ( event, editor ) => {
                                                            // setContent(editor.getData())
                                                            let q = [...questions]
                                                            q[i].comment = editor.getData()
                                                            setQuestions(q)
                                                        } }
                                                    />
                                                </Grid>
                                            )}
                                            
                                            
                                        </Grid>

                                    </Grid>
                                </Grid>
                                
                            )
                        }
                        
                    })}

                </Grid>
            </Grid>
            
            
            </div>
            <Grid container spacing={2}>
                <Grid item md={7}>
                    <div className='quiz-criteria'>
                    <h4>Tiêu chí đánh giá</h4>
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                addCriteria()
                                // if(confirm('Xoá bài '+ t.title +' ?') ) deleteTopic(index, s_index, t_index)
                            }}
                            className = 'criteria-add-btn'
                        >
                            <AddIcon />
                            <span>Thêm tiêu chí</span>
                        </div>

                        {
                            criterias.map((c, index )=> {
                                if(c.domain == current_package){
                                    return(
                                        <div className='criteria-root'>
                                            <Grid item md={12}>
                                                <div style={{marginRight: '20px'}} className="criteria-title">
                                                    {/* <span style={{marginRight: '10px'}}> <b>Tiêu chí {t_index + 1}:</b> </span> */}
                                                    <TextField 
                                                        className="title"
                                                        label="Tên tiêu chí"
                                                        variant="outlined"
                                                        size="small"
                                                        name="title"
                                                        value={c.title}
                                                        onChange={event => onTitleCriteriaChange(event, index)}
                                                        
                                                    />
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if(confirm('Xoá tiêu chí '+ c.title +' ?') ) deleteCriteria(index)
                                                        }}
                                                        className = 'criteria-remove'
                                                    >
                                                        <DeleteForeverIcon />
                                                        <span>Xoá tiêu chí</span>
                                                    </div>
                                                    
                                                </div>
                                                
                                            </Grid>
                                            <div className="criteria-description">
                                            <   TextField 
                                                    label="Nội dung tiêu chí"
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={c.content}
                                                    onChange={event => onContentCriteriaChange(index, event.target.value)}
                                                    
                                                />
                                            </div>
                                        
                                        </div>
                                    )
                                }
                            })
                        }
                        <Button className='submit-btn' variant="outlined" onClick={e => handleSubmit(e)}>Lưu Đánh Giá</Button>

                    </div>
                </Grid>
                <Grid item md={5}>

                    <div className="upload quiz-criteria" id="upload-div">
                        <h4>Tổng điểm : 
                            {questions.filter(q => q.domain == current_package).reduce((sum, b) => sum + parseFloat(b.score || 0) , 0)
                                }
                        
                        </h4>
                        <h4>Tải lên bài chữa</h4>
                        <Chip variant="outlined" 
                            color="primary" deleteIcon={<DoneIcon />} icon={<FaceIcon />} 
                            label={'Bài chữa đã tải lên'}
                            onClick={()=> window.open(  '/'+quiz.correction_upload, "_blank")}
                            style={{marginRight: '5px'}}
                        />
                        <DropzoneArea
                            onChange={(files) => {handleCorrectionUpload(files)}}
                            acceptedFiles = {['application/pdf']}
                            filesLimit = {1}
                            showPreviews={true}
                            previewText="Xem trước"
                            showPreviewsInDropzone={false}
                            previewGridProps={{container: {spacing: 1}, item: {md: 3, xs: 12}}}
                            showAlerts={['error']}
                            onPreviewClick={(event) => console.log(event)}
                            maxFileSize = {10000000}
                            dropzoneText = "Kéo thả bài chữa (Chấp nhận: PDF)"
                        />
                    </div>
                </Grid>

            </Grid>
            
        </Dialog>
    )
}
export default LmsScoreMark