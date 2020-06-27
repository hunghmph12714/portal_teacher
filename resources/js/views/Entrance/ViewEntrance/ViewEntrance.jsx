import React, { Fragment, useState, useEffect } from 'react'
import './ViewEntrance.scss'
// import { DialogCreate } from './components';
import { EditEntrance } from '../EditEntrance';
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
  } from "@material-ui/core";
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
import { withSnackbar } from 'notistack'
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
            answers : [],
            data: [],
            activeStep: 0,
            steps: [],
            selectedEntrance: '',
            loaded: false,
            message: '',
        }
    }
   
    componentDidMount() {      
      this.getStep();
      this.getEntrance();
    }
    getEntrance = () => {
      // console.log(this.state.steps)
      axios.get(baseUrl + "/get-entrance/-1 ")
        .then(response => {
          let r = {}
          r = response.data.map(d => {
            d.test_answers = (d.test_answers)?d.test_answers.split(','):null
            return d
          })
          this.setState({
            data: r,
            loaded: true,
          })
        })
    }
    getStep = () =>{
      axios.post(window.Laravel.baseUrl + "/step/get", {type: 'Quy trình đầu vào'})
        .then(response => {
            this.setState({
                steps: response.data
            })
        })
        .catch(err => {
            console.log('step bug: ' + err)
        })
    }
    handleStep = step => () => {
      let step_id = this.state.steps[step].id
      axios.get(baseUrl + '/get-entrance/'+step_id)
        .then(response => {
          this.setState({
            data: response.data,
          })
        })
        .catch(err => {
          console.log(err.response.data)
        })
      this.setState({activeStep : step})
    };
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
      console.log(rowData)
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
    render(){      
        return(          
          <React.Fragment>  
            {!this.state.loaded ? (
              <LinearProgress  className="loading"/>
            ): (
              <React.Fragment> 
                <div className="root-entrance">
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
                <div className="root-entrance">
                  <MaterialTable
                    title="Danh sách ghi danh"
                    data={this.state.data}
                    options={{
                        pageSize: 10,
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
                            emptyDataSourceMessage: 'Không tìm thấy ghi danh hoặc sever gặp lỗi'
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
                    columns={[
                      {
                        title: "",
                        field: "action",
                        filtering: false,
                        disableClick: true,
                        sorting: false,
                        headerStyle: {
                            padding: '0px',
                            width: '90px',
                        },
                        cellStyle: {
                            width: '90px',
                            padding: '0px',
                        },
                        render: rowData => (
                            <div style = {{display: 'block'}}>
                                {/* {rowData.tableData.id} */}
                                <Tooltip title="Chỉnh sửa" arrow>
                                  <IconButton onClick={() => {this.handleOpenEditDialog(rowData)}}>
                                    <EditOutlinedIcon fontSize='inherit' />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa ghi danh" arrow>
                                  <IconButton onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                                      this.handleDeleteEntrance(rowData.eid, rowData.tableData.id)}
                                    }>
                                  <DeleteForeverIcon fontSize='inherit' />
                                  </IconButton>
                                </Tooltip>                                
                            </div>
                        )
                      },
                    //Học sinh
                      {
                        title: "Học sinh",
                        field: "sname",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {
                          return (                                
                            <Typography variant="body2" component="p">                                    
                                <b>{rowData.sname}</b>
                                <br /> {rowData.dob}
                            </Typography>
                            
                          )
                        },
                        
                        renderGroup: (sname, groupData) => (
                          <Chip variant="outlined" label={sname} size="small" />      
                        )
                      },
                    //Phụ huynh
                      {
                        title: "Phụ huynh",
                        field: "pname",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '3px 0px',
                        },
                        render: rowData => 
                          (                              
                            <Typography variant="body2" component="p">
                                <b>{rowData.pname}</b> 
                                <br />{rowData.phone} 
                                <br />{rowData.pemail}
                            </Typography>                              
                          ),
                        renderGroup: (pname, groupData) => (
                          <Chip variant="outlined" label={pname} size="small" />       
                        )

                      },
                    //Quan hệ
                      {
                        title: "Quan hệ",
                        field: "rname",
                        headerStyle: {
                            padding: '0px',
                            width: '120px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                            width: '120px',
                        },
                        render: rowData => {
                          return (                              
                            <Chip style={customChip(rowData.color)} variant="outlined" label={rowData.rname} size="small" />                         
                          )
                        },
                        renderGroup: (rname, groupData) => (                            
                          <Chip variant="outlined" label={rname} size="small" />
                        )                
                      },
                    //Trung tâm
                      {
                        title: "Cơ sở",
                        field: "center",         
                        headerStyle: {
                            padding: '0px',
                            width: '90px',
                            fontWeight: '600',
                        },  
                        cellStyle: {
                            padding: '0px 8px 0px 0px',
                            width: '90px',
                        },
                        render: rowData => {
                          let brief = rowData.center.split(':')[0]
                          return (
                            <Tooltip title={rowData.center}>
                              <Chip variant="outlined" label={brief} size="small" />
                            </Tooltip> 
                          )
                        },
                        renderGroup: (center, groupData) => (                            
                          <Chip variant="outlined" label={center} size="small" />
                        )  
                      },
                    // Khóa học
                      {
                          title: "Khóa học",
                          field: "course",
                          headerStyle: {
                              padding: '0px',
                              fontWeight: '600',
                          },
                          cellStyle: {
                              padding: '0px',
                          },
                      },                  
                    //Lịch KTDV
                      {
                        title: "Lịch KTDV",
                        field: "test_time",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },                            
                      },
                    //
                      {
                      title: "Bài làm",
                      field: "test_answers",     
                      grouping: false,                   
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',                      
                      },
                      cellStyle: {
                          padding: '0px',
                      },
                      render: rowData => {                    
                        return (rowData.test_answers) ? (
                          <Button variant="contained" color="secondary" onClick = {() => this.handleOpenAnswerDialog(rowData)}>
                            Kiểm tra
                          </Button>
                        ): ("")
                      } 
                    },
                    {
                      title: "Số điểm",
                      field: "test_score",
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          padding: '0px',
                      },
                    },
                    {
                      title: "Nhận xét",
                      field: "test_note",
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          padding: '0px',
                      },
                    },
                    {
                      title: "Trạng thái",
                      field: "status",
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          padding: '0px',
                      },
                    },
                    
                  ]}
                  detailPanel={rowData => {
                    if(rowData.message){
                      let messages = rowData.message
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
                    }
                  
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
                </div> 
              </React.Fragment>
            )}
            </React.Fragment>
        )
    }
}
export default withSnackbar(ViewEntrance)