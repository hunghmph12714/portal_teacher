import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Grid,
    FormControl, InputLabel, Select,
    } from '@material-ui/core'
import { useSnackbar } from 'notistack'
const Question = (props) =>{
    const {enqueueSnackbar} = useSnackbar()
    const [config, setConfig] = useState(null)
    useEffect(() => {
        setConfig({
            subject: '',
            grade: '',

        })
    },[])
    return(
        <div className="question-root">
            <Grid container spacing={1}>
                <Grid item md={1} xs={12}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel htmlFor="outlined-age-native-simple">Môn học</InputLabel>
                        <Select
                            native
                            value={config.subject}
                            onChange={onChange}
                            label="Môn học"
                            name = "subject"
                        >
                            <option aria-label="None" value="" />
                            <option value={'Toán'}>Toán</option>
                            <option value={'Tiếng Việt'}>Tiếng Việt/Văn</option>
                            <option value={'Anh'}>Tiếng Anh</option>
                            <option value={'Lý'}>Lý</option>
                            <option value={'Hoá'}>Hoá</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} xs={12}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel htmlFor="outlined-age-native-simple">Khối</InputLabel>
                        <Select
                            native
                            value={config.grade}
                            onChange={this.onChange}
                            name="grade"
                            label="Khối"
                            name = "grade"
                        >
                            <option aria-label="None" value="" />
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={4} xs={12}>
                    {/* <Creatable 
                        options={this.state.topics}
                        autosize={true}
                        placeholder={'Chuyên đề(*)'}
                        onChange={this.handleTopicChange}
                        value={this.state.topic}
                        formatCreateLabel={promptTextCreator} 
                        className="select-box"    
                    /> */}
                </Grid>
                <Grid item md={4} xs={12}>
                    {/* <Creatable 
                        isMulti
                        options={this.state.relateds}
                        autosize={true}
                        placeholder={'Kiến thức liên quan'}
                        onChange={this.handleRelatedChange}
                        name="related"
                        value={this.state.related}
                        formatCreateLabel={promptTextCreator} 
                        className="select-box"    
                    /> */}
                </Grid>
                <Grid item md={1} xs={12}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel htmlFor="outlined-age-native-simple">Loại bài(*)</InputLabel>
                        {/* <Select
                            native
                            value={this.state.type}
                            onChange={this.onChange}
                            label="Loại bài"
                            name = "type"
                        >
                            <option aria-label="None" value="" />
                            <option value={'Tự luận'}>Tự luận</option>
                            <option value={'Trắc nghiệm'}>Trắc nghiệm</option>
                            <option value={'Khác'}>Khác</option>                                        
                        </Select> */}
                    </FormControl>
                </Grid>
                <Grid item md={1} xs={12}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel htmlFor="outlined-age-native-simple">Độ khó(*)</InputLabel>
                        {/* <Select
                            native
                            value={this.state.level}
                            onChange={this.onChange}
                            label="Độ khó"
                            name = "level"
                        >
                            <option aria-label="None" value="" />
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </Select> */}
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    )
}

export default Question