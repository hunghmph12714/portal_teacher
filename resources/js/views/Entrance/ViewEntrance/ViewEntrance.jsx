import React, { Fragment, useState, useEffect } from 'react'
import './ViewEntrance.scss'
import { DialogCreate,  StepAppointment,  StepFinal, StepInform, StepInit, StepResult, ViewDelay, ViewLost} from '../components';
import { EditEntrance } from '../EditEntrance';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import vi from "date-fns/locale/vi";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib

import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
    CardContent,
    Card
  } from "@material-ui/core";
import Select from 'react-select';
import { Grid, TextField } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import GetAppIcon from '@material-ui/icons/GetApp';

import { colors } from '@material-ui/core';
import { format } from 'date-fns'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { AnswersDialog } from '../components';
import { withSnackbar } from 'notistack';
import { Can } from '../../../Can';
import { findLastKey } from 'lodash';
const baseUrl = window.Laravel.baseUrl;
const customChip = (color = '#ccc') => ({
  border: '1px solid ' + color,
  color: '#000',
  fontSize: '12px',
})
const MessageInput = props => {
  const { entrance_id } = props
  const [ message, setMessage ] = useState('');
  const onChangeMessage = (e) => {
    setMessage(e.target.value)
  }
  const sendMessage = () => {
    axios.post(baseUrl + '/entrance/send-message', {entrance_id : entrance_id, message: message})
      .then(response => {
        props.updateMessage(entrance_id, response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <div>
      <TextField  label="Tin nhắn" 
        className = "input-text"
        variant="outlined"
        size="small"
        type="text"
        margin = "dense"
        name = 'message'
        value = {message}
        onChange = {onChangeMessage}
      />
      <Button color="primary" onClick = {sendMessage}>
        Lưu
      </Button>
    </div>
     
  )
}

class ViewEntrance extends React.Component{
    constructor(props){
        super(props)
        this.state = {

            open_edit: false,
            open_answers: false,
            selected_centers: [],
            selected_centers_param: '',
            centers: [],
            answers : [],
            data: [],
            activeStep: 0,
            steps: [],
            selectedEntrance: '',
            loaded: false,
            message: '',
            total: 0,
            total_remain: 0,
            total_today: 0,
            total_completed: 0,
            total_delay: 0,
            total_lost: 1,

            open_delay: false,
            open_lost: false,
            from: null,
            to: new Date(),
        }
    }

    componentDidMount() {      
      this.init();
      this.getStats(this.props.match.params.center_id, this.props.match.params.step_id, this.props.match.params.from, this.props.match.params.to)
    }
    
    init = () =>{
      axios.post(window.Laravel.baseUrl + "/step/get", {type: 'Quy trình đầu vào'})
        .then(response => {
            this.setState({
                steps: response.data,
                loaded: true,
                activeStep: parseInt(this.props.match.params.step_id),
            })
        })
        .catch(err => {
            console.log('step bug: ' + err)
        })
      axios.get('/get-center')
        .then(response => {
          let selected_center_ids = this.props.match.params.center_id.split('_')
          
          this.setState({ 
            centers: response.data.map(d => {
              return {value: d.id, label: d.code }
            }),
            selected_centers: selected_center_ids.map( i => {
              let f = response.data.filter( d => d.id === parseInt(i))[0]
              if(f){
                return { value: f.id, label: f.code }
              }
            }),
            selected_centers_param: this.props.match.params.center_id
          })
          this.setState({ 
            
          })
        })
        .catch(err => {
          console.log('get center bug: '+ err)
        })
        this.setState({
          from:  Date(this.props.match.params.from),
          to:  Date(this.props.match.params.to)
        })
    }
    handleStep = step => () => {
      let step_id = this.state.steps[step].id
      let from = new Date(this.state.from)
      let to = new Date(this.state.to)
      this.props.history.push('/entrance/list/' +this.state.selected_centers_param + '/' +step + '/' + from.getTime() + '/' + to.getTime()) 
      
      // this.props.history.push('/entrance/list/' +this.state.selected_centers_param + '/' +step)
      this.setState({activeStep : step})
      this.getStats(this.props.match.params.center_id, step, this.props.match.params.from, this.props.match.params.to)
    }
    onCenterChange = (value) => {
      let selected_center_ids = value.map(v => v.value)
      let selected_center_params = selected_center_ids.join('_')
      this.setState({ selected_centers: value, selected_centers_param:  selected_center_params})
      let from = new Date(this.state.from)
      let to = new Date(this.state.to)
      this.props.history.push('/entrance/list/' +selected_center_params + '/' +this.state.activeStep + '/' + from.getTime() + '/' + to.getTime()) 
      this.getStats(selected_center_params, this.props.match.params.step_id,  this.props.match.params.from, this.props.match.params.to)
    }
    getStats = (center_id, step_id, from, to) => {
    
      axios.get('/entrance/stats/'+ center_id + '/' + step_id + '/' + from + '/' + to)
        .then(response => {
          this.setState({
            total: response.data.total,
            total_remain: response.data.total_remain,
            total_completed: response.data.total_completed,
            total_today: response.data.total_today,
            total_delay: response.data.total_delay,
            total_lost: response.data.total_lost,
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    handleOpenEditDialog = (rowData) => {
      Object.keys(rowData).map(function(key, index) {        
        if(!rowData[key] && key!='test_answers') rowData[key] = ''
      });
      if(typeof rowData.test_answers == 'string'){
        rowData.test_answers = rowData.test_answers.split(',')
      }
    
      this.setState({
        open_edit: true,
        selectedEntrance: rowData
      })
      // console.log(rowData)
    }
    handleCloseDialogCreate = () => {
      this.setState({open_edit : false, selectedEntrance : ''})
    }
    handleOpenAnswerDialog = (rowData) => {
      if(typeof rowData.test_answers == 'string'){
        rowData.test_answers = rowData.test_answers.split(',')
      }
      this.setState({answers : rowData.test_answers, open_answers: true})
    }
    handleCloseAnswerDialog = () => {
      this.setState({open_answers : false})
    }
    handleDeleteEntrance = (id, rowId) => {
      console.log(id)
      axios.post(baseUrl + '/entrance/delete', {id: id})
        .then(response => { 
          this.setState(prevState => {
            const data = [...prevState.data]
            data.splice(rowId, 1);
            return {...prevState, data}
          })
          this.props.enqueueSnackbar('Xóa thành công ghi danh', {
            variant: 'success'
          })
        })
        .catch(err => {
          console.log('Xóa ghi danh bug: '+ err)
        })
    }
    updateTable = ( entrance ) => {
      let step_id = this.state.steps[this.state.activeStep].id
      axios.get(baseUrl + '/get-entrance/'+step_id)
        .then(response => {
          this.setState({
            data: response.data,
          })
        })
        .catch(err => {
          console.log(err.response.data)
        })
    }   
    updateMessage = ( entrance_id, messages ) => {
      this.setState( prevState => {
        let data = prevState.data
        data.map( e => {
          if(e.eid == entrance_id ){
            e.message = messages
          }
          return e
        })
        return {...prevState , data}
      })
    }
    exportStats = () => {
      var url = '/entrance/export-stat'
      window.open(url, '_blank', 'noopener,noreferrer')
     
    }
    openDelay = () => {
      this.setState(
        {open_delay: true, open_lost: false}
      )
    }
    closeDelay = () => {
      this.setState({
        open_delay: false,
      })
    }
    openLost = () => {
      this.setState(
        {open_delay: false, open_lost:true}
      )
    }
    closeLost = () => {
      this.setState({
        open_lost: false,
      })
    }
    handleFromChange(date){
      this.setState({
        from: date
      })
      let to = new Date(this.state.to)
      this.props.history.push('/entrance/list/' +this.state.selected_centers_param + '/' +this.state.activeStep + '/' +  date.getTime() + '/' + to.getTime())
      this.getStats(this.state.selected_centers_param, this.props.match.params.step_id,  this.props.match.params.from, this.props.match.params.to)
    }
    handleToChange(date){
      this.setState({
        to: date
      })
      let from = new Date(this.state.from)
      let to = new Date(this.state.to)
      this.props.history.push('/entrance/list/' +this.state.selected_centers_param + '/' +this.state.activeStep + '/' +  from.getTime() + '/' + date.getTime())
      this.getStats(this.state.selected_centers_param, this.props.match.params.step_id,  this.props.match.params.from, this.props.match.params.to)

    }
    render(){      
      document.title = 'Danh sách ghi danh'
        return(          
          <div>  
            {!this.state.loaded ? (
              <LinearProgress  className="loading"/>
            ): (
              <div> 
                <div  className="root-entrance">
                  <Grid container spacing={2}>
                    <Grid item md={4} sm={12}>
                      <h4>CƠ SỞ GHI DANH</h4>
                      <Select
                        isMulti
                        isClearable={false}
                        name="centers"
                        options={this.state.centers}
                        value = {this.state.selected_centers}
                        onChange = {this.onCenterChange}
                      />
                    </Grid>
                    <Grid item md={4} sm={12}>
                      <div>
                      <h4>THỜI GIAN</h4>
                      <Grid container spacing={1}>
                            <Grid item md={6} sm={12}> 
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                                <KeyboardDatePicker
                                    fullWidth
                                    autoOk
                                    size= "small"
                                    className="input-from-range"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    label="Từ ngày"
                                    views={["year", "month", "date"]}
                                    value={this.state.from}
                                    onChange={(date) => this.handleFromChange(date)}
                                />  
                            </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item md={6} sm={12}> 
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} className='to'>
                                <KeyboardDatePicker
                                    fullWidth
                                    autoOk
                                    minDate = {this.state.from}
                                    className="input-to-range"
                                    size= "small"
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    label="Đến ngày"
                                    views={["year", "month", "date"]}
                                    value={this.to}
                                    onChange={() => this.handleToChange()}
                                />  
                                </MuiPickersUtilsProvider>
                            </Grid>

                        </Grid>
                      </div>
                    </Grid>
                    <Grid item md={4} sm={12}>
                      <div>
                        <h4>QUY TRÌNH</h4>
                        <Stepper alternativeLabel nonLinear activeStep={this.state.activeStep}>
                          {this.state.steps.map((step, index) => {                  
                            return (
                              <Step key={step.name}>
                                <StepButton
                                  onClick={this.handleStep(index)}
                                  // completed={isStepComplete(index)}
                                >
                                  {step.name}
                                </StepButton>
                              </Step>
                            );
                          })}
                        </Stepper>
                      </div>
                    </Grid>
                    
                  </Grid>
                  
                  <div className="stats"> 
                          <Grid container spacing={1} className="grid-no-shadow">
                            <Grid item md={2} sm={12}>
                              <Card>
                                <CardContent>
                                  <Typography variant="span" color="textSecondary" gutterBottom>
                                    Tồn đầu ngày: <br/>
                                  </Typography>
                                  <span className="stats_number"> {this.state.total_remain} </span>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item md={2} sm={12}>
                              <Card>
                                <CardContent>
                                  <Typography variant="span" color="textSecondary" gutterBottom>
                                    Mới trong ngày:<br/>
                                  </Typography>
                                  <span className="stats_number"> {this.state.total_today} </span>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item md={2} sm={12}>
                              <Card>
                                <CardContent>
                                  <Typography variant="span"  color="textSecondary" gutterBottom>
                                    Đã xử lý: <br/>
                                  </Typography>
                                  <span className="stats_number"> {this.state.total_completed} </span>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item md={2} sm={12}>
                              <Card>
                                <CardContent>
                                  <Typography variant="span"  color="textSecondary" gutterBottom>
                                    Tồn cuối ngày: <br/>
                                  </Typography>
                                  <span className="stats_number"> {this.state.total} </span>
                                  <a>
                                    <GetAppIcon onClick={() => this.exportStats()} className="btn-export" />
                                  </a>
                                  
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item md={2} sm={12}>
                              <Card>
                                <CardContent>
                                  <Typography variant="span"  color="textSecondary" gutterBottom>
                                    Danh sách chờ: <br/>
                                  </Typography>
                                  <span className="stats_number"> {this.state.total_delay} </span>
                                  <a>
                                    {this.state.open_delay ? 
                                      <VisibilityOffIcon onClick={() => this.closeDelay()} className="btn-export" />
                                      : 
                                      <VisibilityIcon onClick={() => this.openDelay()} className="btn-export" />
                                    }
                                  </a>
                                  
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item md={2} sm={12}>
                              <Card>
                                <CardContent>
                                  <Typography variant="span"  color="textSecondary" gutterBottom>
                                    Danh sách mất: <br/>
                                  </Typography>
                                  <span className="stats_number"> {this.state.total_lost} </span>
                                  <a>
                                    {this.state.open_lost ? 
                                      <VisibilityOffIcon onClick={() => this.closeLost()} className="btn-export" />
                                      : 
                                      <VisibilityIcon onClick={() => this.openLost()} className="btn-export" />
                                    }
                                  </a>
                                  
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                  </div>
                </div>
                {
                  this.state.open_delay ? 
                    <ViewLost centers = {this.state.selected_centers_param}/>:
                    
                    this.state.open_lost ? 
                      <ViewDelay centers = {this.state.selected_centers_param}/>:
                      {
                        0: <StepInit 
                            centers = {this.state.selected_centers_param}
                            from = {this.props.match.params.from}
                            to = {this.props.match.params.to}
                          />,
                        1: <StepAppointment  centers = {this.state.selected_centers_param} from = {this.props.match.params.from}
                        to = {this.props.match.params.to}/>,
                        2: <StepResult centers = {this.state.selected_centers_param} from = {this.props.match.params.from}
                        to = {this.props.match.params.to}/>,
                        3: <StepInform centers = {this.state.selected_centers_param} from = {this.props.match.params.from}
                        to = {this.props.match.params.to}/>,
                        4: <StepFinal centers = {this.state.selected_centers_param} from = {this.props.match.params.from}
                        to = {this.props.match.params.to}/>,
                      }[this.state.activeStep]
                }
              </div>
            )}
            </div>
        )
    }
}
export default withSnackbar(ViewEntrance)