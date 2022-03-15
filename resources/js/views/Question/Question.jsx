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
    {value: 'Tiếng Anh', label: 'Tiếng Anh'}, {value: 'Lý', label: 'Lý'},
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
const level_options = [
    {value: 'NB', label: 'Nhận biết'},
    {value: 'TH', label: 'Thông hiểu'},
    {value: 'VDT', label: 'Vận dụng thấp'},
    {value: 'VDC', label: 'Vận dụng cao'},
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
    const [objective_opt, setObjectiveOpt] = useState([])
    const [questions, setQuestions] = useState([{id: 'tmp_1'}])
    const [type, setType] = useState('create')
    useEffect(() => {
        setConfig({
            domain: null,
            grade: null,
            syllabus: null,
            topics: [],
            objectives: [],
            level: null,
            
        })
        if(props.match.params.id){
            setType('edit')
            const fetchData = async() => {
                const response = await axios.post('/question/get-single', {id: props.match.params.id})

                let c = {
                    domain: {value: response.data.domain, label: response.data.domain},
                    grade: {value: response.data.grade, label: response.data.grade},
                    syllabus: {value: response.data.syllabus.id, label: response.data.syllabus.title},
                    topics: response.data.topics.map(t => {return {value: t.id, label: t.title}}),
                    objectives: response.data.objectives.map(o => {return {value: o.id, label: o.content}}),
                    level: level_options.filter(o => o.value == response.data.question_level)[0],
                }
                let q = [{
                    id: props.match.params.id,
                    content: response.data.content,
                    statement: response.data.statement,
                    question_type: response.data.question_type,
                    options: response.data.options,
                    hint: response.data.hint
                }]
                setQuestions(q)
                setConfig(c)
            }
            fetchData()
            
        }
    },[])
    useEffect(() => {
        fetchSyllabus()
        fetchObjective()
    }, [config.domain, config.grade])
    useEffect(() => {
        fetchTopic()
    }, [config.syllabus])
    function fetchTopic(){
        if(config.syllabus){
            axios.post('/question/fetch-topic', {syllabus: config.syllabus})
                .then(response => {
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
    function fetchObjective(){
        if(config.grade){
            axios.post('/objective/fetch-by-grade', {grade: config.grade})
                .then(response => {
                    setObjectiveOpt(response.data.map(r => {return {value: r.id, label: r.content}}))
                })
                .catch(err => {

                })
        }
    }
    function onDomainChange(event){
        setConfig({...config, domain: event, syllabus: null})
    }
    function onGradeChange(event){
        setConfig({...config, grade: event, syllabus: null, objectives: []})
        
    }
    function onSyllabusChange(event){
        setConfig({...config, syllabus: event})
    }
    function onTopicChange(event){
        setConfig({...config, topics: event})
    }
    function onObjectiveChange(event){
        setConfig({...config, objectives: event})
    }
    function onLevelChange(event){
        setConfig({...config, level: event})
    }
    
    
    
    return(
        <div className="question-root">
            <div className="question-action">
                <h3 style={{fontWeight: 'bold'}}>Thêm mới câu hỏi </h3>
                <h4>Gắn nhãn</h4>
                <Grid container spacing={1}>
                    <Grid item md={2} xs={12} className='first'>
                        <Select
                            value={config.domain}
                            onChange={onDomainChange}
                            placeholder="Môn học"
                            name = "domain"
                            options={domain_options}
                        />
                    </Grid>
                    <Grid item md={2} xs={12} className='first'>
                        <Select
                            value={config.grade}
                            onChange={onGradeChange}
                            name="grade"
                            label="Khối"
                            placeholder="Khối"
                            options={grade_options}
                        />
                    </Grid>
                    <Grid item md={2} xs={12} className='first'>
                        <Select
                            value={config.syllabus}
                            onChange={onSyllabusChange}
                            name="syllabus"
                            placeholder="Khoá học"
                            options={syllabus_opt}
                        />
                        
                    </Grid>
                    <Grid item md={6} xs={12} className='first'>
                        <Select
                            closeMenuOnSelect= {false}
                            isMulti
                            value={config.topics}
                            onChange={onTopicChange}
                            placeholder="Kiến thức liên quan"
                            options={topic_opt}
                            formatGroupLabel={formatGroupLabel}
                        />
                    </Grid>
                    <Grid item md={2} xs={12} className=''>
                        
                        <Select
                            value={config.level}
                            onChange={onLevelChange}
                            name="level"
                            placeholder="Độ khó"
                            options={level_options}
                        />
                    </Grid>
                    <Grid item md={10} xs={12}> 
                        <Select
                            closeMenuOnSelect= {false}
                            isMulti
                            value={config.objectives}
                            onChange={onObjectiveChange}
                            placeholder="Mục tiêu học tập"
                            options={objective_opt}
                            formatGroupLabel={formatGroupLabel}
                        />  
                    </Grid>

                </Grid>
                
            </div>
            {questions.map(q => {
                return(
                    <div className="question-content" key={q.id}>
                        <h4 style={{margin: '15px 0px'}}>Nội dung câu hỏi</h4>

                        <SingleQuestion
                            topics = {config.topics}
                            id = {q.id}
                            config = {config}
                            question={q}
                            type = {type}
                        />
                       
                    </div>
                )
            })}
            
        </div>
    )
}

export default Question