import React, {useRef} from 'react';
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
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useSnackbar } from 'notistack';

const baseUrl = window.Laravel.baseUrl
import {Redirect} from 'react-router-dom';

const wait = 1000;
const customChip = (color) => ({
    border: '1px solid ' + color,
    color: color,
    fontSize: '12px',
    marginRight: '5px'
})
const CustomOption = props => {
    const { data, innerRef, innerProps } = props;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const textAreaRef = useRef(null);
    function copyToClipboard(e) {
        textAreaRef.current.select();
        textAreaRef
        document.execCommand('copy');
        e.target.focus();
        setCopySuccess('Copied!');
    };
    return data.custom ? (
        <Card className= "search-card" ref={innerRef} {...innerProps}>
            <CardContent>
                <Chip style={customChip(data.color)} variant="outlined" color="secondary" label={data.r_name} size="small" />
                <Grid container spacing={2} className="search-grid">
                    <Grid item md={6} sm={12}> 
                        <Typography variant="body2" component="p">
                            <b>Học sinh: </b>{data.sid + '-' +data.s_name}
                            <br />
                            Ngày sinh: {data.dob}
                        </Typography>
                    </Grid>
                    
                    <Grid item md={6} sm={12}> 
                        <Typography variant="body2" component="p">
                            <b>Phụ huynh: </b>{data.p_name}
                        <br />
                            SDT:{data.p_phone}
                                <Tooltip title="Sao chép">
                                    <FileCopyIcon fontSize="small" 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            var dummy = $('<input>').val(data.p_phone).appendTo('body').select()
                                            document.execCommand('copy')
                                            enqueueSnackbar('Đã sao chép', {'variant': 'success'})
                                        }}
                                    />
                                </Tooltip> 
                            <br />
                            EMAIL: {data.p_email}
                            <Tooltip title="Sao chép">
                                <FileCopyIcon fontSize="small" 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        var dummy = $('<input>').val(data.p_email).appendTo('body').select()
                                        document.execCommand('copy')
                                        enqueueSnackbar('Đã sao chép', {'variant': 'success'})
                                    }}
                                    
                                />
                            </Tooltip>
                        </Typography>
                    </Grid>                    
                </Grid>
                <Grid container spacing={2} className="search-grid">
                    <Grid item md={12} sm={12}>
                        <Typography variant="body2" component="p">
                            <b>Lớp: </b>{data.classes.map(c => {
                                let cl = (c.pivot.status == 'active')? '' : ((c.pivot.status == 'droped') ? '#adadc9' : (c.pivot.status == 'waiting') ? '#b22222' : '#000000')
                                return (<Chip style={customChip(cl)} variant="outlined" color="secondary" label={c.code} size="small" title={c.pivot.status} onClick = {(e) => {
                                    e.stopPropagation()
                                    window.location.href = "/class/" + c.pivot.class_id} }/>)
                            })}
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
    const {student_name, handleStudentChange, isMulti} = props
    return (
        <AsyncCreatableSelect
            isMulti = {isMulti}
            components={{ Option: CustomOption }}
            loadOptions={inputValue => throttleOptions((/\d/.test(inputValue))?inputValue.replace(/\s|[(]|[)]|[-]/g, '') : inputValue)}
            autosize={true}
            isClearable
            placeholder={'Học sinh (tìm theo tên HS hoặc SĐT PH)'}
            name="student_name"
            value = {student_name}
            onChange = {handleStudentChange}
            formatCreateLabel = {promptTextCreator}
            isValidNewOption = {checkValidCreate}
            className="select-box"
        />
    )
}
StudentSearch.propTypes = {
  className: PropTypes.string,
  
};

export default StudentSearch;
