import React, {useState, useEffect} from 'react';
import './QuestionList.scss'
import Select from 'react-select'

import {Grid,
    FormControl, InputLabel, Button
    } from '@material-ui/core'
// import {QuestionDialog} from './components';
import MaterialTable from "material-table";
import axios from 'axios'
import Chip from '@material-ui/core/Chip';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {PreviewQuestion} from '../Question/SingleQuestion'
import EditIcon from '@material-ui/icons/Edit';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useSnackbar } from 'notistack';
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
const QuestionList = (props) => {
    const columns = [
        { title: 'Đề bài', field: 'content' ,
        render: rowData => {
            return <div>{ReactHtmlParser(rowData.content)}</div>
        },
        width: 500,
        },
        { title: 'Môn', field: 'domain' },
        { title: 'Khối', field: 'grade' },
        { title: 'Dạng bài', field: 'question_type',
            lookup: { 'mc':'TN', 'fib':'ĐVCT', 'essay':'TL'},
        },
        { title: 'Độ khó', field: 'question_level',
            // lookup: { 'mc':'TN', 'fib':'ĐVCT', 'essay':'TL'},
        },
        { title: 'Chủ đề', field: 'topics', 
            render: rowData => {
                return (<span>
                    {rowData.topics.map(topic => {
                        return (<Chip style={{margin: '3px'}} color="secondary" size="small" label={topic.title} clickable/>)
                    })}
                </span>)
            }
        },
        { title: 'Mục tiêu', field: 'objectives', 
            render: rowData => {
                return (<span>
                    {rowData.objectives.map(obj => {
                        return (<Chip style={{margin: '3px'}} color="secondary" size="small" label={obj.content} clickable/>)
                    })}
                </span>)
            }
        },
                

    ];
    const [data, setData] = useState([])
    const [preview_open, setPreviewOpen] = useState(false)
    const [question, setQuestion] = useState({
        content: '',
        options: [],

    })
    const {enqueueSnackbar} = useSnackbar()

    const [config, setConfig] = useState([])
    const [syllabus_opt, setSyllabusOpt] = useState([])
    const [topic_opt, setTopicOpt] = useState([])
    const [objective_opt, setObjectiveOpt] = useState([])
    useEffect(() => {
        setConfig({
            domain: null,
            grade: null,
            syllabus: null,
            topics: [],
            objectives: [],
            level: null,
            
        })
        
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
    useEffect(
        () => {
            fetchQuestion();
        },[])
    function handleOpenPreview(rowData){
        setPreviewOpen(true)
        setQuestion(rowData)
    }
    function handleClosePreview(){
        setPreviewOpen(false)
    }
    function fetchQuestion(){
        axios.post('/questions', {})
            .then(response => {
                setData(response.data);
            })
            .catch(err => {

            })
    }
    function handleEditQuestion(rowData){
        props.history.push('/cau-hoi/sua/'+rowData.id)
    }
    function handleDeactiveQuestion(rowData){
        if(window.confirm('Xoá tạm thời câu hỏi này ? ')){
            axios.post('/question/deactive', {id: rowData.id})
            .then(response => {
                enqueueSnackbar('Deactive thành công', {variant: 'success'})
                let d = [...data]
                d = d.filter(dt => dt.id !== rowData.id)
                setData(d)
            })
            .catch(err => {

            })
        }
        

    }
    function filterQuestion(){
        axios.post('/question/filter', {config: config})
            .then(response => {

            })
            .catch(err => {

            })
    }
    return(
        <div className="root-question">
            <div className="question-action">
                <h4>Lọc câu hỏi</h4>
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
                <Button variant='outlined' color='primary' onClick={() => filterQuestion()} style={{marginTop: '15px'}}>
                    Tìm kiếm câu hỏi</Button>
                
            </div>
            <MaterialTable
                title = "Danh sách câu hỏi"
                columns = {columns}
                data = {data}
                options = {{
                    grouping: false,
                    pageSize: 10,
                    filter: true,
                }}
                // editable={{
                //     onRowAdd: newData => addNewQuestionList(newData) ,
                //     onRowUpdate: (newData, oldData) => editQuestionList(oldData, newData),
                //     onRowDelete: oldData => deleteQuestionList(oldData),
                // }}
                actions = {[
                    {
                        icon: () => <ZoomInIcon />,
                        tooltip: 'Xem trước ',
                        isFreeAction: false,
                        text: 'Xem trước',
                        onClick: (event, rowData) => {
                            handleOpenPreview(rowData)
                        },
                    },
                    {
                        icon: () => <DeleteOutlineIcon />,
                        tooltip: 'Cho vào thùng rác',
                        isFreeAction: false,
                        text: 'Cho vào thùng rác',
                        onClick: (event, rowData) => {
                            handleDeactiveQuestion(rowData)
                        },
                    },
                    {
                        icon: () => <EditIcon />,
                        tooltip: 'Sửa ',
                        isFreeAction: false,
                        text: 'Sửa câu hỏi',
                        onClick: (event, rowData) => {
                            handleEditQuestion(rowData)
                        },
                    },
                    {
                        icon: () => <AddBoxIcon />,
                        tooltip: 'Thêm câu hỏi ',
                        isFreeAction: true,
                        text: 'Thêm câu hỏi',
                        onClick: (event, rowData) => {
                            props.history.push('/cau-hoi/tao-moi')
                        },
                    },
                ]}
                localization={{
                    header: {
                        actions: ''
                    },
                    body: {
                        emptyDataSourceMessage: 'Không tìm thấy Phân câu hỏi',
                        editRow:{
                        deleteText: 'Bạn có chắc muốn xóa dòng này ?',
                        cancelTooltip: 'Đóng',
                        saveTooltip: 'Lưu'
                        },
                        deleteTooltip: "Xóa",
                        addTooltip: "Thêm mới"
                    },
                    toolbar: {
                        searchTooltip: 'Tìm kiếm',
                        searchPlaceholder: 'Tìm kiếm',
                        nRowsSelected: '{0} hàng được chọn'
                    },
                    pagination: {
                        labelRowsSelect: 'dòng',
                        labelDisplayedRows: ' {from}-{to} của {count}',
                        firstTooltip: 'Trang đầu tiên',
                        previousTooltip: 'Trang trước',
                        nextTooltip: 'Trang tiếp theo',
                        lastTooltip: 'Trang cuối cùng'
                    }
                }}
            />
           <PreviewQuestion
                open={preview_open}
                handleCloseDialog={handleClosePreview}
                question={question}
           />
        </div>
    )
}

export default QuestionList
