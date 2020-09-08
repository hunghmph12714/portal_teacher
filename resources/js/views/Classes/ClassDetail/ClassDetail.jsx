import React from 'react'
import './ClassDetail.scss'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ListSession, ListStudent, ListAttendance, ListScore } from '../components';
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
class ClassDetail extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value: 2,
            selected_class: {},
            from: new Date(date.getFullYear(), date.getMonth(), 1),
            to: new Date(date.getFullYear(), date.getMonth()+1, 0),
        }
    }
    componentDidMount = () => {
      this.getClassInfo()
    }
    toggleOpen = () => {
      this.setState({ open: !this.state.open })
    }
    handleChange = (event, newValue) => {
        this.setState({value: newValue})
    };
    getClassInfo = () => {
      axios.get(baseUrl+ '/class/getbyid/' + this.props.match.params.id)
        .then(response => {
          this.setState({
            selected_class: response.data
          })
        })
        .catch(err => {
          console.log(err)
        }) 
    }
    handleFromChange = date => {
      this.setState({ from: date });
    }
    handleToChange = date => {
      this.setState({ to: date });
    }
    render(){
        return (
            <div className="root-class-detail">
              <Grid container spacing={2} direction="row" justify="space-between" alignItems="center">
                <Grid item md={6} className="header-class">
                  <h2 className="class-title">Lớp {this.state.selected_class.name}</h2>
                </Grid>
                <Grid item md={6} className="header-class">
                  
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                    <KeyboardDatePicker
                      autoOk
                      size= "small"
                      className="input-date-range"
                      variant="inline"
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      label="Từ ngày"
                      views={["year", "month", "date"]}
                      value={this.state.from}
                      onChange={this.handleFromChange}
                    />  
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                    <KeyboardDatePicker
                      autoOk
                      minDate = {this.state.from}
                      className="input-date-range"
                      size= "small"
                      variant="inline"
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      label="Đến ngày"
                      views={["year", "month", "date"]}
                      value={this.state.to}
                      onChange={this.handleToChange}
                    />  
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
                <AppBar position="static">
                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="primary">
                        <Tab label="Thông tin lớp học" {...a11yProps(0)} />
                        <Tab label="Lịch học" {...a11yProps(1)} />
                        <Tab label="Danh sách học sinh" {...a11yProps(2)} />
                        <Tab label="Tình hình học tập" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                  <ListAttendance class_id={this.props.match.params.id} 
                    from = {this.state.from}
                    to = {this.state.to}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <ListSession class_id={this.props.match.params.id} 
                    class_name={this.state.selected_class.name}
                    from = {this.state.from}
                    to = {this.state.to} />
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                  <ListStudent class_id={this.props.match.params.id} class_name={this.state.selected_class.name}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={3}>
                  <ListScore 
                    class_id={this.props.match.params.id} 
                    class_name={this.state.selected_class.name}
                    from = {this.state.from}
                    to = {this.state.to} />
                </TabPanel>
            </div>
        )
    }
}
export default ClassDetail