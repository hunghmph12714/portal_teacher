import React from 'react'
import './Classes.scss';
import { DialogCreate, CreateSession } from './components';
import {
    IconButton,
    Tooltip,
  } from "@material-ui/core";
import { Grid } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import MaterialTable from "material-table";
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import axios from 'axios';
import {format, subDays } from 'date-fns';

const baseUrl = window.Laravel.baseUrl;
const col = [
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
      // defaultGroupOrder: 2
  },
  {
      title: "Học phí",
      field: "fee",
      filtering: false,
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
    filtering: false,
    headerStyle: {
        padding: '0px',
        fontWeight: '600',
        
    },
    cellStyle: {
        padding: '0px',
    },
  },
  {
    title: "Đã nghỉ",
    field: "droped_number",
    type: "number",
    filtering: false,
    headerStyle: {
        padding: '0px',
        fontWeight: '600',
        
    },
    cellStyle: {
        padding: '0px',
    },
  },
  {
    title: "Đang chờ",
    field: "waiting_number",
    type: "number",
    filtering: false,
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
]
class Classes extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
          open_create: false,
          open_edit: false,
          data: [],
          selectedClass: [],
          selectedRow: '',
          dialogType: '',
          openCreateSession: false,          
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
    //Create Session
    handleOpenCreateSession = (rowData) => {
      this.setState({
        openCreateSession : true,
        selectedClass: rowData
      })
    }
    handleCloseCreateSession = () => {
      this.setState({
        openCreateSession: false,
        selectedClass: []
      })
    }
    handleCreateSession = (from_date, to_date, class_id) => {
      let data = {class_id: class_id, from_date: from_date.getTime()/1000, to_date: to_date.getTime()/1000}
      // console.log(data)
      this.handleCloseCreateSession()
      axios.post(baseUrl+'/session/create', data)
        .then(response => {
          this.props.enqueueSnackbar('Thêm thành công '+ response.data+' ca học', { 
            variant: 'success',
          });
          axios.get(window.Laravel.baseUrl + "/class/get/-1/-1")
          .then(response => {             
            this.setState({
                data: response.data
            })
            
          })
          .catch(err => {
              console.log('class get bug: ' + err)
          })

        })
        .catch(err => {
          console.log(err.response.data)
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
    handleClassDetail = (event, rowData) => {
      this.props.history.push('/class/'+rowData.id)
      console.log(rowData.tableData.id)
    }
    componentDidMount(){ 
      this.getClass()
    }
    render() {
        document.title = 'Danh sách lớp học'

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
                      onRowClick={(event, rowData) => this.handleClassDetail(event, rowData)}
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
                          {
                            icon: () => <EditOutlinedIcon />,
                            tooltip: 'Chỉnh sửa',
                            text: 'Chỉnh sửa',
                            onClick: (event, rowData) => {
                              this.handleOpenEditDialog(rowData)
                            }
                          },
                          {
                            icon: () => <PlaylistAddIcon />,
                            tooltip: 'Thêm ca học',
                            text: 'Thêm ca học',
                            onClick: (event, rowData) => {
                              this.handleOpenCreateSession(rowData)
                          },
                        },
                      ]}
                      localization={{
                          body: {
                              emptyDataSourceMessage: 'Không tìm thấy lớp học'
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
                    columns={col}
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
                      return (
                        <Grid container  id="class-detail" spacing={3}>
                          <Grid item md={12} lg={4} id="timetable">
                            <MaterialTable 
                              title= {"Lịch học lớp " + rowData.code}
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
                          <Grid item md={12} lg={4} id="actions">
                            
                          </Grid>
                          
                        </Grid>
                        
                      )
                      
                    }}
                     
                />
                <CreateSession
                  open={this.state.openCreateSession}
                  handleClose={this.handleCloseCreateSession}
                  selectedClass = {this.state.selectedClass}
                  handleCreateSession= {this.handleCreateSession}
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
export default withSnackbar(Classes)