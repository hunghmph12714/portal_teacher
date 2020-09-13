import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './TeacherSearch.scss';
import Select , { components }  from "react-select";
const baseUrl = window.Laravel.baseUrl
const TeacherSearch = React.memo(props => {
    const [teachers, setTeacher] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/get-teacher')
            setTeacher(r.data.map(center => {
                    return {label: center.name, value: center.id}
                })
            )
        }
        fetchData()
    }, [])
    
    if(props.teacher.value ){
        return (
            <Select style={{marginTop: '2px'}}
                className="select-box"
                key = "center-select"
                value = {props.teacher}
                name = "teacher"
                label ="Giáo viên"
                placeholder="Giáo viên"
                options={teachers}
                onChange={props.handleChange}
            />
        )
    }
    else{
        return (
            <Select className = "select-box"
                            key = "center-select"
                name = "teacher"
                label ="Giáo viên"
                placeholder="Giáo viên"
                options={teachers}
                onChange={props.handleChange}
            />
        )
    }
}) 
TeacherSearch.propTypes = {
  className: PropTypes.string,  
};

export default TeacherSearch;
