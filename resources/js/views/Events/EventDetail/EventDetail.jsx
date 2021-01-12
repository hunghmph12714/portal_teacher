import React from 'react'
import './EventDetail.scss'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ListSession, ListStudent, ListAttendance, ListScore,Analytics } from '../components';
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
class EventDetail extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value: 1,
            selected_class: {},
            from: new Date('2000-01-01'),
            to: new Date('2030-01-01'),
            classes: [],
        }
    }
    componentDidMount = () => {
      this.getEventInfo()
    }
    
    toggleOpen = () => {
      this.setState({ open: !this.state.open })
    }
    handleChange = (event, newValue) => {
        this.setState({value: newValue})
    };
    getEventInfo = () => {
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
        document.title = this.state.selected_class.name
        return (
            <div className="root-class-detail">
              <Grid container spacing={2} direction="row" justify="space-between" alignItems="center">
                <Grid item md={6} sm={6} className="header-class">
                  <h2 className="class-title">{this.state.selected_class.name}</h2>
                </Grid>
              </Grid>
                <AppBar position="static">
                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="primary">
                        <Tab label="Môn thi" {...a11yProps(0)} />
                        <Tab label="Đăng ký" {...a11yProps(1)} />
                        <Tab label="Bảng tổng" {...a11yProps(2)} />
                        <Tab label="Thống kê" {...a11yProps(3)} />
                        
                    </Tabs>
                </AppBar>
                
                <TabPanel value={this.state.value} index={0}>
                    <ListSession class_id={this.props.match.params.id} 
                      class_name={this.state.selected_class.name}
                      class_fee = {this.state.selected_class.fee}
                      class_code = {this.state.selected_class.code}
                      from = {-1}
                      to = {-1} 
                    />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  <ListStudent class_id={this.props.match.params.id} class_name={this.state.selected_class.name}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={3}>
                  <Analytics class_id={this.props.match.params.id} class_name={this.state.selected_class.name}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
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
export default EventDetail