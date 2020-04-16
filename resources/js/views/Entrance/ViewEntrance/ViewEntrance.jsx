import React, { Fragment } from 'react'
import './ViewEntrance.scss'
// import { DialogCreate } from './components';
import { EditEntrance } from '../EditEntrance';
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
  } from "@material-ui/core";
import { Grid } from '@material-ui/core';

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
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";

const baseUrl = window.Laravel.baseUrl;
const customChip = (color = '#ccc') => ({
  border: '1px solid ' + color,
  color: '#000',
  fontSize: '12px',
})
export default class ViewEntrance extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open_edit: false,
            data: [],
            activeStep: 0,
            steps: [],
            selectedEntrance: '',
        }
    }
   
    componentDidMount() {      
      this.getStep();
      this.getEntrance();
    }
    getEntrance = () => {
      axios.get(baseUrl + "/getentrance/-1")
        .then(response => {
          this.setState({
            data: response.data
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
      this.setState({activeStep : step})
    };
    handleOpenEditDialog = (rowData) => {
      this.setState({
        open_edit: true,
        selectedEntrance: rowData
      })
      console.log(rowData)
    }
    handleCloseDialogCreate = () => {
      this.setState({open_edit : false, selectedEntrance : ''})
    }
    updateTable = ( entrance ) => {

    }
    render(){
        return(
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
              <ReactNotification />
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
                      let test_time = rowData.test_time.split(' ')[0].split('/').map(t => parseInt(t))                          
                      if(today.getDate() == parseInt(test_time[0])  && today.getMonth()+1 == parseInt(test_time[1])  && today.getFullYear() == parseInt(test_time[2]) ){
                        return {backgroundColor: yellow[200],}
                      }
                      if(rowData.priority >= 2){
                        return {backgroundColor: orange[100],}
                      }
                      if(rowData.priority >= 3){
                        return {backgroundColor: orange[200],}
                      }
                      if(rowData.priority >= 4){
                        return {backgroundColor: orange[300],}
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
                          //   this.handleOpenDialogCreate()
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
                                  this.handleDeactivateClass(rowData.id, rowData.tableData.id)}
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
                  headerStyle: {
                      padding: '0px',
                      fontWeight: '600',
                      
                  },
                  cellStyle: {
                      padding: '0px',
                  },
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
                return (
                  <div> {rowData.step} </div>
                )
                
                }}
                     
              />
              <EditEntrance 
                open={this.state.open_edit} 
                handleCloseDialog={this.handleCloseDialogCreate}
                updateTable = {this.updateTable}
                entrance={this.state.selectedEntrance}
              />
            </div>
        
          </React.Fragment>
        )
    }
}