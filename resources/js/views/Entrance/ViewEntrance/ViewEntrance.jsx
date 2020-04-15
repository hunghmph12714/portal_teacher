import React from 'react'
import './ViewEntrance.scss'
// import { DialogCreate } from './components';
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
  } from "@material-ui/core";
import { Grid } from '@material-ui/core';

import MaterialTable from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import axios from 'axios';
import {format, subDays } from 'date-fns';
import Chip from '@material-ui/core/Chip';
const baseUrl = window.Laravel.baseUrl;
const customChip = (color = '#ccc') => ({
  border: '1px solid ' + color,
  color: color,
  fontSize: '12px',
})
export default class ViewEntrance extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open_edit: false,
            data: [],
        }
    }
    componentDidMount() {
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
    notification = (message, type) => {
        store.addNotification({
          title: (type == "success") ? 'Thành công' : 'Có lỗi',
          message: message,
          type: type,                         // 'default', 'success', 'info', 'warning'
          container: 'bottom-right',                // where to position the notifications
          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
          width: 300,
          dismiss: {
            duration: 3000
          }
        })
      }
    render(){
        return(
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
                          rowStyle: {
                            padding: '0px',
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
                          renderGroup: (center,groupData) => {
                            <Chip variant="outlined" label={center} size="small" />
                          }
                        },
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
                      let configs = JSON.parse(rowData.config)
                      if(!configs){
                        return( <span> Chưa cài đặt lịch học </span>)
                      }
                      // console.log(configs)
                      let c = configs.map(config => {
                        let conf = {date: '', from: '', to: '', teacher: '',room: ''}
                        conf.date = config.date.label
                        conf.teacher = config.teacher.label
                        conf.room = config.room.label
                        conf.time = format(new Date(config.from*1000), 'H:mm') + " - " + format(new Date(config.to * 1000), 'H:mm')
                        return conf
                      })
                      console.log(c)
                      return (
                        <Grid container  id="class-detail">
                          <Grid item md={12} lg={6} id="timetable">
                            <MaterialTable 
                              title= {"Lịch học lớp" + rowData.code}
                              options = {{
                                paging: false,
                                search: false
                              }}
                              data= {c}
                              columns={[
                                {
                                  title: "Ngày học",
                                  field: "date",
                                  headerStyle: {
                                    fontWeight: '600',                                    
                                  },
                                  
                                },
                                {
                                  title: "Giờ học",
                                  field: "time",
                                  headerStyle: {
                                    fontWeight: '600',                                    
                                  },
                                },
                                {
                                  title: "Giáo viên",
                                  field: "teacher",
                                  headerStyle: {
                                    fontWeight: '600',                                    
                                  },
                                },
                                {
                                  title: "Phòng học",
                                  field: "room",
                                  headerStyle: {
                                    fontWeight: '600',                                    
                                  },
                                }

                              ]}
                            />
                          </Grid>
                          <Grid item md={12} lg={6} id="actions">
                          </Grid>
                          
                        </Grid>
                        
                      )
                      
                    }}
                     
                />
                {/* <DialogCreate 
                  open={this.state.open_create} 
                  handleCloseDialog={this.handleCloseDialogCreate}
                  updateTable = {this.updateTable}
                  notification = {this.notification}
                  class={this.state.selectedClass}
                  dialogType = {this.state.dialogType}
                /> */}
            </div>
        )
    }
}