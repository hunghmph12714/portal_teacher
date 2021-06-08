import React, { Fragment, useState, useEffect } from 'react'
import './ViewEntrance.scss'
import { DialogCreate,  StepAppointment,  StepFinal, StepInform, StepInit, StepResult} from '../components';
import { EditEntrance } from '../EditEntrance';
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
import { AnswersDialog } from '../components';
import { withSnackbar } from 'notistack';
import { Can } from '../../../Can';
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
    <React.Fragment>
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
    </React.Fragment>
     
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
        }
    }

    componentDidMount() {      
      this.init();
      this.getStats(this.props.match.params.center_id, this.props.match.params.step_id)
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
              return {value: d.id, label: d.name }
            }),
            selected_centers: selected_center_ids.map( i => {
              let f = response.data.filter( d => d.id === parseInt(i))[0]
              if(f){
                return { value: f.id, label: f.name }
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
    }
    handleStep = step => () => {
      let step_id = this.state.steps[step].id
      this.props.history.push('/entrance/list/' +this.state.selected_centers_param + '/' +step)
      this.setState({activeStep : step})
      this.getStats(this.props.match.params.center_id, step)
    }
    onCenterChange = (value) => {
      let selected_center_ids = value.map(v => v.value)
      let selected_center_params = selected_center_ids.join('_')
      this.setState({ selected_centers: value, selected_centers_param:  selected_center_params})
      this.props.history.push('/entrance/list/' +selected_center_params + '/' +this.state.activeStep)
      this.getStats(selected_center_params, this.props.match.params.step_id)
    }
    getStats = (center_id, step_id) => {
      console.log(center_id)
      console.log(step_id)
      axios.get('/entrance/stats/'+ center_id + '/' + step_id)
        .then(response => {
          this.setState({
            total: response.data.total,
            total_remain: response.data.total_remain,
            total_completed: response.data.total_completed,
            total_today: response.data.total_today,
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
    render(){      
      document.title = 'Danh sách ghi danh'
        return(          
          <React.Fragment>  
            {!this.state.loaded ? (
              <LinearProgress  className="loading"/>
            ): (
              <React.Fragment> 
                <div  className="root-entrance">
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={12}>
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
                    <Grid item md={6} sm={12}>
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
                    <Grid container spacing={2}>
                      <Grid item md={3} sm={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="span" color="textSecondary" gutterBottom>
                              Tồn đầu ngày: 
                            </Typography>
                            <span className="stats_number"> {this.state.total_remain} </span>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item md={3} sm={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="span" color="textSecondary" gutterBottom>
                              Mới trong ngày:
                            </Typography>
                            <span className="stats_number"> {this.state.total_today} </span>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item md={3} sm={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="span"  color="textSecondary" gutterBottom>
                              Đã xử lý: 
                            </Typography>
                            <span className="stats_number"> {this.state.total_completed} </span>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item md={3} sm={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="span"  color="textSecondary" gutterBottom>
                              Tồn cuối ngày: 
                            </Typography>
                            <span className="stats_number"> {this.state.total} </span>
                            <a>
                              <GetAppIcon onClick={() => this.exportStats()} className="btn-export" />
                            </a>
                            
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                {
                  {
                    0: <StepInit 
                        centers = {this.state.selected_centers_param}
                      />,
                    1: <StepAppointment  centers = {this.state.selected_centers_param}/>,
                    2: <StepResult centers = {this.state.selected_centers_param}/>,
                    3: <StepInform centers = {this.state.selected_centers_param}/>,
                    4: <StepFinal centers = {this.state.selected_centers_param}/>,
                  }[this.state.activeStep]
                }
                

                {/* <div className="root-entrance">
                  <MaterialTable
                    title="Danh sách ghi danh"
                    data={this.state.data}
                    options={{
                        pageSize: 10,
                        pageSizeOptions: [20, 50, 200],
                        grouping: true,
                        filtering: true,
                        exportButton: true,
                        rowStyle: rowData => {
                          let today = new Date()
                          if(rowData.test_time){
                            let test_time = (rowData.test_time) ? rowData.test_time.split(' ')[0].split('/').map(t => parseInt(t)): NULL                      
                            if(today.getDate() == parseInt(test_time[0])  && today.getMonth()+1 == parseInt(test_time[1])  && today.getFullYear() == parseInt(test_time[2]) ){
                              return {backgroundColor: yellow[200]}
                            }
                          }
                          
                          if(rowData.priority >= 8){
                            return {backgroundColor: colors.orange[300],}
                          }
                          if(rowData.priority >= 6){
                            return {backgroundColor: colors.orange[200],}
                          }
                          if(rowData.priority >= 4){
                            return {backgroundColor: colors.orange[100],}
                          }
                          
                          
                          return {padding: '0px',}
                        },
                        filterCellStyle: {
                          paddingLeft: '0px'
                        }
                    }}
                    onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                    actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm mới ghi danh',
                            isFreeAction: true,
                            text: 'Thêm ghi danh',
                            onClick: (event) => {
                                this.props.history.push('/entrance/create')
                            },
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy ghi danh'
                        },
                        toolbar: {
                            searchTooltip: 'Tìm kiếm',
                            searchPlaceholder: 'Tìm kiếm',
                            nRowsSelected: '{0} hàng được chọn'
                        },
                        pagination: {
                            labelRowsSelect: 'dòng',
                            labelDisplayedRows: ' {from}-{to} của {count}',
                            firstTooltip: 'Trang đầu tiên',
                            previousTooltip: 'Trang trước',
                            nextTooltip: 'Trang tiếp theo',
                            lastTooltip: 'Trang cuối cùng'
                        },
                        grouping: {
                          placeholder: 'Kéo tên cột vào đây để nhóm'
                        }
                    }}
                    columns={this.state.columns}
                    detailPanel={rowData => {
                      let messages = (rowData.message)?rowData.message : []
                      let content = ''
                      return(
                        <Table className='' aria-label="simple table"  size="small">
                            <TableBody>
                                {messages.map(m => {return (
                                  <TableRow>
                                      <TableCell>{format(new Date(m.time*1000) , 'd/M/yyyy HH:mm')}</TableCell>
                                      <TableCell>{m.user}</TableCell>
                                      <TableCell>{m.content}</TableCell>
                                  </TableRow>
                                )})}
                                <TableRow>
                                  <TableCell>
                                    {format(new Date() , 'd/M/yyyy HH:mm')}
                                  </TableCell>
                                  <TableCell>
                                    
                                  </TableCell>
                                  <TableCell>
                                    <MessageInput entrance_id = {rowData.eid} updateMessage={this.updateMessage}/>
                                  </TableCell>
                                </TableRow>
                            </TableBody>                             
                        </Table>
                      )
                    }} 
                  />
                  <EditEntrance 
                    open={this.state.open_edit} 
                    handleCloseDialog={this.handleCloseDialogCreate}
                    updateTable = {this.updateTable}
                    entrance={this.state.selectedEntrance}
                  />
                  <AnswersDialog 
                    open_answers={this.state.open_answers}
                    handleCloseDialog={this.handleCloseAnswerDialog}
                    answers = {this.state.answers}
                  />
                </div>  */}
              </React.Fragment>
            )}
            </React.Fragment>
        )
    }
}
export default withSnackbar(ViewEntrance)