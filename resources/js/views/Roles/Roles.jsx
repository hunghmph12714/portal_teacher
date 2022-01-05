import React from 'react';
import './Roles.scss'
import {PermissionDialog} from './components';
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
class Role extends React.Component{
    constructor(props){
        super(props)
        this.state  = {
            columns: [
                { title: 'Chức vụ', field: 'name' },
                { title: 'Phòng ban', field: 'department' },
                { title: 'Ghi chú', field: 'note'},
                { title: 'Ngày tạo', field: 'created_at' , editable: 'never' },               
            ],
            data: [],
            c: 10000,
            open_permission: false,
            selected_role: '',
            selected_permission: [],
            permissions: [],
        }
    }
    fetchdata = async(rowData) => {
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
            selected_role: rowData,  
            selected_permission: rowData.permissions,
            permissions: data
        })
    }
    handleOpenDialogPermission = (rowData) => {
        this.fetchdata(rowData)
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
        axios.post('/role/edit-permission', {
            role_id: this.state.selected_role.id,
            permissions: this.state.permissions,
        })
        .then(response => {
            this.getRole()
            this.props.enqueueSnackbar('Sửa quyền thành công', {variant: 'success'})
        })
        .catch(err => {
            console.log(err)
        })
        this.handleClosePermission()
    }

    getRole = () =>{
        axios.post(window.Laravel.baseUrl + "/role/get", {type: -1})
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
        this.getRole()
    }
    addNewRole = (newData) => {        
        return axios.post(baseUrl + '/role/create', newData)
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
    editRole = (oldData, newData) => {
        let req = {id: oldData.id, newData: newData}
        return axios.post(baseUrl + '/role/edit', req)
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
    deleteRole = (oldData) => {
        return axios.post(baseUrl+ '/role/delete', {id: oldData.id})
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
            <div className="root-setting-role">
                <MaterialTable
                    title = "Phân quyền"
                    columns = {this.state.columns}
                    data = {this.state.data}
                    options = {{
                        grouping: true,
                        pageSize: 10,
                    }}
                    editable={{
                        onRowAdd: newData => this.addNewRole(newData) ,
                        onRowUpdate: (newData, oldData) => this.editRole(oldData, newData),
                        onRowDelete: oldData => this.deleteRole(oldData),
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
                          emptyDataSourceMessage: 'Không tìm thấy Phân quyền',
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
                    selected_id = {this.state.selected_role.id}
                    permissions = {this.state.permissions}
                    onPermissionChange = { this.onPermissionChange }
                    handleSubmitPermission = {this.handleSubmitPermission}
                />
            </div>
        );
    }
}
export default withSnackbar(Role)
