import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from "lodash";
import './ClassSearch.scss';
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
const findClasss = (inputValue, student_id) => {
    return axios.post(baseUrl + '/class/find/', {key: inputValue, student_id: student_id })
        .then(response => {
            return response.data.map(c => {
                c.value = c.cid
                c.label = c.cname
                c.custom = 1
                return c
            })
        })
        .catch(err => {
            console.log('find class bug: ' + err.response.data)
        })
}

const throttleOptions = throttle(findClasss, wait)
const promptTextCreator = (value) => {
    return 'Tạo mới '+value
}
const checkValidCreate = (inputValue, selectValue, selectOptions) => {
    if(inputValue == "" || !isNaN(inputValue)){
        return false
    }else return true
}
const ClassSearch = props => {
    
    const {class_name, handleClassChange, student_id} = props
    return (
        <AsyncCreatableSelect
            components = {{ Option: CustomOption }}
            cacheOptions
            loadOptions = {inputValue => throttleOptions(inputValue, student_id)}
            autosize={true}
            isClearable
            placeholder = {'Chọn lớp'}
            name="class_name"
            value = {class_name}
            onChange = {handleClassChange}
            formatCreateLabel = {promptTextCreator}
            isValidNewOption = {checkValidCreate}
            className="input-text"
        />
    )
}
ClassSearch.propTypes = {
  className: PropTypes.string,
  
};

export default ClassSearch;
