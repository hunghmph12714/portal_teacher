import React, {useState, useEffect} from 'react';
import './SingleQuizConfig.scss';
import Mcq from './Mcq'
import Fib from './Fib'
import axios from 'axios'
// import CKEditor from 'ckeditor5-vee-math';
// var Latex = require('react-latex');

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor-vee-final/build/ckeditor';
// import {PreviewQuestion} from '.'
import { useSnackbar } from 'notistack';
import {TextField, Button, Grid, Select, FormControl, InputLabel} from '@material-ui/core'

const SingleQuizConfig = (props) => {
    const history = {props}
    const {enqueueSnackbar} = useSnackbar()
    const [content, setContent] = useState('')
    const [statement, setStatement] = useState('')
    const [quiz_config_type, setQuestionType] = useState('')
    const [answer, setAnswer] = useState('')
    const [options, setOptions] = useState([
        {content: '', weight: 0, set: ''},
        {content: '', weight: 0, set: ''},
    ])
    const [preview_open, setPreviewOpen] = useState(false)
    function handleOpenPreview(){
        setPreviewOpen(true)
    }
    function handleClosePreview(){
        setPreviewOpen(false)
    }
    function createQuestion(type){
        axios.post('/quiz_config/create', {
            config: props.config,
            content: content,
            statement: statement,
            quiz_config_type: quiz_config_type,
            answer: answer, options: options
        })
            .then(response => {
                enqueueSnackbar('Thêm câu hỏi thành công', {variant: 'success'})
                if(type=='stay'){
                    setContent('')
                    setStatement('')
                    setOptions([{content: '', weight: 0, set: ''}])
                }else{
                    window.location.href='/cau-hoi'         
                 }
            })
            .catch(err => {
                enqueueSnackbar('Có lỗi xảy ra', {variant: 'error'})

            })
    }
    useEffect(() => {
        // console.log(props.quiz_config)
        if(props.quiz_config.content){
            setContent(props.quiz_config.content)
            setStatement(props.quiz_config.statement)
            setOptions(props.quiz_config.options)
            setQuestionType(props.quiz_config.quiz_config_type)
        }
    }, [])
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
            <Grid md={10} xs={12} className="quiz_config-detail"> 
                <div className="single-quiz_config-root">
                    <Grid container spacing={2}>
                        <Grid item md={8}>
                            <TextField
                                className="quiz_config-statement"
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
                                    value={quiz_config_type}
                                    onChange={event => setQuestionType(event.target.value)}
                                    label="Loại câu hỏi"
                                >
                                    <option aria-label="None" value="" />
                                    <option value={'mc'}>Trắc nghiệm</option>
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
                                    'underline',
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
                            editor.setData( content );

                        }}
                        onChange={ ( event, editor ) => {
                            setContent(editor.getData())
                        } }
                    />
                    {/* <Latex displayMode={true}>{content}</Latex>
                    <Latex>{content}</Latex> */}
                    
                </div>
            </Grid>
            <Grid md={2} className="quiz_config-add" xs={12}>
                <Button variant="outlined" className="quiz_config-btn" color="primary" fullWidth
                    onClick={() => createQuestion('stay')}> Lưu và thêm mới </Button>
                <Button variant="outlined" className="quiz_config-btn" color="primary" fullWidth
                    onClick={() => createQuestion('exit')}
                > Lưu và thoát </Button>
                <Button variant="outlined" className="quiz_config-btn" color="secondary" fullWidth
                    onClick={() => handleOpenPreview()}
                > Xem trước </Button>
            </Grid>
            <PreviewQuestion
                open={preview_open}
                handleCloseDialog={handleClosePreview}
                quiz_config={{content: content,  options: options}}
           />
        </Grid>
        
    )
}
export default SingleQuizConfig