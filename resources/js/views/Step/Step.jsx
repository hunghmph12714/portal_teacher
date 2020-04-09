import React from 'react';
import './Step.scss'
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
export default class Step extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Quy trình', field: 'type' ,  defaultGroupOrder: 0,
                    lookup: { 'Quy trình đầu vào':'Tuyển sinh đầu vào' ,'Quy trình kiểm tra/thi thử':'Quy trình kiểm tra/thi thử',
                    'Quy trình tuyển dụng':'Tuyển dụng nhân sự','Quy trình hoàn trả học phí':'Quy trình hoàn trả học phí','Quy trình học bù/ phụ đạo':'Quy trình học bù/ phụ đạo' }, 
                },
                { title: 'Thứ tự', field: 'order' , type:'numeric', 
                    render: rowData => {
                        return (
                            <span>Bước {rowData.order}</span>
                        )
                    }
                },
                { title: 'Tên', field: 'name' },
                { title: 'Thời gian (ngày)', field: 'duration', type:'numeric', 
                    render: rowData => {
                        return (
                            <span>{rowData.duration} ngày</span>
                        )
                    }
                },
                { title: 'Giấy tờ', field: 'document', 
                    render: rowData => {
                        return (
                            <Button variant="contained" color="secondary" disabled={!rowData.document} onClick = {() => {window.open(rowData.document, '_blank')}}>
                                XEM
                            </Button>
                        )
                    }
                },
                // { title: 'Màu thẻ', field: 'color', 
                //   editComponent : props => (
                //     <TwitterPicker 
                //         color={ props.value }
                //         onChangeComplete={ color => props.onChange(color.hex) }
                //     />
                //   ),
                //   render : rowData => {
                //       let style = "background: "+ rowData.color +"; height: 30px; width: 30px; cursor: pointer; position: relative; outline: none; float: left; border-radius: 4px; margin: 0px 6px 6px 0px;"
                //       return <div style= {{background: rowData.color, height: '30px', width: '30px',  borderRadius: '4px',}}></div>
                //   }
                // },
                // { title: 'Người tạo', field: 'user_created', editable: 'never' },
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never' },               
            ],
            data: [],
            c: 10000,
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

    getStep = () =>{
        axios.get(window.Laravel.baseUrl + "/step/get")
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
        this.getStep()
    }
    addNewStep = (newData) => {        
        return axios.post(baseUrl + '/step/create', newData)
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
    editStep = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/step/edit', req)
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
    deleteStep = (oldData) => {
        return axios.post(baseUrl+ '/step/delete', {id: oldData.id})
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
            <div className="root-setting-step">
                <ReactNotification />
                <MaterialTable
                    title="Quy trình"
                    columns={this.state.columns}
                    data={this.state.data}
                    options = {{
                        grouping: true,
                        pageSize: 10,
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewStep(newData) ,
                        onRowUpdate: (newData, oldData) => this.editStep(oldData, newData),
                        onRowDelete: oldData => this.deleteStep(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy quy trình',
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

