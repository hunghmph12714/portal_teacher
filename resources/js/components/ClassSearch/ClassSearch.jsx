import React, {useState , useEffect} from 'react';
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

const ClassSearch = React.memo(props => {
    const {center, course} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            setClasses(r.data.map(c => {
                    // console.log(c)
                    return {label: c.code + ' - ' +c.name, value: c.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select className = "select-box"
            className="select-box"
            key = "class-select"
            value = {props.selected_class}
            name = "selected_class"
            placeholder="Chọn lớp"
            isClearable
            options={classes}
            onChange={props.handleChange}
        />)
})

export default ClassSearch;
