import React, { useState, useEffect } from 'react'
import './QuizConfig.scss'
import { SingleQuizConfig } from './SingleQuizConfig'
import axios from 'axios'
import {
    Grid,
    FormControl, InputLabel, Button, TextField
} from '@material-ui/core'
import Select from 'react-select'
import { useSnackbar } from 'notistack'


const question_type_options = [
    { value: 'essay', label: 'Tự luận' },
    { value: 'mc', label: 'Trắc nghiệm' },
    { value: 'fib', label: 'Điền vào chỗ trống' },
    { value: 'order', label: 'Sắp xếp thứ tự' },
    { value: 'matrix', label: 'Nối đáp án' },
    { value: 'complex', label: 'Câu hỏi phức' },
]
const domain_options = [
    { value: 'Toán', label: 'Toán' }, { value: 'Tiếng Việt', label: 'Tiếng Việt/ Văn học' },
    { value: 'Tiếng Anh', label: 'Tiếng Anh' }, { value: 'Lý', label: 'Lý' },
    { value: 'Hoá', label: 'Hoá' },
]
const grade_options = [
    { value: '1', label: 'Khối 1' }, { value: '2', label: 'Khối 2' },
    { value: '3', label: 'Khối 3' }, { value: '4', label: 'Khối 4' },
    { value: '5', label: 'Khối 5' }, { value: '6', label: 'Khối 6' },
    { value: '7', label: 'Khối 7' }, { value: '8', label: 'Khối 8' },
    { value: '9', label: 'Khối 9' }, { value: '10', label: 'Khối 10' },
    { value: '11', label: 'Khối 11' }, { value: '12', label: 'Khối 12' },
]
const level_options = [
    { value: 'NB', label: 'Nhận biết' },
    { value: 'TH', label: 'Thông hiểu' },
    { value: 'VDT', label: 'Vận dụng thấp' },
    { value: 'VDC', label: 'Vận dụng cao' },
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
    <div style={ groupStyles }>
        <span>{ data.label }</span>
        <span style={ groupBadgeStyles }>{ data.options.length }</span>
    </div>
);

const QuizConfig = (props) => {
    const { enqueueSnackbar } = useSnackbar()
    const [config, setConfig] = useState({
        id: null,
        title: '',
        description: '',
        duration: 0,
        objectives: [],
        grade: null,
    })
    const [objective_opt, setObjectiveOpt] = useState([])
    const [quiz_configs, setQuizConfigs] = useState([{
        quiz_topic: [{ topic: null, level: null, question_type: null, quantity: 0, score: 0 }],
        syllabus: null,
        domain: null,
        syllabus_opt: [],
        topic_opt: [],
        sum_q: 0,
        sum_score: 0,

    }])
    useEffect(() => {
        fetchObjective()
        quiz_configs.forEach((element, index) => {
            fetchSyllabus(index)
        });
    }, [config.grade])
    useEffect(() => {
        if (props.match.params.id) {
            axios.post('/quiz-config/get-id', { id: props.match.params.id })
                .then(response => {
                    let cf = response.data.qc
                    setConfig({
                        id: cf.id,
                        title: cf.title, description: cf.description,
                        duration: cf.duration,
                        objectives: cf.objectives.map(o => { return { label: o.content, value: o.id } }),
                        grade: grade_options.filter(d => d.value == cf.grade)[0],

                    })
                    let qt = response.data.qt
                    setQuizConfigs(qt.map((x, key) => {

                        return {
                            domain: domain_options.filter(d => d.value == x.domain),
                            syllabus: x.syllabus,
                            sum_q: x.sum_q, sum_score: x.sum_score,
                            quiz_topic: x.quiz_topic.map(y => {
                                return {
                                    topic: y.topic,
                                    question_type: question_type_options.filter(q => q.value == y.question_type),
                                    level: level_options.filter(q => q.value == y.level),
                                    quantity: y.quantity, score: y.score,
                                    id: y.id,
                                }
                            })
                        }
                    }))

                })
                .catch(err => {

                })
        }
    }, [])
    function fetchTopic(key) {
        axios.post('/question/fetch-topic', { syllabus: quiz_configs[key].syllabus })
            .then(response => {
                let qc = [...quiz_configs]
                qc[key].topic_opt = response.data
                setQuizConfigs(qc)
            })
            .catch(err => {

            })
    }

    function fetchSyllabus(key) {
        axios.post('/question/fetch-syllabus', { domain: quiz_configs[key].domain, grade: config.grade })
            .then(response => {
                let qc = [...quiz_configs]
                qc[key].syllabus_opt = response.data.map(r => { return { value: r.id, label: r.title } })
                setQuizConfigs(qc)
            })
            .catch(err => {

            })
    }
    function fetchObjective() {
        axios.post('/objective/fetch-by-grade', { grade: config.grade })
            .then(response => {
                setObjectiveOpt(response.data.map(r => { return { value: r.id, label: r.content } }))
            })
            .catch(err => {

            })
    }
    function onDomainChange(event, key) {
        let qc = [...quiz_configs]
        qc[key].domain = event
        setQuizConfigs(qc)
        fetchSyllabus(key)
    }
    function onGradeChange(event) {
        let q = { ...config }
        q.grade = event
        setConfig(q)
    }
    function onSyllabusChange(value, key) {
        let qc = [...quiz_configs]
        qc[key].syllabus = value
        setQuizConfigs(qc)
        fetchTopic(key)
    }
    function onTopicChange(value, key, tkey) {
        let qc = [...quiz_configs]
        qc[key].quiz_topic[tkey].topic = value
        setQuizConfigs(qc)
    }
    function onObjectiveChange(event) {
        setConfig({ ...config, objectives: event })
    }
    function onLevelChange(value, key, tkey) {
        let qc = [...quiz_configs]
        qc[key].quiz_topic[tkey].level = value
        setQuizConfigs(qc)
    }

    function addDomain() {
        let qc = [...quiz_configs]
        qc.push({
            quiz_topic: [{ topic: null, level: null, quantity: 0, score: 0 }],
            syllabus: null,
            domain: null,
            syllabus_opt: [],
            topic_opt: [],
        })
        setQuizConfigs(qc)
    }
    function deleteDomain(key) {
        let qc = [...quiz_configs]
        qc = qc.filter((q, index) => index != key)
        setQuizConfigs(qc)
    }
    function addRow(key) {
        let qc = [...quiz_configs]
        qc[key].quiz_topic.push({ topic: null, level: null, question_type: null, quantity: 0, score: 0 })
        setQuizConfigs(qc)

    }
    function onQuestionTypeChange(value, key, tkey) {
        let qc = [...quiz_configs]
        qc[key].quiz_topic[tkey].question_type = value
        setQuizConfigs(qc)
    }
    function deleteRow(key, tkey) {
        let qc = [...quiz_configs]
        qc[key].quiz_topic = qc[key].quiz_topic.filter((t, index) => index != tkey)
        setQuizConfigs(qc)
    }
    function onSubmit() {
        if (props.match.params.id){
            axios.post('/quiz-config/edit   ', { config: config, quiz_config: quiz_configs })
            .then(response => {

            })
            .catch(err => {

            })
        }else{
            axios.post('/quiz-config   ', { config: config, quiz_config: quiz_configs })
                .then(response => {
                    enqueueSnackbar('Tạo cấu hình thành công', {variant: 'success'})
                })
                .catch(err => {

                })
        }
        
    }
    return (
        <div className="quiz_config-root">
            <div className="quiz_config-action first" >
                <h3 style={ { fontWeight: 'bold' } }>Cấu hình bộ câu hỏi</h3>
                <h4>Thông số bộ câu hỏi</h4>
                <Grid container spacing={ 1 }>
                    <Grid item md={ 6 }>
                        <Grid container spacing={ 1 }>
                            <Grid item md={ 8 }>
                                <TextField
                                    className="config_title config"
                                    label="Tiêu đề"
                                    variant="outlined"
                                    size="small"
                                    name="config_title"
                                    value={ config.title }
                                    fullWidth
                                    onChange={ event => {
                                        setConfig({ ...config, title: event.target.value })
                                    } }
                                />
                            </Grid>
                            <Grid item md={ 4 }>
                                <TextField
                                    className="config_duration config"
                                    label="Thời lượng (phút)"
                                    variant="outlined"
                                    size="small"
                                    name="config_duration"
                                    value={ config.duration }
                                    fullWidth
                                    type='number'
                                    onChange={ event => {
                                        setConfig({ ...config, duration: event.target.value })
                                    } }
                                />

                            </Grid>
                        </Grid>


                        <Grid container spacing={ 1 }>
                            <Grid item md={ 8 }>
                                <TextField
                                    className="config_description config"
                                    label="Miêu tả"
                                    variant="outlined"
                                    size="small"
                                    name="config_description"
                                    value={ config.description }
                                    fullWidth
                                    onChange={ event => {
                                        setConfig({ ...config, description: event.target.value })
                                    } }
                                />
                            </Grid>
                            <Grid item md={ 4 } className="first">
                                <div className='first'>
                                    <Select
                                        value={ config.grade }
                                        onChange={ value => onGradeChange(value) }
                                        name="grade"
                                        label="Khối"
                                        placeholder="Khối"
                                        options={ grade_options }
                                    />
                                </div>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={ 6 }>
                        <Select
                            closeMenuOnSelect={ false }
                            isMulti
                            value={ config.objectives }
                            onChange={ onObjectiveChange }
                            placeholder="Mục tiêu học tập"
                            options={ objective_opt }
                            formatGroupLabel={ formatGroupLabel }
                        />
                        <Button className='btn-add-config' variant="outlined" color="primary" onClick={ () => addDomain() }>
                            Thêm block môn
                        </Button>
                    </Grid>
                </Grid>
            </div>

            { quiz_configs.map((qc, key) => {
                return (
                    <div className="quiz_config-detail">
                        <Grid container spacing={ 1 }>
                            <Grid item md={ 2 } xs={ 12 } className=''>
                                <Select
                                    value={ qc.domain }
                                    onChange={ (event) => onDomainChange(event, key) }
                                    placeholder="Môn học"
                                    name="domain"
                                    options={ domain_options }
                                />
                            </Grid>
                            <Grid item md={ 4 } xs={ 12 } className=''>
                                <Select
                                    value={ qc.syllabus }
                                    onChange={ event => onSyllabusChange(event, key) }
                                    name="syllabus"
                                    placeholder="Khoá học"
                                    options={ qc.syllabus_opt }
                                />

                            </Grid>
                            <Grid item md={ 4 } xs={ 12 } >
                                <Button variant="outlined" color="primary" onClick={ () => addRow(key) }>
                                    Thêm dòng
                                </Button>
                                Tổng số câu: { qc.sum_q } - Tổng điểm: { qc.sum_score }
                            </Grid>
                            <Grid item md={ 2 } xs={ 12 } className=''>
                                <Button variant="outlined" color="red" onClick={ () => deleteDomain(key) } style={ { float: 'right' } }>
                                    Xoá block môn
                                </Button>
                            </Grid>
                        </Grid>
                        <hr />
                        {
                            qc.quiz_topic.map((tp, tkey) => {
                                return (
                                    <Grid container spacing={ 1 } className="quiz_topics">
                                        <Grid item md={ 10 }>
                                            <Grid container spacing={ 2 } >
                                                <Grid item md={ 4 } xs={ 12 }>
                                                    <Select
                                                        value={ tp.topic }
                                                        onChange={ value => onTopicChange(value, key, tkey) }
                                                        placeholder="Kiến thức liên quan"
                                                        options={ qc.topic_opt }
                                                        formatGroupLabel={ formatGroupLabel }
                                                    />
                                                </Grid>
                                                <Grid item md={ 2 } xs={ 12 } className=''>

                                                    <Select
                                                        value={ tp.level }
                                                        onChange={ value => onLevelChange(value, key, tkey) }
                                                        name="level"
                                                        placeholder="Độ khó"
                                                        options={ level_options }
                                                    />
                                                </Grid>
                                                <Grid item md={ 2 } xs={ 12 } className=''>

                                                    <Select
                                                        value={ tp.question_type }
                                                        onChange={ value => onQuestionTypeChange(value, key, tkey) }
                                                        name="question_type"
                                                        placeholder="Loại câu hỏi"
                                                        options={ question_type_options }
                                                    />
                                                </Grid>
                                                <Grid item md={ 2 } xs={ 12 } className=''>

                                                    <TextField
                                                        className="config_quantity config"
                                                        label="Số lượng"
                                                        variant="outlined"
                                                        size="small"
                                                        name="quantity"
                                                        value={ tp.quantity }
                                                        fullWidth
                                                        type='number'
                                                        onChange={ event => {
                                                            let qc = [...quiz_configs]
                                                            qc[key].quiz_topic[tkey].quantity = event.target.value

                                                            //Tong so cau
                                                            qc[key].sum_q = qc[key].quiz_topic.map(a => { return parseInt(a.quantity) }).reduce((a, b) => a + b)
                                                            qc[key].sum_score = qc[key].quiz_topic.map(a => { return parseInt(a.quantity) * a.score }).reduce((a, b) => a + b)
                                                            setQuizConfigs(qc)
                                                        } }

                                                    />
                                                </Grid>
                                                <Grid item md={ 2 } xs={ 12 } className=''>

                                                    <TextField
                                                        className="config_score config"
                                                        label="Số điểm/câu"
                                                        variant="outlined"
                                                        size="small"
                                                        name="score"
                                                        value={ tp.score }
                                                        fullWidth
                                                        type='number'
                                                        onChange={ event => {
                                                            let qc = [...quiz_configs]
                                                            qc[key].quiz_topic[tkey].score = event.target.value

                                                            qc[key].sum_score = qc[key].quiz_topic.map(a => { return parseInt(a.quantity) * a.score }).reduce((a, b) => a + b)
                                                            setQuizConfigs(qc)

                                                        } }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={ 2 }>
                                            <Button variant="outlined" color="red" onClick={ () => deleteRow(key, tkey) } style={ { float: 'right' } }>
                                                Xoá
                                            </Button>
                                        </Grid>
                                    </Grid>

                                )
                            })
                        }

                    </div>)
            }) }

            {/* {quiz_configs.map(q => {
                return(
                    <div className="quiz_config-content" key={q.id}>
                        <h4 style={{margin: '15px 0px'}}>Nội dung câu hỏi</h4>

                        <SingleQuizConfig
                            topics = {config.topics}
                            id = {q.id}
                            config = {config}
                            quiz_config={q}
                        />
                       
                    </div>
                )
            })} */}
            <Button variant='outlined' color='primary' className='btn-save' onClick={ () => onSubmit() }>Lưu cấu hình</Button>
        </div>
    )
}

export default QuizConfig