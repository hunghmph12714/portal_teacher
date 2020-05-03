import React , { useState, useEffect } from 'react'
import { format } from 'date-fns'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';

import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
  } from "@material-ui/core";
import MaterialTable from "material-table";
import Chip from '@material-ui/core/Chip';


const baseUrl = window.Laravel.baseUrl
const customChip = (color = '#ccc') => ({
    border: '1px solid ' + color,
    color: '#000',
    fontSize: '12px',
  })
const ListStudent = (props) => {
    const Vndate = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const { class_id } = props
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.post(baseUrl + '/student/get', {class_id: class_id})
            setData(response.data.map(r => {
                    let date = new Date(r.dob)
                    r.dob = format(date , 'dd/MM/yyyy')      
                    r.detail.entrance_date = format(new Date(r.detail.entrance_date), 'dd/MM/yyyy')              
                    return r
                })
            )

        }
        fetchData()
    }, [])
    return (
        <React.Fragment>
            <MaterialTable
                title="Danh sách học sinh"
                data={data}
                options={{
                        pageSize: 10,
                        grouping: true,
                        filtering: true,
                        exportButton: true,
                        rowStyle: rowData => {
                            return {padding: '0px',}                         
                          
                        },
                        filterCellStyle: {
                          paddingLeft: '0px'
                        }
                    }}
                onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm mới học sinh',
                            isFreeAction: true,
                            text: 'Thêm học sinh',
                            onClick: (event) => {
                                this.props.history.push('/entrance/create')
                            },
                        },
                    ]}
                localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy học sinh hoặc sever gặp lỗi'
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
                        },
                        grouping: {
                          placeholder: 'Kéo tên cột vào đây để nhóm'
                        }
                    }}
                columns={[
                    //Actions
                    {
                        title: "",
                        field: "action",
                        filtering: false,
                        disableClick: true,
                        sorting: false,
                        headerStyle: {
                            padding: '0px',
                            width: '140px',
                        },
                        cellStyle: {
                            width: '114px',
                            padding: '0px',
                        },
                        render: rowData => (
                            <div style = {{display: 'block'}}>
                                {/* {rowData.tableData.id} */}
                                <Tooltip title="Chỉnh sửa" arrow>
                                    <IconButton onClick={() => {this.handleOpenEditDialog(rowData)}}>
                                    <EditOutlinedIcon fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa học sinh" arrow>
                                    <IconButton onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                                        this.handleDeactivateClass(rowData.id, rowData.tableData.id)}
                                    }>
                                    <DeleteForeverIcon fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>                                
                            </div>
                        )
                    },
                    //STT
                    {
                        title: "STT",
                        field: "id",
                        headerStyle: {
                            padding: '0px',
                            width: '50px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                            width: '50px',
                        },
                        render: rowData => {
                            return (                                
                                <span key={rowData.tableData.id }> {rowData.tableData.id + 1} </span>                             
                            )
                        },
                        
                        renderGroup: (sname, groupData) => (
                            <Chip variant="outlined" label={sname} size="small" />      
                        )
                    },
                    //Học sinh
                    {
                        title: "Học sinh",
                        field: "fullname",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {
                            return (                                
                            <Typography variant="body2" component="p">                                    
                                <b>{rowData.fullname}</b>
                                <br /> {rowData.dob}
                            </Typography>
                            
                            )
                        },
                        
                        renderGroup: (sname, groupData) => (
                            <Chip variant="outlined" label={sname} size="small" />      
                        )
                    },
                    //Phụ huynh
                    {
                        title: "Phụ huynh",
                        field: "parent",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '3px 0px',
                        },
                        render: rowData => 
                            (                              
                            <Typography variant="body2" component="p">
                                <b>{rowData.parent.pname}</b> 
                                <br />{rowData.parent.phone} 
                                <br />{rowData.parent.email}
                            </Typography>                              
                            ),
                        renderGroup: (pname, groupData) => (
                            <Chip variant="outlined" label={pname} size="small" />       
                        )

                    },
                    //Quan hệ
                    {
                        title: "Quan hệ",
                        field: "parent",
                        headerStyle: {
                            padding: '0px',
                            width: '120px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                            width: '120px',
                        },
                        render: rowData => {
                            return (                              
                            <Chip style={customChip(rowData.parent.color)} variant="outlined" label={rowData.parent.rname} size="small" />                         
                            )
                        },
                        renderGroup: (parent, groupData) => (                            
                            <Chip variant="outlined" label={parent.rname} size="small" />
                        )                
                    },
                    //Ngày nhập học
                    {
                        title: "Ngày nhập học",
                        field: "detail",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {
                            return (                              
                            <Chip style={customChip('#fefefe')} variant="outlined" label={rowData.detail.entrance_date} size="small" />                         
                            )
                        },
                        renderGroup: (detail, groupData) => (                            
                            <Chip variant="outlined" label={detail.entrance_date} size="small" />
                        )                
                    },
                    //Trạng thái
                    {
                        title: "Trạng thái",
                        field: "detail",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {
                            return (                              
                            <Chip variant="outlined" label={rowData.detail.status} size="small" />                         
                            )
                        },
                        renderGroup: (detail, groupData) => (                            
                            <Chip variant="outlined" label={detail.status} size="small" />
                        )  
                    }                 
                    
                  ]}
            />
        </React.Fragment>
    )
}
export default ListStudent