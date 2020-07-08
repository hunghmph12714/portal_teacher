import React , { useState, useEffect } from 'react'
import { format } from 'date-fns'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import DialogCreate from './DialogCreate'
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
    const [ openDialog, setOpen ] = useState(false);
    const [reload, setReload] = useState(false);
    const [type, setType] = useState('create');
    const [selected_data, setSelectedData] = useState([]);
    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.post(baseUrl + '/student/get', {class_id: class_id})
            setData(response.data.map(r => {
                    let date = new Date(r.dob)
                    r.dob_format = format(date , 'dd/MM/yyyy')      
                    r.entrance_date_format = format(new Date(r.detail.entrance_date), 'dd/MM/yyyy')  
                    r.drop_date_format = (r.detail.drop_time)?format(new Date(r.detail.drop_time), 'dd/MM/yyyy') : ''           
                    const d = r.detail                  
                    const o = r.parent
                    let a = Object.assign(r, o, d)
                    return a
                })
            )

        }
        fetchData()
    }, [reload])
    function openCreateDialog(){
        setType('create')
        setOpen(true)        
    }
    function closeCreateDialog(){
        setOpen(false)
        setSelectedData([])
        setReload(!reload)
    }
    function handleOpenEditDialog(rowData){
        setOpen(true)
        setType('edit')
        setSelectedData(rowData)
    }
    return (
        <React.Fragment>
            <MaterialTable
                title="Danh sách học sinh"
                data={data}
                options={{
                    grouping: false,
                    filtering: true,
                    exportButton: true,
                    paging: false,
                    rowStyle: rowData => {
                        return {padding: '0px',}                         
                        
                    },
                    rowStyle: rowData => {                       
                        if(rowData.status == 'droped'){
                            return { backgroundColor: '#d4cad5'}
                        }
                        if(rowData.status == 'waiting'){
                            return { backgroundColor: '#cac2c0'}
                        }
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
                                openCreateDialog()
                            },
                        },
                    ]}
                localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy học sinh'
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
                            width: '80px',
                        },
                        cellStyle: {
                            width: '80px',
                            padding: '0px 5px 0px 0px',
                        },
                        render: rowData => (
                            <div style = {{display: 'block'}}>
                                {/* {rowData.tableData.id} */}
                                <Tooltip title="Chỉnh sửa" arrow>
                                    <IconButton onClick={() => {handleOpenEditDialog(rowData)}}>
                                    <EditOutlinedIcon fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa học sinh" arrow>
                                    <IconButton disabled onClick={() => {
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
                            width: '50px',
                            fontWeight: '600',
                        },
                        cellStyle: {
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
                                <br /> {rowData.dob_format}
                            </Typography>                            )
                        },
                        
                        renderGroup: (sname, groupData) => (
                            <Chip variant="outlined" label={sname} size="small" />      
                        )
                    },
                    //Phụ huynh
                    {
                        title: "Phụ huynh",
                        field: "pname",
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
                                <b>{rowData.pname}</b> 
                                <br/>{rowData.pphone} 
                                <br/>{rowData.pemail}
                            </Typography>                              
                            ),
                        renderGroup: (pname, groupData) => (
                            <Chip variant="outlined" label={pname} size="small" />       
                        )

                    },
                    //Quan hệ
                    {
                        title: "Quan hệ",
                        field: "rname",
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
                            <Chip style={customChip(rowData.color)} variant="outlined" label={rowData.rname} size="small" />                         
                            )
                        },
                        renderGroup: (rname, groupData) => (                            
                            <Chip variant="outlined" label={rname} size="small" />
                        )                
                    },
                    //Ngày nhập học
                    {
                        title: "Ngày nhập học",
                        field: "entrance_date_format",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {
                            return (                      
                                <Chip style={customChip('#fefefe')} variant="outlined" label={rowData.entrance_date_format} size="small" />                         
                            )
                        },
                        renderGroup: (entrance_date_format, groupData) => (                     
                            <Chip variant="outlined" label={entrance_date_format} size="small" />
                        )                
                    },
                    //Ngày nghi học
                    {
                        title: "Ngày nghỉ học",
                        field: "drop_date_format",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {
                            return (                      
                                <Chip style={customChip('#fefefe')} variant="outlined" label={rowData.drop_date_format} size="small" />                         
                            )
                        },
                        renderGroup: (drop_date_format, groupData) => (                     
                            <Chip variant="outlined" label={drop_date_format} size="small" />
                        )                
                    },
                    //Trạng thái
                    {
                        title: "Trạng thái",
                        field: "status",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        lookup: {'active': 'Đang học', 'droped': 'Đã nghỉ', 'waiting': 'Đang chờ', 'retain': 'Bảo lưu'},
                          
                    }                 
                    
                  ]}
            />
            <DialogCreate 
                open = {openDialog}
                handleClose = {closeCreateDialog}
                class_id = {class_id}
                type = {type}
                student = {selected_data}
            />
        </React.Fragment>
    )
}
export default ListStudent