import React, {useState, useEffect} from 'react';
import './Discount.scss'
import {DiscountDialog} from './components';

import {
    Tooltip,
    Typography,
  } from "@material-ui/core";
import MaterialTable from "material-table";
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import {MTableAction} from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icofont from "react-icofont";
import NumberFormat from 'react-number-format';
import Select , { components }  from "react-select";

import { TwitterPicker } from 'react-color';

import {StudentSearch} from '../../components'
import axios from 'axios'
import { withSnackbar } from 'notistack'
const baseUrl = window.Laravel.baseUrl;
var student_id = 0;
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
//

class Discount extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
            // Mã ưu đãi
                {
                    title: 'Mã',
                    field: 'did',
                    editable: 'never',
                    headerStyle: {
                        width: '50px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        width: '50px'
                    }
                },
            //Học sinh
                {
                    title: "Học sinh",
                    field: "sname",
                    headerStyle: {
                        fontWeight: '600',
                        width: '25%',
                    },
                    cellStyle: {
                    },
                    render: rowData => {
                      return (
                        <Tooltip title={'Phụ huynh: '+rowData.pname} aria-label="student">
                            <Typography variant="body2" component="p">                                    
                                <b>{rowData.sname}</b>
                                <br /> {rowData.dob}
                            </Typography>
                        </Tooltip>       
                      )
                    },
                    editComponent : props => (
                        <StudentSearch
                            student_name={props.value}
                            handleStudentChange={newValue => {
                                props.onChange(newValue)
                                student_id = newValue.sid
                            }}
                        />
                    )
                },
            // Lớp học
                {
                    title: "Lớp",
                    field: "class",
                    headerStyle: {
                        fontWeight: '600',
                        width: '15%',
                    },
                    cellStyle: {
                        width: '15%',
                    },
                    render: rowData => {
                        return (
                            <div> {rowData.code} </div>
                        )
                    },                        
                    
                },
            // Coupon
                {
                    title: "%",
                    field: "percentage",
                    headerStyle: {
                        fontWeight: '600',
                        width: '50px',
                    },
                    cellStyle: {
                        width: '50px',
                    },

                },
            // Voucher
                {
                    title: "VNĐ",
                    field: "amount",
                    type: "numeric",
                    headerStyle: {
                        fontWeight: '600',
                        width: '8%%',
                    },
                    cellStyle: {
                        width: '8%',
                    },
                    render: rowData => {
                        return (<NumberFormat 
                            thousandSeparator
                            displayType={'text'}
                            prefix="đ"    
                            value={rowData.amount}                        
                        
                        />)
                    }

                },
            // Active date
                {
                    title: "Hiệu lực",
                    field: "active_at",
                    type: "date",
                    headerStyle: {
                        fontWeight: '600',
                        width: '10%',
                    },
                    cellStyle: {
                        width: '10%',
                    },

                },
            //Expired date
                {
                    title: "Hết hạn",
                    field: "expired_at",
                    type: "date",
                    headerStyle: {
                        fontWeight: '600',
                        width: '10%',
                    },
                    cellStyle: {
                        width: '10%',
                    }
                },
            //Max use
                // {
                //     title: "Số lần",
                //     field: "max_use",
                //     type: "numeric",
                //     headerStyle: {
                //         fontWeight: '600',
                //         width: '5%',
                //     },
                //     cellStyle: {
                //         width: '5%',
                //     }
                // },
            //Status
                {
                    title: "Tình trạng",
                    field: "status",
                    lookup: {'active': 'Đã kích hoạt', 'deactive': 'Vô hiệu hóa','expired': 'Hết hạn'},
                    headerStyle: {
                        fontWeight: '600',
                        width: '8%',
                    },
                    cellStyle: {
                        width: '8%',
                    }
                }
            ],
            data: [],
            c: 10000,
            open: false,
            selectedRow: null,
            type: 'create',
        }
    }
    handleOpenDialog = () => {
        this.setState({
            type: 'create',
            open: true,
        })
    }
    handleOpenEdit = (rowData) => {
        this.setState({
            open: true,
            selectedRow: rowData,
            type: 'edit'
        })
    }
    handleCloseDialog = () => {
        this.getDiscount()
        this.setState({open: false})
    }
    getDiscount = () =>{
        axios.get(window.Laravel.baseUrl + "/discount/get")
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
        this.getDiscount()
    }
    
    //edit
    editDiscount = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/discount/edit', newData)
            .then(response => {
                this.getDiscount()
                this.props.enqueueSnackbar('Sửa ưu đãi thành công', {
                    variant: 'success'
                })
            })
            .catch(err => {
                if(err.response.status == '421'){
                    this.props.enqueueSnackbar(err.response.data, { 
                        variant: 'error',
                      });
                }
                if(err.response.status == 500){
                    this.props.enqueueSnackbar('Lỗi server, vui lòng thử lại sau', {
                        variant: 'error',
                    })
                }
                if(err.response.status == 422){
                    this.props.enqueueSnackbar('Vui lòng điền đầy đủ các trường', {
                        variant: 'error',
                    })
                }
            })
    }
    deleteDiscount = (oldData) => {
        return axios.post(baseUrl+ '/discount/delete', {id: oldData.did})
            .then(response => {
                this.props.enqueueSnackbar('Xóa thành công', {
                    variant: 'success'
                })
                this.setState(prevState => {
                    const datas = [...prevState.data];                    
                    const data = datas.filter(d => d.did !== oldData.did)
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', {
                    variant: 'error'
                })
                console.log('delete Center bug: ' + err)
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        document.title = 'Ưu đãi'

        return(
            <div className="root-discount">
                <MaterialTable
                    title="Ưu đãi"
                    columns={this.state.columns}
                    data={this.state.data}
                    options = {{
                        pageSize: 10,
                        filter: true,
                    }}
                    actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm mới ưu đãi',
                            isFreeAction: true,
                            text: 'Thêm ưu đãi',
                            onClick: (event) => {
                                this.handleOpenDialog()
                            },
                        },
                        {
                            icon: () => <EditOutlinedIcon />,
                            tooltip: 'Sửa ưu đãi',
                            isFreeAction: false,
                            text: 'Sửa ưu đãi',
                            onClick: (event, rowData) => {
                                this.handleOpenEdit(rowData)
                            },
                        },
                        {
                            icon: () => <DeleteForeverIcon />,
                            tooltip: 'Xoá ưu đãi',
                            isFreeAction: false,
                            text: 'Xoá ưu đãi',
                            onClick: (event, rowData) => {
                                if (window.confirm('Bạn có chắc muốn xóa bản ghi này? !')) this.deleteDiscount(rowData)
                            },
                        },
                        
                    ]}
                    // editable={{
                    //     onRowAdd: newData => this.addNewDiscount(newData) ,
                    //     onRowUpdate: (newData, oldData) => this.editDiscount(oldData, newData),
                    //     onRowDelete: oldData => this.deleteDiscount(oldData),
                    // }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy ưu đãi',
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
                <DiscountDialog 
                    open = {this.state.open}
                    handleClose = {this.handleCloseDialog}
                    type = {this.state.type}
                    selected_data = {this.state.selectedRow}
                />
            </div>
        );
    }
}

export default withSnackbar(Discount)