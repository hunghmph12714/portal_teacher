import React , {useState, useEffect} from 'react'
import './Attendance.scss'
import axios from 'axios'
import { Grid } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import Select , { components }  from "react-select";
import Divider from '@material-ui/core/Divider';
import { format } from 'date-fns'
const baseUrl = window.Laravel.baseUrl

const ClassSelect = React.memo(props => {
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
        <Select
            key = "class-select"
            value = {props.selected_class}
            name = "selected_class"
            placeholder="Chọn lớp"
            isClearable
            options={classes}
            onChange={props.handleChange}
        />)
})
const SessionDateSelect = React.memo(props => {
    const {selected_class} = props
    const Vndate = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const [sessions, setSessions] = useState([])
    const [tmp_sessions, setTmpSession] = useState([])
    const fetchData = async() => {
        const r = await axios.post(baseUrl + '/session/get', {class_id: selected_class.value, from_date: -1, to_date: -1})
        let data = r.data.map(c => {
            let date = new Date(c.date)
            c.date = format(date , 'd/M/yyyy')
            c.day = format(date, 'i') 
            c.from = format(new Date(c.from), 'HH:mm')
            c.to = format(new Date(c.to), 'HH:mm')
            c.time = c.from + '-' + c.to
            return {label: Vndate[c.day]+ ': '+c.date+' ('+c.time+' )', value: c.sid, date : c.date}
        })
        setSessions(data)
        setTmpSession(data)
    }
    useEffect(() => {        
        if(selected_class){
            fetchData()            
        }
    }, [props.selected_class])
    useEffect(() => {
        if(!props.selected_session){
           setSessions(tmp_sessions)
        }else{
            setSessions(sessions.filter(s => s.date == props.selected_session[0].date))
        }        
    }, [props.selected_session])
    return( 
        <Select
            key = "session-select"
            isMulti
            value = {props.selected_session}
            name = "selected_session"
            placeholder="Chọn Ca học"
            options={sessions}
            onChange={props.handleChange}
        />)
})

class Attendance extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            selected_class : null,
            selected_session: ''
        }
    }
    handleClassChange = (newValue , event) => {
        if(this.state.selected_class != newValue){
            this.setState({selected_session: ''})
            this.setState({
                'selected_class' : newValue
            })
        }       
        
    }
    handleChange = (newValue , event)=> {
        this.setState({
            [event.name]: newValue
        })    
    };
    render(){
        return(
            <div className="root-attendance">
                <Grid container spacing={1} className="select-session">
                    <Grid item lg={2} sm={12} xs={12}>
                        <ClassSelect 
                            selected_class = {this.state.selected_class}
                            handleChange={this.handleClassChange}
                            course = {-1}
                            center = {-1}
                        />
                    </Grid>
                    <Grid item lg={4} sm={12} xs={12}>
                        <SessionDateSelect 
                            selected_class = {this.state.selected_class}
                            selected_session = {this.state.selected_session}
                            handleChange={this.handleChange}                        
                        />
                    </Grid>
                </Grid>
                <Divider/>
                

            </div>
        )
    }
}
export default withSnackbar(Attendance);
