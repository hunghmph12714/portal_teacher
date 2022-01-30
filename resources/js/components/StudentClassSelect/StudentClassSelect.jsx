import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Select , { components }  from "react-select";
const baseUrl = window.Laravel.baseUrl
const StudentClassSelect = React.memo(props => {
    const [students, setStudent] = useState([])
    // Class id 
    // Session date
    // 
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.post(baseUrl + '/class/active-student', 
            {class_id: props.class_id, type: props.dialogType, session_date: props.session_date, session_id: props.session_id})
            setStudent(r.data.map(d => {
                    return {label: d.fullname, value: d.id}
                })
            )
        }
        fetchdata()
    }, [props.fetch_student])
    
    return (
        <Select style={{marginTop: '2px'}}
            className="select-box"
            isMulti
            key = "center-select"
            value = {props.students}
            name = "teacher"
            label ="Thêm  học sinh vào ca học"
            placeholder="Thêm học sinh vào ca học"
            options={students}
            onChange={props.handleChange}
        />
    )
}) 
StudentClassSelect.propTypes = {
  className: PropTypes.string,  
};

export default StudentClassSelect;
