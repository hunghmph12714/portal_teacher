import React, {useState, useEffect} from 'react';
import './ProactiveService.scss';
import Select , { components }  from "react-select";
import axios from 'axios';
import {
    Grid,
    Button,
    ImageList,
    ImageListItem,
    TextField,

} from '@material-ui/core'
import {useSnackbar} from 'notistack'
const ProactiveService = (props) => {
    const {enqueueSnackbar} = useSnackbar()
    const [students, setStudents] = useState([])
    const [selected_student, setSelectedStudent] = useState({value: null,})
    const [method, setMethod] = useState([
        {value: 'Điện thoại' , label: 'Điện thoại'},
        {value: 'Email' , label: 'Email'},
        {value: 'Tin nhắn SMS' , label: 'Tin nhắn SMS'},
        {value: 'Zalo' , label: 'Zalo'},
        {value: 'Trực tiếp' , label: 'Trực tiếp'},
    ])
    const [selected_method, setSelectedMethod] = useState(null)
    const [criteria, setCriteria] = useState([])
    // const []
    function handleMethodChange(value){
        setSelectedMethod(value)
    }
    function handleStudentChange(newValue){
        setSelectedStudent(newValue)
    }
    function onCriteriaChange(e, item){
        console.log(item)
        let i = criteria.map(c => {
            if(c.id == item){
                return {...c, value: e.target.value}
            }else return c
        })
        setCriteria(i)
    }
    function submitService(){
        let data = {
            student_id: selected_student.value,
            class_id: props.class_id,
            method: selected_method.value,
            cares: criteria,
        }
        if(!selected_method || !selected_student){
            enqueueSnackbar('Vui lòng chọn phương thức', {variant: 'warning'})
        }
        axios.post('/proactive-service', data)
            .then(response => {
                enqueueSnackbar('Lưu thành công', {variant: 'success'})
            })
            .catch(err => {

            })
    }
    useEffect(() => {
        axios.post('/student/get', {class_id: props.class_id})
        .then(response => {
            let options = response.data.map(r => {
                console.log(r)
                if(r.detail.status == 'active'){
                    return {label: r.fullname, value: r.id, p_name: r.parent.pname, p_email: r.parent.pemail, p_phone: r.parent.pphone,
                        aspiration: r.aspiration, entrance_date : r.detail.entrance_date
                    }
                }
            })
            setStudents(options)
        })
        .catch(err => {
            console.log(err)
        })
        axios.post('/service-criteria/get',{})
            .then(response => {
                // console.log(response)
                let c = response.data.map((d) => {
                    return {...d, value:''}
                })
                setCriteria(c)
            })
            .catch(err => {

            })
    }, [])
    return (
        <div className="root-service">
            <Grid container spacing={2}>
                <Grid item md={4}>
                    <div className = "select-input">
                        <h5>Lựa chọn học sinh</h5>
                        <Select className = "select-box"                
                            value = {selected_student}
                            name = "selected_session"
                            placeholder="Chọn học sinh"
                            options={students}
                            onChange={handleStudentChange}
                        />                 
                    </div>
                </Grid>
                <Grid item md={4}>
                    <h5>Thông tin đào tạo</h5>
                    <span>Ngày nhập học: </span> {selected_student.entrance_date}<br></br>
                    <span>Mục tiêu: </span> {selected_student.aspiration}<br></br>
                </Grid>
                <Grid item md={4}>
                    <h5>Thông tin phụ huynh</h5>
                    <span>Họ tên: </span> {selected_student.p_name}<br></br>
                    <span>Số điện thoại: </span> {selected_student.p_phone}<br></br>
                    <span>Email: </span> {selected_student.p_email}<br></br>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item md={4}>
                    <h5>Phương thức chăm sóc</h5>
                    <Select className = "select-box"                
                        value = {selected_method}
                        placeholder="Chọn phương thức"
                        options={method}
                        onChange={handleMethodChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <h5>Tiêu chí chăm sóc</h5>
                    <ImageList rowHeight={100} cols={3} gap={2}>
                        {criteria.map((item) => (
                            <ImageListItem key={item.id}>
                                <p style={{marginBottom: '0.2rem'}}>{item.name}</p>
                                <TextField id="outlined-basic" variant="outlined" fullWidth size='small' 
                                    onChange={(event) => onCriteriaChange(event, item.id)}
                                    value={item.value}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <Button 
                        onClick={submitService}
                    >Lưu phiên chăm sóc</Button>
                </Grid>
                            
                
            </Grid>
        </div>
        
    )
}
export default ProactiveService;