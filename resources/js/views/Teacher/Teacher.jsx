import React from 'react';
import { DialogCreate, DialogEdit } from './components';
import './Teacher.scss';
import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import MaterialTable from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import axios from 'axios';

const baseUrl = window.Laravel.baseUrl;

class Teacher extends React.Component{
  constructor(props){
      super(props)
      this.state = {
        open_create: false,
        open_edit: false,
        data: [],
        anchorElOptionTeacher: false,
        selectedTeacher: []
      }
  }
  getTeacher = () => {
    axios.get(window.Laravel.baseUrl + "/get-teacher")
        .then(response => {                
            this.setState({
                data: response.data
            })
        })
        .catch(err => {
            console.log('center bug: ' + err)
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
  //ADD TEACHER
  handleCloseDialogCreate = () => {
    this.setState({ open_create: false })
  }
  handleOpenDialogCreate = () => {
    this.setState({ open_create : true })
  }
  updateTable = (newTeacher) => {
    let teacher = {}
  }

  handleCloseDialogEdit = () => {
    this.setState({ open_edit : false })
  }
  //EDIT TEACHER
  handleOpenEditDialog = (data) => {
    console.log("abc: " + data.tableData.id)
    this.setState({ 
      open_edit : true,
      selectedTeacher: data
    })
  }
  handleCloseEditDialog = () => {
    this.setState({ open_edit: false,  selectedTeacher: [] })
  }
  handleClickOptionTeacher = event => {
    this.setState({ anchorElOptionTeacher: event.currentTarget });
  };

  handleCloseOptionTeacher = () => {
      this.setState({ anchorElOptionTeacher: null });
  };
  componentDidMount(){ 
    this.getTeacher()
  }
  render() {
      return(
          <div className="root-teacher">
              <ReactNotification />
              <MaterialTable
                    title="Danh sách giáo viên"
                    data={this.state.data}
                    options={{
                        pageSize: 10,
                        grouping: true,
                        rowStyle: {
                            padding: '0px',
                        }
                    }}
                    onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                    actions={[                       
                        {
                            icon: () => <PersonAddIcon />,
                            tooltip: 'Thêm giáo viên',
                            isFreeAction: true,
                            text: 'Thêm giáo viên',
                            onClick: (event) => {
                                this.handleOpenDialogCreate()
                            },
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy giáo viên hoặc sever gặp lỗi'
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
                        }
                    }}
                    columns={[
                      {
                        title: "",
                        field: "action",
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
                                    <EditOutlinedIcon fontSize='medium' />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Dừng hợp đồng" arrow>
                                  <IconButton onClick={() => this.handleClickOpenConfirm('tắt', rowData.id)}>
                                    <BlockOutlinedIcon fontSize='medium' />
                                  </IconButton>
                                </Tooltip>                                
                            </div>
                        )
                    },
                    {
                        title: "Tên giáo viên",
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
                        title: "Bộ môn",
                        field: "domain",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                    },
                    {
                        title: "Email",
                        field: "email",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                    },

                    {
                        title: "Số điện thoại",
                        field: "phone",         
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },  
                        cellStyle: {
                            padding: '0px',
                        },             
                    },
                    {
                        title: "Trường",
                        field: "school",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                    },
                    
                    ]}
                   
              />
              <DialogCreate open={this.state.open_create} handleCloseDialog={this.handleCloseDialogCreate} updateTable = {this.updateTable}/>
              <DialogEdit 
                open = {this.state.open_edit} 
                handleCloseDialog={this.handleCloseDialogEdit} 
                teacher={this.state.selectedTeacher}
              />
          </div>
      )
  }
}
export default Teacher;