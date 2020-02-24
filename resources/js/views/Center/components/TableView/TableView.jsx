import React, {Fragment} from 'react';
import './TableView.scss'
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

class TableView extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            dataTableListCenter : [],
            rowSelected: [],
            openCreateUser: false,
            columns: [
                { title: 'Tên cơ sở', field: 'name' },
                { title: 'Địa chỉ', field: 'address' },
                { title: 'Email', field: 'email' },
                { title: 'Số điện thoại', field: 'phone' },
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never' },               
              ],
            data: [],
        }

    }
    

    getCenter = () =>{
        axios.get(window.Laravel.baseUrl + "/get-center")
            .then(response => {
                
                this.setState({
                    dataTableListCenter: response.data,
                    data: response.data
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }
    
    componentDidMount(){
        this.getCenter()
    }
    addNewCenter = (newData) => {        
        return axios.post(baseUrl + '/center/create', newData)
            .then((response) => {
                this.props.successNotification('Thêm thành công')
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
    editCenter = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/center/edit', req)
            .then(response => {
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data[oldData.tableData.id] = newData;
                    return { ...prevState, data };
                });
                this.props.successNotification('Sửa thành công')
            })
            .then(err => {
                
            })
    }
    deleteCenter = (oldData) => {
        return axios.post(baseUrl+ '/center/delete', {id: oldData.id})
            .then(response => {
                this.props.successNotification('Xóa thành công')
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
    render(){
        return(
            <Fragment>
                
                <MaterialTable
                    title="Quản lý cơ sở"
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{
                    onRowAdd: newData => this.addNewCenter(newData) ,
                    onRowUpdate: (newData, oldData) => this.editCenter(oldData, newData),
                    onRowDelete: oldData => this.deleteCenter(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không có cơ sở nào',
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
               
            </Fragment>
        );
    }
}

export default TableView