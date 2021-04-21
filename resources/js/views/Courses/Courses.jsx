import React from 'react';
import './Courses.scss'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

import {
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Button,    
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
import NumberFormat from 'react-number-format';

import axios from 'axios'

const baseUrl = window.Laravel.baseUrl;
function NumberFormatCustom(props) {
    const { inputRef, onChange, name, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        name: name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix="đ"
        />
    );
}
export default class Courses extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Tên khóa học', field: 'name' },
                { title: 'Khối', field: 'grade' },
                { title: 'Môn', field: 'domain' },
                { title: 'Tài liệu', field: 'document'},         
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never' },      
                { title: 'Học phí/ca', field: 'fee', type: "currency", 
                    currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
                    editComponent : props => (                        
                        <TextField
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                        name = "c"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                        />
                )},
                { title: 'Số buổi/tuần', field: 'class_per_week' },
                { title: 'Số ca/buổi', field: 'session_per_class' },
                { title: 'Hiển thị', field: 'showable' },
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
    
    getCourse = () =>{
        axios.get(window.Laravel.baseUrl + "/get-courses")
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
        this.getCourse()
    }
    addNewCourse = (newData) => {        
        return axios.post(baseUrl + '/course/create', newData)
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
    editCourse = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/course/edit', req)
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
    deleteCourse = (oldData) => {
        return axios.post(baseUrl+ '/course/delete', {id: oldData.id})
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
        document.title = 'Khóa học'

        return(
            <div className="root-base-salary">
                <ReactNotification />
                <MaterialTable
                    title="Quản lý khóa học"
                    columns={this.state.columns}
                    data={this.state.data}
                    options= {{
                        grouping: true
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewCourse(newData) ,
                        onRowUpdate: (newData, oldData) => this.editCourse(oldData, newData),
                        onRowDelete: oldData => this.deleteCourse(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không có khóa học nào',
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

