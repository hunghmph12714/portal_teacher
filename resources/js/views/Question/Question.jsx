import React, {useState, useEffect} from 'react'
import './Question.scss'
import {SingleQuestion} from './SingleQuestion'
import axios from 'axios'

import {Grid,
    FormControl, InputLabel, Button
    } from '@material-ui/core'
import Select from 'react-select'
import { useSnackbar } from 'notistack'
const domain_options = [
    {value: 'Toán', label: 'Toán'}, {value: 'Tiếng Việt', label: 'Tiếng Việt/ Văn học'},
    {value: 'Anh', label: 'Tiếng Anh'}, {value: 'Lý', label: 'Lý'},
    {value: 'Hoá', label: 'Hoá'},
]
const grade_options  = [
    {value: '1', label: '1'}, {value: '2', label: '2'},
    {value: '3', label: '3'}, {value: '4', label: '4'},
    {value: '5', label: '5'}, {value: '6', label: '6'},
    {value: '7', label: '7'}, {value: '8', label: '8'},
    {value: '9', label: '9'}, {value: '10', label: '10'},
    {value: '11', label: '11'}, {value: '12', label: '12'},
]
const groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
};
const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};
const formatGroupLabel = (data) => (
    <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
);

const Question = (props) =>{
    const {enqueueSnackbar} = useSnackbar()
    const [config, setConfig] = useState([])
    const [syllabus_opt, setSyllabusOpt] = useState([])
    const [topic_opt, setTopicOpt] = useState([])
    const [questions, setQuestions] = useState([{id: 'tmp_1'}])
    useEffect(() => {
        setConfig({
            domain: null,
            grade: null,
            syllabus: null,
            topics: [],
        })
    },[])
    useEffect(() => {
        fetchSyllabus()
    }, [config.domain, config.grade])
    useEffect(() => {
        fetchTopic()
    }, [config.syllabus])
    function fetchTopic(){
        if(config.syllabus){
            axios.post('/question/fetch-topic', {syllabus: config.syllabus})
                .then(response => {
                    console.log(response.data)
                    setTopicOpt(response.data)
                })
                .catch(err => {

                })
        }
    }
    function fetchSyllabus(){
        if(config.domain && config.grade){
            axios.post('/question/fetch-syllabus', {domain: config.domain, grade: config.grade})
                .then(response => {
                    setSyllabusOpt(response.data.map(r => {return {value: r.id, label: r.title}}))
                })
                .catch(err => {
                    
                })
        }
        
    }
    function onDomainChange(event){
        setConfig({...config, domain: event, syllabus: null})
    }
    function onGradeChange(event){
        setConfig({...config, grade: event, syllabus: null})
        
    }
    function onSyllabusChange(event){
        setConfig({...config, syllabus: event})
    }
    function onTopicChange(event){
        setConfig({...config, topics: event})
    }
    return(
        <div className="question-root">
            <div className="question-action">
                <h3>Thêm bộ câu hỏi </h3>
                {/* <h4>Phân loại câu hỏi</h4> */}
                <Grid container spacing={1}>
                    <Grid item md={2} xs={12}>
                        <Select
                            value={config.domain}
                            onChange={onDomainChange}
                            placeholder="Môn học"
                            name = "domain"
                            options={domain_options}
                        />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <Select
                            value={config.grade}
                            onChange={onGradeChange}
                            name="grade"
                            label="Khối"
                            placeholder="Khối lớp"
                            options={grade_options}
                        />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <Select
                            value={config.syllabus}
                            onChange={onSyllabusChange}
                            name="syllabus"
                            placeholder="Khoá học"
                            options={syllabus_opt}
                        />
                        
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Select
                            isMulti
                            value={config.topics}
                            onChange={onTopicChange}
                            placeholder="Kiến thức liên quan"
                            options={topic_opt}
                            formatGroupLabel={formatGroupLabel}
                        />
                    </Grid>
                </Grid>
            </div>
            {questions.map(q => {
                return(
                    <div className="question-content" key={q.id}>
                        <Grid container spacing={2}  >
                            <Grid md={10} xs={12} className="question-detail"> 
                                <SingleQuestion
                                    topics = {config.topics}
                                    id = {q.id}
                                />
                            </Grid>
                            <Grid md={2} className="question-add" xs={12}>
                                <Button variant="outlined" className="question-btn" color="primary" fullWidth> Thêm câu hỏi </Button>
                                <Button variant="outlined" className="question-btn" color="primary" fullWidth> Lưu bộ câu hỏi </Button>
                            </Grid>
                        </Grid>
                    </div>
                )
            })}
            
        </div>
    )
}

export default Question