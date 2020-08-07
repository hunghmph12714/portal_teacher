import React, {useState, useEffect} from 'react';
import './AdjustFee.scss'
import {StudentSearch} from '../../components'
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
    Typography,
  } from "@material-ui/core";
import MaterialTable from "material-table";
import {MTableAction} from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icofont from "react-icofont";
import NumberFormat from 'react-number-format';
import Select , { components }  from "react-select";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { TwitterPicker } from 'react-color';

import axios from 'axios'
import { withSnackbar } from 'notistack'
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
const ClassSelect = React.memo(props => {
    const {center, course} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchData = async() => {
            const r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            setClasses(r.data.map(c => {
                    // console.log(c)
                    return {label: c.code + ' - ' +c.name, value: c.id}
                })
            )
        }
        fetchData()
    }, [])
    
    return( 
        <Select
            isMulti= {props.isMulti}
            key = "class-select"
            value = {props.selected_class}
            name = "selected_class"
            placeholder="Chọn lớp"
            isClearable
            options={classes}
            onChange={props.handleChange}
        />)
})
class AdjustFee extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                {
                    title: "",
                    field: "action",
                    filtering: false,
                    disableClick: true,
                    sorting: false,
                    headerStyle: {
                        padding: '0px',
                        width: '50px',
                    },
                    cellStyle: {
                        width: '50px',
                        padding: '0px',
                    },
                    render: rowData => (
                        <div style = {{display: 'block'}}>
                            {/* {rowData.tableData.id} */}
                            <Tooltip title="Áp dụng ngay" arrow>
                              <IconButton onClick={() => {
                                  if (window.confirm('Chắc chắn ap dụng điều chỉnh học phí lên lớp' + rowData.code + ' ? Sau khi áp dụng sẽ không thể thay đổi.')) 
                                  this.handleApplyAdjustment(rowData.did)}
                                } disabled={rowData.status == 'expired'}>
                                <EventAvailableIcon fontSize='inherit'/>
                              </IconButton>
                            </Tooltip>
                                               
                        </div>
                    )
                  },
            // Mã điều chỉnh
                {
                    title: 'Mã',
                    field: 'did',
                    editable: 'never',
                    headerStyle: {
                        width: '80px',
                        fontWeight: '600',
                    },
                    cellStyle: {
                        width: '80px'
                    }
                },            
            // Lớp học
                {
                    title: "Lớp",
                    field: "code",
                    headerStyle: {
                        fontWeight: '600',
                        padding: '0px',
                        width: '25%'
                    },
                    cellStyle: {
                        width: '25%',
                        padding: '0px',
                    },
                    render: rowData => {
                        return (
                            <div> {rowData.code} </div>
                        )
                    },
                    editComponent : props => {
                            return (
                                <ClassSelect 
                                    selected_class = {props.value}
                                    isMulti = {true}
                                    handleChange = {newValue => {props.onChange(newValue)}}
                                    course = {-1}
                                    center = {-1}
                            />
                        )
                    }
                        
                    
                },            
            // Voucher
                {
                    title: "Số tiền điều chỉnh theo ca học",
                    field: "amount",
                    type: "numeric",
                    headerStyle: {
                        fontWeight: '600',
                    },
                    cellStyle: {
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
                {
                    title: "%",
                    field: "percentage",
                    type: "numeric",
                    headerStyle: {
                        fontWeight: '600',
                    },
                    cellStyle: {
                    },
                },
            // Active date
                {
                    title: "Hiệu lực",
                    field: "active_at",
                    type: "date",
                    headerStyle: {
                        fontWeight: '600',
                    },
                    cellStyle: {
                    },

                },
            //Expired date
                {
                    title: "Hết hạn",
                    field: "expired_at",
                    type: "date",
                    headerStyle: {
                        fontWeight: '600',
                    },
                    cellStyle: {
                    }
                },
                {
                    title: "Nội dung",
                    field: "content",
                    headerStyle: {
                        fontWeight: '600',
                    },
                    cellStyle: {
                    }
                },
           
            //Status
                {
                    title: "Tình trạng",
                    field: "status",
                    lookup: {'active': 'Khởi tạo', 'deactive': 'Đã tắt','expired': 'Đã áp dụng'},
                    headerStyle: {
                        fontWeight: '600',
                    },
                    cellStyle: {
                    },
                    editable: 'never',

                }
            ],
            data: [],
            c: 10000,
        }
    }
    getAdjustFee = () =>{
        axios.get(window.Laravel.baseUrl + "/adjustfee/get")
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
        this.getAdjustFee()
    }
    handleApplyAdjustment = (did) => {
        axios.post(baseUrl + '/adjustfee/apply', {discount_id: did})
            .then(response => {
                this.getAdjustFee()
                this.props.enqueueSnackbar('Đã áp dụng', {
                    variant: 'success'
                })
            })
            .catch(err => {

            })
    }
    addNewAdjustFee = (newData) => {
        // newData.ative_at = newData.active_at.getTime()/1000
        // newData.expired_at = newData.expired_at.getTime()/1000  
        return axios.post(baseUrl + '/adjustfee/create', newData)
            .then((response) => {
                this.getAdjustFee()
                this.props.enqueueSnackbar('Tạo điều chỉnh thành công', {
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
    //edit
    editAdjustFee = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/adjustfee/edit', newData)
            .then(response => {
                this.getAdjustFee()
                this.props.enqueueSnackbar('Sửa điều chỉnh thành công', {
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
    deleteAdjustFee = (oldData) => {
        return axios.post(baseUrl+ '/adjustfee/delete', {id: oldData.did})
            .then(response => {
                this.props.enqueueSnackbar('Xóa thành công', {
                    variant: 'success'
                })
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
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
        return(
            <div className="root-adjustfee">
                <MaterialTable
                    title="Điều chỉnh học phí"
                    columns={this.state.columns}
                    data={this.state.data}
                    options = {{
                        pageSize: 10,
                        grouping: true,
                        filtering: true,

                    }}
                    editable={{
                        onRowAdd: newData => this.addNewAdjustFee(newData) ,
                        onRowUpdate: (newData, oldData) => this.editAdjustFee(oldData, newData),
                        onRowDelete: oldData => this.deleteAdjustFee(oldData),
                    }}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy thay đổi',
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

export default withSnackbar(AdjustFee)