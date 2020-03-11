import React from 'react';
import './Room.scss'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

import {
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
    Tooltip,
  } from "@material-ui/core";
import MaterialTable from "material-table";
import {MTableAction} from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icofont from "react-icofont";

import axios from 'axios'

const baseUrl = window.Laravel.baseUrl;

export default class Room extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Tên phòng', field: 'name' },
                { title: 'Cơ sở', field: 'center_id' },
                { title: 'Tình trạng', field: 'status', lookup: {1: 'Đang hoạt động', 2: 'Ngưng hoạt động'}},         
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never' },               
              ],
            data: [],
            c: 10000,
            centers: {}
        }
    }
    successNotification = (successMessage) => {
        store.addNotification({
          title: 'Thành công',
          message: successMessage,
          type: 'success',                         // 'default', 'success', 'info', 'warning'
          container: 'bottom-right',                // where to position the notifications
          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
          width: 300,
          dismiss: {
            duration: 3000
          }
        })
    }
    errorNotification = (errorMessage) => {
        store.addNotification({
          title: 'Có lỗi',
          message: errorMessage,
          type: 'danger',                         // 'default', 'success', 'info', 'warning'
          container: 'bottom-right',                // where to position the notifications
          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
          width: 300,
          dismiss: {
            duration: 3000
          }
        })
    }
    getCenter = () => {
        axios.get(window.Laravel.baseUrl + "/get-center")
            .then(response => {
                let lp = {}
                for (const center of response.data){
                    lp[center.id] = center.name
                }
                let center_col = { title: 'Cơ sở', field: 'center_id', lookup : lp }
                this.setState(prevState => {
                    const columns = [...prevState.columns]
                    columns[1] = center_col
                    return {...prevState, columns}
                })
            })
    }
    getRoom = () =>{
        axios.get(window.Laravel.baseUrl + "/get-rooms")
            .then(response => {
                this.setState({
                    data: response.data
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }
    
    componentDidMount(){
        this.getRoom()
        this.getCenter()
    }
    addNewRoom = (newData) => {        
        return axios.post(baseUrl + '/room/create', newData)
            .then((response) => {
                this.successNotification('Thêm thành công')
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.push(response.data);
                    return { ...prevState, data };
                    });
            })
            .catch(err => {
                console.log("Add new center bug: "+ err)
            })
    }
    editRoom = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/room/edit', req)
            .then(response => {
                console.log(response)
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data[oldData.tableData.id] = newData;
                    return { ...prevState, data };
                });
                this.successNotification('Sửa thành công')
            })
            .then(err => {
                console.log(err)
            })
    }
    deleteRoom = (oldData) => {
        return axios.post(baseUrl+ '/room/delete', {id: oldData.id})
            .then(response => {
                this.successNotification('Xóa thành công')
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                this.props.errorNotification('Có lỗi')
                console.log('delete Center bug: ' + err)
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        return(
            <div className="root-base-salary">
                <ReactNotification />
                <MaterialTable
                    title="Quản lý phòng học"
                    columns={this.state.columns}
                    data={this.state.data}
                    options= {{
                        grouping: true
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewRoom(newData) ,
                        onRowUpdate: (newData, oldData) => this.editRoom(oldData, newData),
                        onRowDelete: oldData => this.deleteRoom(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không có phòng học nào',
                          editRow:{
                            deleteText: 'Bạn có chắc muốn xóa dòng này ?',
                            cancelTooltip: 'Đóng',
                            saveTooltip: 'Lưu'
                          },
                          deleteTooltip: "Xóa",
                          addTooltip: "Thêm mới"
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
                />
            </div>
        );
    }
}

