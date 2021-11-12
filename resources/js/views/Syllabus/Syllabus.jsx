import React, {useState, useEffect} from 'react'
import {
    Grid,
    Paper,
    TextField, FormControl, InputLabel, Select, FormControlLabel,
    Switch, FormGroup, Button,
    AccordionDetails, Accordion, AccordionSummary,
    
} from '@material-ui/core'
// import TreeView from '@material-ui/lab/TreeView';
// import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5vee/build/ckeditor';
import axios from 'axios';
import './Syllabus.scss'
import { useSnackbar } from 'notistack'
// const renderTree = (nodes) => {
//     <TreeItem key={nodes.title} nodeId={nodes.title} label={nodes.title}>
//       {Array.isArray(nodes.subjects)
//         ? nodes.subjects.map((node) => renderTree(node))
//         : null}
//       {Array.isArray(nodes.topics)
//         ? nodes.topics.map((node) => renderTree(node))
//         : null}  
//     </TreeItem>
// }
var id_global = 0;
const Syllabus = (props) => {
    const [syllabus, setSyllabus] = useState(null)
    const [current, setCurrent] = useState({chapter: '', subject: ''})
    const [chapters, setChapters] = useState([])
    const [mode, setMode] = useState('create')
    const {enqueueSnackbar} = useSnackbar()
    useEffect(()=> {
        if(props.match.params.id && props.match.params.id !== 'tao-moi'){
            
            async function fetchData(){
                let response = await axios.post('/syllabus/get', {id: props.match.params.id})
                let data = await response.data
                setChapters(data.chapters)
                setSyllabus(preSyllabus => ({
                    title: data.title,
                    grade: data.grade,
                    subject: data.subject,
                    public: data.public,
                    id: data.id,
                    description: data.description
                }))
                // setSyllabus({...syllabus, description: data.description})
                setMode('edit')
            }
            fetchData()
        }else{
            setSyllabus({
                title: '',
                grade: '',
                subject: '',
                public: false,
                id: null,
            })
        }
    }, [])
    function onChange(event){
        setSyllabus({...syllabus, [event.target.name]: event.target.value })
    }
    function onPublicChange(event){
        setSyllabus({...syllabus, public: event.target.checked})
    }
    function submitSyllabus(){
        axios.post('/syllabus/create', {...syllabus, chapters})
            .then(response => {
                enqueueSnackbar('Tạo mới thành công', {variant : 'success'})
                setChapters(response.data.chapters)
                setSyllabus({
                    title: response.data.title,
                    grade: response.data.grade,
                    subject: response.data.subject,
                    description: response.data.description,
                    public: response.data.public,
                    id: response.data.id,
                })
                setMode('edit')
                props.history.push('/khoa-hoc/'+response.data.id)
            })
            .catch(err => {
                enqueueSnackbar('Có lỗi xảy ra', {variant : 'error'})
            })
    }
    function submitEdit(){
        axios.post('/syllabus/edit', {...syllabus, chapters})
            .then(response => {
                enqueueSnackbar('Sửa thành công', {variant : 'success'})
                setChapters(response.data.chapters)
                setSyllabus({
                    title: response.data.title,
                    grade: response.data.grade,
                    subject: response.data.subject,
                    description: response.data.description,
                    public: response.data.public,
                    id: response.data.id,
                })
            })
            .catch(err => {
                
            })
    }
    function addChapter(){
        setChapters([...chapters, {
            title: '',
            subjects: [
                {
                    title: '',
                    topics: [{
                        title: '',
                        content: '',
                    }]
                }
            ]
        }])

    }
    function onChapterChange(event, index){
        let tmp_chapter = [...chapters]
        tmp_chapter[index][event.target.name] = event.target.value
        setChapters(tmp_chapter)
    }
    function deleteChapter(index){
        let tmp_chapter = [...chapters]        
        tmp_chapter = tmp_chapter.filter((c, i) => {
            if( i === index && c.id){
                axios.post('/syllabus/delete-chapter', {chapter_id: c.id})
            }
            return i !== index
        })
        setChapters(tmp_chapter)
        enqueueSnackbar('Xoá thành công', {variant : 'success'})

    }
    function addSubject(index){
        let tmp_chapter = [...chapters]
        tmp_chapter[index].subjects = [...tmp_chapter[index].subjects, {
            title:'',
            topics: [{
                title: '',
                content: '',
            }]
        }]
        setChapters(tmp_chapter)
    }
    function deleteSubject(index, s_index){
        let tmp_chapter = [...chapters]
        tmp_chapter = tmp_chapter.map((c,i) => {
            if(i == index) {
                let tmp_subject = [...c.subjects]
                tmp_subject = tmp_subject.filter((s,j) => {
                    if( j === s_index && s.id){
                        axios.post('/chapter/delete-subject', {subject_id: s.id})
                    }
                    return j !== s_index
                })
                return {...c, subjects: tmp_subject}
            }else return c
        })
        setChapters(tmp_chapter)
        enqueueSnackbar('Xoá thành công', {variant : 'success'})

    }
    function addTopic(index, s_index){
        let tmp_chapter = [...chapters]
        tmp_chapter[index].subjects[s_index].topics = [...tmp_chapter[index].subjects[s_index].topics, {title: '', content: ''}]
        setChapters(tmp_chapter)
    }
    function onSubjectChange(event, index, s_index){
        let tmp_chapter = [...chapters]
        tmp_chapter[index].subjects[s_index].title = event.target.value
        setChapters(tmp_chapter)
    }
    function onTopicChange(event, index, s_index, t_index){
        let tmp_chapter = [...chapters]
        tmp_chapter[index].subjects[s_index].topics[t_index].title = event.target.value
        setChapters(tmp_chapter)
    }
    function deleteTopic(index, s_index, t_index){
        let tmp_chapter = [...chapters]
        tmp_chapter = tmp_chapter.map((c,i) => {
            if(i == index) {
                let tmp_subject = [...c.subjects]
                tmp_subject = tmp_subject.map((s, j) => {
                    if(j == s_index){
                        let tmp_topic = [...s.topics]
                        tmp_topic = tmp_topic.filter((t, k) => {
                            if( t === t_index && t.id ){
                                axios.post('/subject/delete-topic', {id: t.id})
                            }
                            return k !== t_index
                        })
                        return {...s, topics: tmp_topic}
                    }else return s
                })
                return {...c, subjects: tmp_subject}
            }else return c
        })
        setChapters(tmp_chapter)
        enqueueSnackbar('Xoá thành công', {variant : 'success'})

    }
    return(
        <div className="syllabus-root">
            <Grid container spacing={2}>
                <Grid item md={9}>
                    {syllabus ? (
                        <Paper>
                            <div className="syllabus-content">
                                {mode == "create" ? <h4>Tạo mới khoá học</h4> : <h4>Chỉnh sửa khoá học </h4>}
                                <TextField 
                                    className="syllabus-title"
                                    label="Tên khoá học" 
                                    variant="outlined" 
                                    size="small"
                                    name="title"
                                    fullWidth
                                    value = {syllabus.title}
                                    onChange = {onChange}
                                />
                                <Grid container spacing={2}>
                                    <Grid item md={4}> 
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel htmlFor="grade">Khối(*)</InputLabel>
                                            <Select
                                                native
                                                value={syllabus.grade}
                                                onChange={onChange}
                                                name="grade"
                                                label="Khối(*)"
                                            >
                                                <option aria-label="None" value="" />
                                                <option value={1}>Lớp 1</option>
                                                <option value={2}>Lớp 2</option>
                                                <option value={3}>Lớp 3</option>
                                                <option value={4}>Lớp 4</option>
                                                <option value={5}>Lớp 5</option>
                                                <option value={6}>Lớp 6</option>
                                                <option value={7}>Lớp 7</option>
                                                <option value={8}>Lớp 8</option>
                                                <option value={9}>Lớp 9</option>
                                                <option value={10}>Lớp 10</option>
                                                <option value={11}>Lớp 11</option>
                                                <option value={12}>Lớp 12</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4}>
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel htmlFor="grade">Bộ môn(*)</InputLabel>
                                            <Select
                                                native
                                                value={syllabus.subject}
                                                onChange={onChange}
                                                name="subject"
                                                label="Bộ môn(*)"
                                            >
                                                <option aria-label="None" value="" />
                                                <option value={'Toán'}>Toán </option>
                                                <option value={'Tiếng Việt'}>Tiếng Việt</option>
                                                <option value={'Tiếng Anh'}>Tiếng Anh</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4}>
                                        <FormGroup>
                                            <FormControlLabel control={
                                                <Switch
                                                    checked={syllabus.public}
                                                    onChange={onPublicChange}
                                                />} 
                                                label="Công khai khoá học" 
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
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
                                                'redo'
                                            ]
                                        },
                                        }}
                                    data= {(syllabus.description) ? syllabus.description : ''}
                                    onReady={editor => {
                                        // You can store the "editor" and use when it is needed.
                                        // console.log( 'Editor is ready to use!', editor );
                                        }}
                                    onChange={ ( event, editor ) => {
                                        setSyllabus({...syllabus, description: editor.getData()})
                                    }}
                                />
                            </div>
                            
                        </Paper>
                    ):(
                        ''
                    )}
                    {chapters.map((c, index) => 
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-label="Expand"
                                aria-controls="additional-actions1-content"
                                id="additional-actions1-header"
                            >
                                <div onClick={e => {e.stopPropagation()}} className="chapter-content">
                                    <span style={{marginRight: '10px'}}> <strong> Chuơng {index+1}: </strong></span>
                                    <TextField 
                                        className="chapter-title"
                                        label="Tên chương" 
                                        variant="outlined" 
                                        size="small"
                                        name="title"
                                        value = {c.title}
                                        onChange = {event => onChapterChange(event, index)}
                                    />
                                    <div
                                        onClick={() => {
                                            if(confirm('Xoá chương ra khỏi khoá học ?') ) deleteChapter(index)
                                        }}
                                        className = 'chapter-action-btn action-btn'
                                    >
                                        <DeleteForeverIcon />
                                        <span>Xoá chương</span>
                                    </div>
                                    <div
                                        onClick={() => {
                                            addSubject(index)
                                        }}
                                        className = 'chapter-action-btn action-btn'
                                    >
                                        <AddIcon />
                                        <span>Thêm chủ đề</span>
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails> 
                                
                                <Grid container spacing={2}>
                                    <Grid md={12} className="test">
                                        {c.subjects.map((s, s_index) => 
                                            <Accordion> 
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-label="Expand"
                                                    aria-controls="additional-actions1-content"
                                                > 
                                                    <div className="subject-content" onClick={e => {e.stopPropagation()}}> 
                                                        <b style={{marginRight: '10px'}}>Chủ đề {s_index+1}: </b>
                                                        <TextField 
                                                            className="subject-title"
                                                            label="Tên chủ đề" 
                                                            variant="outlined"
                                                            size="small"
                                                            name="title"
                                                            value={s.title}
                                                            onChange={event => onSubjectChange(event, index, s_index)}
                                                            onFocus = { () => {
                                                                setCurrent({
                                                                    chapter: index+1 +': '+ c.title,
                                                                    subject: ''
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if(confirm('Xoá chủ đề ra khỏi chương ?') ) deleteSubject(index, s_index)
                                                        }}
                                                        className = 'chapter-action-btn action-btn'
                                                    >
                                                        <DeleteForeverIcon />
                                                        <span>Xoá chủ đề</span>
                                                    </div>
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            addTopic(index, s_index)
                                                        }}
                                                        className = 'chapter-action-btn action-btn'
                                                    >
                                                        <AddIcon />
                                                        <span>Thêm bài</span>
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={2}>
                                                        {s.topics.map((t, t_index) => 
                                                            <>
                                                            <Grid item md={12} className="topic-root">
                                                                <div style={{marginRight: '20px'}} className="topic-content">
                                                                    <span style={{marginRight: '10px'}}> <b>Bài {t_index + 1}:</b> </span>
                                                                    <TextField 
                                                                        className="topic-title"
                                                                        label="Tên bài"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        name="title"
                                                                        value={t.title}
                                                                        onChange={event => onTopicChange(event, index, s_index, t_index)}
                                                                        onFocus = { () => {
                                                                            setCurrent({
                                                                                chapter: index+1 +': '+ c.title,
                                                                                subject: s_index+1 +': '+ s.title
                                                                            })
                                                                        }}
                                                                    />
                                                                    <div
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            if(confirm('Xoá bài '+ t.title +' ?') ) deleteTopic(index, s_index, t_index)
                                                                        }}
                                                                        onFocus = { () => {
                                                                        setCurrent({
                                                                            chapter: index+1 +': '+ c.title,
                                                                            subject: s_index+1 +': '+ s.title
                                                                        })
                                                                    }}
                                                                        className = 'chapter-action-btn action-btn'
                                                                    >
                                                                        <DeleteForeverIcon />
                                                                        <span>Xoá bài</span>
                                                                    </div>
                                                                </div>
                                                                
                                                            </Grid>
                                                            <div className="topic-description">
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
                                                                            ]
                                                                        },
                                                                    }}
                                                                    data= {(t.content) ? t.content : ''}
                                                                    onReady={editor => {
                                                                        // You can store the "editor" and use when it is needed.
                                                                        // console.log( 'Editor is ready to use!', editor );
                                                                        }}
                                                                    onChange={ ( event, editor ) => {
                                                                        let tmp_chapter = [...chapters]
                                                                        tmp_chapter[index].subjects[s_index].topics[t_index].content = editor.getData()
                                                                        setChapters(tmp_chapter)
                                                                    }}
                                                                    onFocus = { () => {
                                                                        setCurrent({
                                                                            chapter: index+1 +': '+ c.title,
                                                                            subject: s_index+1 +': '+ s.title
                                                                        })
                                                                    }}
                                                                />
                                                            </div>
                                                        </>)}
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                        
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </Grid>
                <Grid item md={3}> 
                    <Paper className="syllabus-action-paper">
                        <div className="syllabus-action">
                            <Button className="chapter-add-btn" variant="outlined" color="primary" fullWidth onClick={addChapter}> 
                                Chương mới
                            </Button>
                            <Button className="chapter-add-btn" variant="outlined" color="primary" fullWidth onClick={addChapter}> 
                                Tải lên giáo án
                            </Button>
                            {mode == 'create' ? (
                                <Button className="syllabus-submit" variant="outlined" color="primary" fullWidth onClick={submitSyllabus}> 
                                    Xuất bản
                                </Button>
                            ):(
                                <Button className="syllabus-submit" variant="outlined" color="primary" fullWidth onClick={submitEdit}> 
                                    Lưu
                                </Button>
                            )}
                            {/* <TreeView
                                aria-label="rich object"
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpanded={['root']}
                                defaultExpandIcon={<ChevronRightIcon />}
                            >
                                {renderTree(chapters)}
                            </TreeView> */}
                            {(current.chapter !== '' && current.subject !== '') ? (
                                <div className="where-am-i">
                                <span className="header">Bạn đang ở đây: </span><br/>
                                <span className="chapter">
                                    <i>{(current.chapter !== '') ? 'Chương '+ current.chapter : ''}</i>
                                </span>
                                <br/>
                                <span className="subject"><i>{(current.subject !== '') ? 'Chủ đề '+ current.subject : ''}</i></span>
                            </div>
                            ): ''}
                            
                        </div>
                        
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
export default Syllabus