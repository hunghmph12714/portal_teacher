import React from 'react';
import './Objective.scss'
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
import NumberFormat from 'react-number-format';
import { TwitterPicker } from 'react-color';
import { withSnackbar } from 'notistack';
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
class Objective extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Khối', field: 'grade' ,  
                    lookup: { 5: 'Khối 5', 9: 'Khối 9' },
                    headerStyle: {
                        fontWeight: '600',
                    },
                },
                {
                    title: 'Nội dung mục tiêu', field: 'content',
                    headerStyle: {
                        fontWeight: '600',
                    },
                },
                {
                    title: 'Người tạo', field: 'name',
                    headerStyle: {
                        fontWeight: '600',
                    },editable: 'never'
                },
                {
                    title: 'Ngày tạo', field: 'created_at',
                    headerStyle: {
                        fontWeight: '600',
                    },editable: 'never'
                }
                                           
            ],
            data: [],
            c: 10000,
        }
    }
    
    

    getObjective = () =>{
        axios.post(window.Laravel.baseUrl + "/objective/get", {type: -1})
            .then(response => {
                this.setState({
                    data: response.data
                })
            })
            .catch(err => {
                console.log('objective bug: ' + err)
            })
    }
    
    componentDidMount(){
        this.getObjective()
    }
    addNewObjective = (newData) => {        
        return axios.post(baseUrl + '/objective/create', newData)
            .then((response) => {
                this.props.enqueueSnackbar('Thêm mục tiêu thành công', { 
                    variant: 'success',
                });
                this.setState(prevState => {
                    let data = [...prevState.data];
                    data.push(response.data);
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                console.log("Add new objective bug: "+ err)
            })
    }
    editObjective = (oldData, newData) => {

        newData.id = oldData.id
        return axios.post(baseUrl + '/objective/edit', newData)
            .then(response => {
                this.props.enqueueSnackbar('Sửa mục tiêu thành công', { 
                    variant: 'success',
                });                
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data[oldData.tableData.id] = newData;
                    return { ...prevState, data };
                });
            })
            .then(err => {
                console.log(err)
            })
    }
    deleteObjective = (oldData) => {
        return axios.post(baseUrl+ '/objective/delete', {id: oldData.id})
            .then(response => {
                this.setState(prevState => {
                    let data = [...prevState.data];
                    
                    this.props.enqueueSnackbar('Xóa mục tiêu thành công', { 
                        variant: 'success',
                    });    
                    data = data.filter(d => d.id != oldData.id)
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                console.log('delete Center bug: ' + err)
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        document.title = 'Mục tiêu học tập'

        return(
            <div className="root-setting-objective">
                <ReactNotification />
                <MaterialTable
                    title="Mục tiêu học tập"
                    columns={this.state.columns}
                    data={this.state.data}
                    options = {{
                        grouping: true,
                        pageSize: 10,
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewObjective(newData) ,
                        onRowUpdate: (newData, oldData) => this.editObjective(oldData, newData),
                        onRowDelete: oldData => this.deleteObjective(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy mục tiêu',
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

export default withSnackbar(Objective);