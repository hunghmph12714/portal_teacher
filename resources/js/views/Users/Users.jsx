import React from 'react';
import './Users.scss'
import PermissionDialog from './PermissionDialog';
import MaterialTable from "material-table";
import AddBoxIcon from '@material-ui/icons/AddBox';
import NumberFormat from 'react-number-format';
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
var roles = {};
class Users extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            // columns: ,
            data: [],
            c: 10000,
            open_permission: false,
            selected_user: '',
            selected_permission: [],
            permissions: [],
            roles: [],
        }
        var columns = [
            
        ]
    }
    fetchData = async(rowData) => {
        const response = await axios.get('/permission/get')
        let data = response.data
        let sp = rowData.permissions
        for (const key in sp){
            if (Object.hasOwnProperty.call(sp, key)) {
                const element = sp[key];
                data = response.data.map(d => {
                    if(!d[element.subject]){
                        return d
                    }
                    else{
                        const de = d[element.subject]
                        const tmp_data = de.map(per => {
                            if(per.id == element.id){
                                per.checked = 1
                            }
                            return per
                        })
                        return {[element.subject]: tmp_data}
                    }
                    
                })
            }
        }
        this.setState({
            open_permission: true,
            selected_user: rowData,  
            selected_permission: rowData.permissions,
            permissions: data
        })
    }
    handleOpenDialogPermission = (rowData) => {
        this.fetchData(rowData)
    }
    onPermissionChange = (p) => {
        this.setState(prevState => {
            let permissions = [...prevState.permissions]
            for (const key in permissions) {
                if (Object.hasOwnProperty.call(permissions, key)) {
                    let element = permissions[key];
                    if(element[p.subject]){   
                        let data = element[p.subject].map(per => {
                            if(per.id === p.id){
                                per.checked = per.checked ? !per.checked : true;
                            }
                            return per
                        })
                        permissions[key] = { [p.subject]:data }
                    }
                }
            }
            return {...prevState, permissions}
        })
    }
    handleClosePermission = () => {
        this.setState({  
            open_permission: false,
        })
    }
    handleSubmitPermission = () => {
        axios.post('/user/edit-permission', {
            user_id: this.state.selected_user.id,
            permissions: this.state.permissions,
        })
        .then(response => {
            this.getUsers()
            this.props.enqueueSnackbar('Sửa người dùng thành công', {variant: 'success'})
        })
        .catch(err => {
            console.log(err)
        })
        this.handleClosePermission()
    }

    getUsers = () =>{
        axios.post(window.Laravel.baseUrl + "/settings/users/get", {type: -1})
            .then(response => {
                this.setState({
                    data: response.data.users,
                    roles : response.data.roles
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
        
    }
    
    componentDidMount(){
        this.getUsers()
    }
    addNewUsers = (newData) => {        
        return axios.post(baseUrl + '/settings/users/create', newData)
            .then((response) => {
                this.props.enqueueSnackbar('Thêm thành công', {variant: 'success'})
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
    editUsers = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/settings/users/edit', req)
            .then(response => {
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data[oldData.tableData.id] = newData;
                    return { ...prevState, data };
                });
                this.props.enqueueSnackbar('Sửa thành công', {variant: 'success'})

            })
            .then(err => {
                console.log(err)
            })
    }
    deleteUsers = (oldData) => {
        return axios.post(baseUrl+ '/user/delete', {id: oldData.id})
            .then(response => {
                this.props.enqueueSnackbar('Xoá thành công', {variant: 'success'})

                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                });
            })
            .catch(err => {
                this.props.enqueueSnackbar('Xoá không thành công', {variant: 'error'})
            })
    }
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        return(
            <div className="root-setting-user">
                <MaterialTable
                    title = "Quản lý người dùng"
                    columns = {
                        [
                            { title: 'Avatar', field: 'avatar',
                                render: rowData => <img src = {rowData.avatar} style={{width: 35, borderRadius: '50%'}}/> ,
                                editable: false,
                            },
                            { title: 'Họ tên', field: 'name' },
                            { title: 'Email', field: 'email' },
                            { title: 'Số điện thoại', field: 'phone' },
                            { title: 'Giới tính', field: 'gender', lookup:{ 'Nam' : 'Nam', 'Nữ' : 'Nữ' } },
                            { title: 'Ngày sinh', field: 'dob', type: "date" },
                            { title: 'Chức vụ', field: 'roles', lookup: this.state.roles},
                            { title: 'Phòng ban', field: 'department', editable: false}
                        ]
                    }
                    data = {this.state.data}
                    options = {{
                        grouping: true,
                        pageSize: 10,
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewUsers(newData) ,
                        onRowUpdate: (newData, oldData) => this.editUsers(oldData, newData),
                        onRowDelete: oldData => this.deleteUsers(oldData),
                    }}
                    actions = {[
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm ',
                            isFreeAction: false,
                            text: 'Thêm sự kiện',
                            onClick: (event, rowData) => {
                                this.handleOpenDialogPermission(rowData)
                            },
                        },
                    ]}
                    localization={{
                        header: {
                            actions: ''
                        },
                        body: {
                          emptyDataSourceMessage: 'Không tìm thấy phân người dùng',
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
                <PermissionDialog
                    handleClosePermission = {this.handleClosePermission}
                    open_permission = {this.state.open_permission}
                    selected_permission = {this.state.selected_permission}
                    selected_id = {this.state.selected_user.id}
                    permissions = {this.state.permissions}
                    onPermissionChange = { this.onPermissionChange }
                    handleSubmitPermission = {this.handleSubmitPermission}
                />
            </div>
        );
    }
}
export default withSnackbar(Users)
