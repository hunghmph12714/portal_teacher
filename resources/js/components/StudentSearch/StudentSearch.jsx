import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from "lodash";
import './StudentSearch.scss';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import Select , { components }  from "react-select";
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
const baseUrl = window.Laravel.baseUrl

const wait = 1000;
const customChip = (color = '#ccc') => ({
    border: '1px solid ' + color,
    color: color,
    fontSize: '12px',
})
const CustomOption = props => {
    const { data, innerRef, innerProps } = props;
    return data.custom ? (
        <Card className= "search-card" ref={innerRef} {...innerProps}>
            <CardContent>
                <Chip style={customChip(data.color)} variant="outlined" color="secondary" label={data.r_name} size="small" />
                <Grid container spacing={2} className="search-grid">
                    <Grid item md={6} sm={12}> 
                        <Typography variant="body2" component="p">
                            <b>Học sinh: </b>{data.s_name}
                            <br />
                            Ngày sinh: {data.dob}
                        </Typography>
                    </Grid>
                    
                    <Grid item md={6} sm={12}> 
                        <Typography variant="body2" component="p">
                            <b>Phụ huynh: </b>{data.p_name}
                        <br />
                            Số điện thoại: {data.p_phone}
                        </Typography>
                    </Grid>
                </Grid>          
            </CardContent>
        </Card>      
    ) : <components.Option {...props} />
  };
const findStudents = (inputValue) => {
    return axios.get(baseUrl + '/student/find/' + inputValue)
        .then(response => {
            return response.data.map(student => {
                student.value = student.sid
                student.label = student.s_name
                student.custom = 1
                return student
            })
        })
        .catch(err => {
            console.log('find student bug: ' + err.response.data)
        })
}

const throttleOptions = throttle(findStudents, wait)
const promptTextCreator = (value) => {
    return 'Tạo mới '+value
}
const checkValidCreate = (inputValue, selectValue, selectOptions) => {
    if(inputValue == "" || !isNaN(inputValue)){
        return false
    }else return true
}
const StudentSearch = props => {
    const {student_name, handleStudentChange} = props
    return (
        <AsyncCreatableSelect
            components={{ Option: CustomOption }}
            cacheOptions
            loadOptions={inputValue => throttleOptions((/\d/.test(inputValue))?inputValue.replace(/\s|[(]|[)]|[-]/g, '') : inputValue)}
            autosize={true}
            isClearable
            placeholder={'Học sinh (tìm theo tên HS hoặc SĐT PH)'}
            name="student_name"
            value = {student_name}
            onChange = {handleStudentChange}
            formatCreateLabel = {promptTextCreator}
            isValidNewOption = {checkValidCreate}
            className="input-text"
        />
    )
}
StudentSearch.propTypes = {
  className: PropTypes.string,
  
};

export default StudentSearch;
