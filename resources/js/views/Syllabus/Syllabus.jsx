import React, {useState, useEffect} from 'react'
import {
    Grid,
    Paper,
    TextField, FormControl, InputLabel, Select, FormControlLabel,
    Switch, FormGroup, Button
    
} from '@material-ui/core'

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5vee/build/ckeditor';
import axios from 'axios';
import './Syllabus.scss'
const Syllabus = (props) => {
    const [syllabus, setSyllabus] = useState({
        title: '',
        grade: '',
        subject: '',
        description: '',
        subject: '',
        public: true,

    })
    function onChange(event){
        setSyllabus({...syllabus, [event.target.name]: event.target.value })
    }
    function onPublicChange(event){
        setSyllabus({...syllabus, public: event.target.checked})
    }
    function submitSyllabus(){

    }
    return(
        <div className="syllabus-root">
            <Grid container spacing={2}>
                <Grid item md={9}> 
                    <Paper>
                        <div className="syllabus-content">
                            <h4>Tạo mới khoá học</h4>
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
                                            <option value={1}>Toán </option>
                                            <option value={2}>Tiếng Việt</option>
                                            <option value={3}>Tiếng Anh</option>
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
                                data= {syllabus.description}
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
                </Grid>
                <Grid item md={3}> 
                    <Paper>
                        <div className="syllabus-action">
                            <Button variant="outlined" color="primary" fullWidth onClick={submitSyllabus}> 
                                Xuất bản
                            </Button>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
export default Syllabus