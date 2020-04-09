import React from 'react'
import './Classes.scss';
import { DialogCreate } from './components';
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

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import axios from 'axios';
import {format, subDays } from 'date-fns';

const baseUrl = window.Laravel.baseUrl;
//1
export default class Classes extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          open_create: false,
          open_edit: false,
          data: [],
          selectedClass: [],
          selectedRow: '',
          dialogType: '',
        }
    }
    getClass = () => {
      axios.get(window.Laravel.baseUrl + "/class/get/-1/-1")
          .then(response => {                
              this.setState({
                  data: response.data
              })
          })
          .catch(err => {
              console.log('class get bug: ' + err)
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
    //ADD CLASSES
    handleCloseDialogCreate = () => {
      this.setState({ open_create: false, selectedClass: [] })
    }
    handleOpenDialogCreate = () => {
      this.setState({ open_create : true, dialogType : 'create' })
    }
    updateTable = (classes) => {
      if(this.state.dialogType == 'create'){
        this.setState(prevState => {
          const data = [...prevState.data]
          data.push(classes)
          return {...prevState, data}
        })
      }
      if(this.state.dialogType == 'edit'){
        const rowId = this.state.selectedClass.tableData.id
        this.setState(prevState => {
          const data = [...prevState.data]
          data[rowId] = classes
          return {...prevState, data}
        })
      }
    }
  
    //EDIT CLASS
    handleOpenEditDialog = (data) => {
      this.setState({ 
        open_create : true,
        dialogType: 'edit',
        selectedClass: data,
      })
    }
  
    handleDeactivateClass = (id, rowId) => {
      console.log(id)
      axios.post(baseUrl + '/class/delete', {id: id})
        .then(response => { 
          this.setState(prevState => {
            const data = [...prevState.data]
            data.splice(rowId, 1);
            return {...prevState, data}
          })
          this.notification('Đã đóng lớp', 'success')
        })
        .catch(err => {
          console.log('Ket thuc lop bug: '+ err)
        })
    }
    componentDidMount(){ 
      this.getClass()
    }
    render() {
        return(
            <div className="root-class">
                <ReactNotification />
                <MaterialTable
                      title="Danh sách lớp học"
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
                              tooltip: 'Thêm lớp học',
                              isFreeAction: true,
                              text: 'Thêm lớp học',
                              onClick: (event) => {
                                  this.handleOpenDialogCreate()
                              },
                          },
                      ]}
                      localization={{
                          body: {
                              emptyDataSourceMessage: 'Không tìm thấy lớp học hoặc sever gặp lỗi'
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
                              width: '130px',
                          },
                          cellStyle: {
                              width: '130px',
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
                                  <Tooltip title="Xóa lớp học" arrow>
                                    <IconButton onClick={() => {
                                      if (window.confirm('Bạn có chắc muốn xóa lớp học này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                                        this.handleDeactivateClass(rowData.id, rowData.tableData.id)}
                                      }>
                                    <DeleteForeverIcon fontSize='inherit' />
                                    </IconButton>
                                  </Tooltip>                                
                              </div>
                          )
                      },
                      {
                          title: "Tên lớp",
                          field: "name",
                          headerStyle: {
                              padding: '0px',
                              fontWeight: '600',
                          },
                          cellStyle: {
                              padding: '0px',
                          },
                      },
                      {
                          title: "Mã lớp",
                          field: "code",
                          headerStyle: {
                              padding: '0px',
                              fontWeight: '600',
                          },
                          cellStyle: {
                              padding: '0px',
                          },
                      },                  
                      {
                          title: "Cơ sở",
                          field: "center",         
                          headerStyle: {
                              padding: '0px',
                              fontWeight: '600',
                          },  
                          cellStyle: {
                              padding: '0px',
                          },             
                      },
                      {
                          title: "Học phí",
                          field: "fee",
                          headerStyle: {
                              padding: '0px',
                              fontWeight: '600',
                              textAlign: 'right'
                          },
                          type: "currency", 
                          currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
                          
                      },
                      {
                        title: "Sĩ số",
                        field: "student_number",
                        type: "number",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                            
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                      },
                      {
                        title: "Khai giảng",
                        field: "open_date",
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
                <DialogCreate 
                  open={this.state.open_create} 
                  handleCloseDialog={this.handleCloseDialogCreate}
                  updateTable = {this.updateTable}
                  notification = {this.notification}
                  class={this.state.selectedClass}
                  dialogType = {this.state.dialogType}
                />
            </div>
        )
    }
}