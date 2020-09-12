import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from "lodash";
import './ParentSearch.scss';
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
                            <b>Phụ huynh 1: </b>{data.fullname}
                            <br />
                            Số điện thoại: {data.phone}
                            <br/>
                            Email: {data.email}
                        </Typography>
                    </Grid>
                    
                    <Grid item md={6} sm={12}> 
                        <Typography variant="body2" component="p">
                            <b>Phụ huynh 2: </b>{data.alt_fullname}
                            <br />
                            Số điện thoại: {data.alt_phone}
                            <br/>
                            Email: {data.alt_email}
                        </Typography>
                    </Grid>
                </Grid>          
            </CardContent>
        </Card>      
    ) : <components.Option {...props} />
  };
const findParents = (inputValue) => {
    return axios.get(baseUrl + '/parent/find/' + inputValue)
        .then(response => {
            return response.data.map(parent => {
                parent.value = parent.pid
                parent.label = parent.phone
                parent.custom = 1
                return parent
            })
        })
        .catch(err => {
            console.log('find parent bug: ' + err.response.data)
        })
}

const throttleOptions = throttle(findParents, wait)
const promptTextCreator = (value) => {
    return 'Tạo mới '+value
}
const checkValidCreate = (inputValue, selectValue, selectOptions) => {
    if(inputValue == ""){
        return false
    }else return true
}
const ParentSearch = props => {
    const {parent_phone, handleParentChange} = props
    return (
        <AsyncCreatableSelect
            components={{ Option: CustomOption }}
            cacheOptions
            loadOptions={inputValue => throttleOptions(inputValue.replace(/\s|[(]|[)]|[-]|[.]/g, ''))}
            autosize={true}
            isClearable
            placeholder={'Số điện thoại phụ huynh(*)'}
            name="parent_phone"
            value = {parent_phone}
            onChange = {handleParentChange}
            formatCreateLabel = {promptTextCreator}
            isValidNewOption = {checkValidCreate}
            className="select-box-parent"
        />
    )
}
ParentSearch.propTypes = {
  className: PropTypes.string,
  
};

export default ParentSearch;
