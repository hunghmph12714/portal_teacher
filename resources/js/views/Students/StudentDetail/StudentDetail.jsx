import React from 'react'
import './StudentDetail.scss'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { StudentForm, ClassForm } from '../components';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib

import vi from "date-fns/locale/vi";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";

const baseUrl = window.Laravel.baseUrl
var date = new Date();
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div>
            {children}
          </div>
        )}
      </div>
    );
  }
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
class StudentDetail extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value: 0,
            selected_student: {},
        }
    }
    toggleOpen = () => {
      this.setState({ open: !this.state.open })
    }
    handleChange = (event, newValue) => {
        this.setState({value: newValue})
    };
    // getStudentInfo = () => {
    //   axios.get(baseUrl+ '/student/getbyid/' + this.props.match.params.id)
    //     .then(response => {
    //       this.setState({
    //         selected_student: response.data
    //       })
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     }) 
    // }
    handleFromChange = date => {
      this.setState({ from: date });
    }
    handleToChange = date => {
      this.setState({ to: date });
    }
    render(){
        document.title = 'Hồ sơ học sinh'
        return (
            <div className="root-student-detail">               
                <AppBar position="static" color="secondary">
                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="secondary">
                        <Tab label="Hồ sơ học sinh" {...a11yProps(0)} />
                        <Tab label="Đào tạo" {...a11yProps(1)} />
                        <Tab label="Học phí" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                  <StudentForm
                    student_id = {this.props.match.params.id}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  <ClassForm
                    student_id = {this.props.match.params.id}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                 
                </TabPanel>
                <TabPanel value={this.state.value} index={3}>
                  
                </TabPanel>
            </div>
        )
    }
}
export default StudentDetail