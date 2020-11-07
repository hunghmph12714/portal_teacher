import React, {useState, useEffect} from 'react'
import './StudentForm.scss'
import { StudentSearch, ParentSearch } from '../../../../components'
import { Grid , Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import AsyncCreatableSelect from 'react-select/async-creatable';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import Box from '@material-ui/core/Box';
import SaveIcon from '@material-ui/icons/Save';

import Button from '@material-ui/core/Button';
import Select , { components }  from "react-select";
import chroma from 'chroma-js';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { throttle } from "lodash";
import {useSnackbar} from "notistack";
const baseUrl = window.Laravel.baseUrl
const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
});
const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        },
      };
    },
    input: styles => ({ ...styles, ...dot() }),
    placeholder: styles => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };
const RelationshipOptions = React.memo(props => {
    const [relationships, setRelationships] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/relationship/get')
            setRelationships(r.data.map(relationship => {
                    return {label: relationship.name, value: relationship.id, color: (relationship.color)?relationship.color:"#000000"}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select className = "select-box"
            className="relationship-select"
            value = {props.selected_relationship}
            name = "selected_relationship"
            placeholder="Quan hệ khách hàng"
            options={relationships}
            onChange={props.handleChange}
            styles={colourStyles}
        />)
})

//s
const wait = 1000; // milliseconds

const promptTextCreator = (value) => {
    return 'Tạo mới '+value
}
const findSchools = (inputValue) => {
    return axios.get(baseUrl + '/school/find/' + inputValue)
        .then(response => {
            return  response.data.map(school => { return {label: school.name, value: school.id} })
        })
        .catch(err => {
            console.log('get schools bug' + err.response.data)
        })
}
const loadOptions = (type, inputValue) => {            
    if(type == 'school'){
        return findSchools(inputValue)
    }
};        
const debouncedLoadOptions = throttle(loadOptions, wait)

const StudentForm = props => {
    const { student_id, ...rest } = props;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [isBusy, setBusy] = useState(true)
    const [ student, setStudent ] = useState({sname: '', grade: '', school: '', semail: '', sphone: '', gender: 'Nữ',
    pname: '', pname2:'', pphone:'', pphone2:'', pemail:'', pemail2:''})
    useEffect(() => {
        async function fetchStudent() {
            const response = await axios.post(baseUrl + '/student/get-id', {id: student_id})
            response.data.relationship = {label: response.data.r_name, value: response.data.r_id, color: response.data.color}
            setStudent(response.data)
        }
        fetchStudent()
        setBusy(false)
    }, [])
    const onChange = (e) => {
        let s = {...student}
        s[e.target.name] = e.target.value
        setStudent(s)
    }
    const handleSchoolChange = (newValue) => {
        let s = {...student}
        s.school = newValue.label
        setStudent(s)
    }
    const handleDobChange = (date) => {
        let s = {...student} 
        s.dob = date 
        setStudent(s)
    }
    const handleChange = (newValue , event)=> {
        let s = {...student}
        s.relationship = newValue
        setStudent( s )
    }

    const handleSubmit = () => {
        axios.post('/student/save', {student})
            .then(response => {
                enqueueSnackbar('Sửa hồ sơ thành công', {variant: 'success'})
            })
            .catch(err => {
                console.log(err)
            })
    }
    if(!isBusy){
        return (
            <div className = 'root-student-cv'>
                <h3>Thông tin học sinh</h3>
                <Grid container spacing={3} className="student-form" {...rest}> 
                    <Grid item md={12} lg={4} sm={12} xs={12}>
                        <TextField  label="Họ tên học sinh"  
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="email"
                            fullWidth
                            margin = "dense"
                            name = 'sname'
                            value = {student.sname}
                            onChange = {onChange}
                        />    
                        <Grid container spacing={2} className="gender-dob">
                            <Grid item md={6} sm={12}>
                                <div className="date-time">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                                        <KeyboardDatePicker
                                            autoOk
                                            className="input-date"
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            placeholder="Ngày sinh"
                                            views={["year", "month", "date"]}
                                            value={student.dob}
                                            name= "dob"
                                            onChange={handleDobChange}
                                        />                     
                                    </MuiPickersUtilsProvider>     
                                </div>
                        
                            </Grid>    
                            <Grid item md={12} md={6} sm={12}>
                                <FormControl component="fieldset">
                                    <RadioGroup row aria-label="gender" name="gender" value={student.gender} onChange={onChange}>
                                        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>    
                        </Grid>       
                    </Grid>
                    <Grid item md={12} lg={4} sm={12} xs={12}>
                        <AsyncCreatableSelect 
                            cacheOptions
                            autosize={true}
                            loadOptions={inputValue => debouncedLoadOptions('school',inputValue)}
                            placeholder={'Trường học'}
                            onChange={handleSchoolChange}
                            name="school"
                            value={{label: student.school, value : student.school}}
                            formatCreateLabel={promptTextCreator} 
                            className="school-select"    
                        />
        
                        <TextField  label="Lớp học"  
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="email"
                            fullWidth
                            margin = "dense"
                            name = 'grade'
                            value = {student.grade}
                            onChange = {onChange}
                        />    
                    </Grid>
                    <Grid item md={12} lg={4} sm={12}  xs={12}>
                        <TextField  label="Email của học sinh" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="email"
                            fullWidth
                            margin = "dense"
                            name = 'semail'
                            value = {student.semail}
                            onChange = {onChange}
                        />    
                        <TextField  label="Số điện thoại học sinh" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="email"
                            fullWidth
                            margin = "dense"
                            name = 'sphone'
                            value = {student.sphone}
                            onChange = {onChange}
                        />    
                    </Grid>
                </Grid>
                <h3>Thông tin phụ huynh</h3>
                <Grid container spacing={3} className="student-form" {...rest}>                
                    <Grid item md={12} lg={4} sm={12} xs={12}>
                        <TextField  label="Họ tên phụ huynh" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'pname'
                            value = {student.pname}
                            onChange = {onChange}
                        /> 
                        
                        <TextField  label="Họ tên phụ huynh 2" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'pname2'
                            value = {student.pname2}
                            onChange = {onChange}
                        /> 
                        <RelationshipOptions 
                            className = 'relationship-select'
                            selected_relationship={student.relationship}
                            handleChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={12} lg={4} sm={12} xs={12}>
                        <TextField  label="Số điện thoại" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'pphone'
                            value = {student.pphone}
                            onChange = {onChange}
                        /> 
                        <TextField  label="Số điện thoại 2" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'pphone2'
                            value = {student.pphone2}
                            onChange = {onChange}
                        /> 
                        <TextField  label="Ghi chú" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="text"
                            fullWidth
                            margin = "dense"
                            name = 'note'
                            value = {student.note}
                            onChange = {onChange}
                        />     
                    </Grid>
                    <Grid item md={12} lg={4} sm={12}  xs={12}>
                        <TextField  label="Email(*)" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="email"
                            fullWidth
                            margin = "dense"
                            name = 'pemail'
                            value = {student.pemail}
                            onChange = {onChange}
                        />    
                        <TextField  label="Email 2" 
                            className = "input-text"
                            variant="outlined"
                            size="small"
                            type="email"
                            fullWidth
                            margin = "dense"
                            name = 'pemail2'
                            value = {student.pemail2}
                            onChange = {onChange}
                        />    
                        
                    </Grid>
                    
                </Grid>
                <Box flexDirection="row-reverse" display="flex">
                    <Button onClick={handleSubmit} color="secondary" id="btn-save" variant="contained"
                        type="submit"
                        color="secondary"
                        size="large"
                        startIcon={<SaveIcon />}>
                        Lưu hồ sơ
                    </Button>
                </Box>
            </div>
        )
    }
    else{
        return(<div/>)
    }
}
export default StudentForm;