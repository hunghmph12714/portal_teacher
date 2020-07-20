import React from 'react'
import './ClassDetail.scss'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ListSession, ListStudent } from '../components';
const baseUrl = window.Laravel.baseUrl
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
            selected_class: {}
        }
    }
    componentDidMount = () => {
      this.getClassInfo()
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
    render(){
        return (
            <div className="root-class-detail">
                <h2 className="class-title">Lớp {this.state.selected_class.name}</h2>
                <AppBar position="static">
                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="primary">
                        <Tab label="Thông tin lớp học" {...a11yProps(0)} />
                        <Tab label="Lịch học" {...a11yProps(1)} />
                        <Tab label="Danh sách học sinh" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                    Item One
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <ListSession class_id={this.props.match.params.id}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                  <ListStudent class_id={this.props.match.params.id} class_name={this.state.selected_class.name}/>
                </TabPanel>
            </div>
        )
    }
}
export default ClassDetail