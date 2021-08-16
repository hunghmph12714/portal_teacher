import React , { useState, useEffect } from 'react'
import { format } from 'date-fns'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Typography from '@material-ui/core/Typography';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import DialogCreate from './DialogCreate'
import DialogTransfer from './DialogTransfer'
import DialogDropout from './DialogDropout'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
  } from "@material-ui/core";
import MaterialTable from "material-table";
import Chip from '@material-ui/core/Chip';
import { CsvBuilder } from 'filefy';
import DialogUploadAvatar from './DialogUploadAvatar';

const baseUrl = window.Laravel.baseUrl
const customChip = (color = '#ccc') => ({
    border: '1px solid ' + color,
    color: '#000',
    fontSize: '12px',
  })
const exportCsv = (columnList, initialData) => {
    
};
const ListStudent = (props) => {
    const Vndate = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const { class_id, class_name } = props
    const [data, setData] = useState([]);
    const [ openDialog, setOpen ] = useState(false);
    const [reload, setReload] = useState(false);
    const [type, setType] = useState('create');
    const [selected_data, setSelectedData] = useState([]);

    const[ openUpload, setOpenUpload ] = useState(false);
    const[ openStatus, setOpenStatus] = useState(false);
    const [ openDropout, setOpenDropout ] = useState(false);

    // const[ ]
    useEffect(() => {
        const fetchdata = async() => {
            const response = await axios.post(baseUrl + '/student/get', {class_id: class_id})
            console.log(response.data)
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
        fetchdata()
    }, [reload])
    function openStatusDialog(rows){
        setOpenStatus(true)
        setSelectedData(rows)
    }
    function handleCloseStatus(){
        setOpenStatus(false)
        setSelectedData([])
        setReload(!reload)
    }

    function openDropoutDialog(rows){
        setOpenDropout(true)
        setSelectedData(rows)
    }
    function handleCloseDropout(){
        setOpenDropout(false)
        setSelectedData([])
        setReload(!reload)
    }
    function handleOpenUpload(rowData){
        setOpenUpload(true)
        setSelectedData(rowData)
    }
    function handleCloseUpload(){
        setOpenUpload(false)
        setSelectedData([])
        setReload(!reload)
    }
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
    function handleDeleteStudent(rowData){
        axios.post('/class/delete-student', rowData)
            .then(response => {
                setReload(!reload)
            })
            .catch( err => {

            })
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
                    selection: true,
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
                    },
                    exportCsv: (c, d) => {
                        const cols = ['ID','Học sinh','Ngày sinh','Phụ huynh','SĐT','Email','SĐT 2','Email 2','Ngày nhập học','Ngày nghỉ','Trạng thái'];
                        const data = d.map(dt => [dt.student_id, dt.fullname,dt.dob_format ,dt.pname, dt.pphone,dt.pemail,dt.alt_phone, dt.alt_email, dt.entrance_date_format, dt.drop_date_format, dt.status]);
                        console.log(data)
                        const builder = new CsvBuilder('DSHS lớp '+ class_name + '.csv');
                        builder
                            .setDelimeter(',')
                            .setColumns(cols)
                            .addRows(data)
                            .exportFile();
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
                        {
                            icon: () => <DoubleArrowIcon />,
                            tooltip: 'Chuyển lớp',
                            isFreeAction: false,
                            text: 'Chuyển lớp',
                            onClick: (event, rows) => {
                                openStatusDialog(rows)
                            },
                        },
                        {
                            icon: () => <MeetingRoomIcon />,
                            tooltip: 'Nghỉ học',
                            isFreeAction: false,
                            text: 'Nghỉ học',
                            onClick: (event, rows) => {
                                openDropoutDialog(rows)
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
                            width: '120px',
                        },
                        cellStyle: {
                            width: '120px',
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
                                    <IconButton onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                                        handleDeleteStudent(rowData)}
                                    }>
                                    <DeleteForeverIcon fontSize='inherit' />
                                    </IconButton>
                                </Tooltip>     
                                {
                                    rowData.avatar ? "" : (
                                        <Tooltip title="Up ảnh" arrow>
                                            <IconButton
                                                onClick={() => {handleOpenUpload(rowData)}}>
                                            <CropOriginalIcon fontSize='inherit' />
                                            </IconButton>
                                        </Tooltip>
                                    )
                                }                                 
                            </div>
                        )
                    },
                    //STT
                    {
                        title: "STT",
                        field: "id",
                        headerStyle: {
                            width: '20px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            width: '20px',
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
                                <br/><a target="_blank" href={"https://vietelite.3cx.vn:5001/webclient/#/call?phone=" + rowData.pphone} > {rowData.pphone} </a> 
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
                    //Quan hệ
                    {
                        title: "Ghi chú",
                        field: "pnote",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                                
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
                        lookup: {'active': 'Đang học', 'droped': 'Đã nghỉ', 'waiting': 'Đang chờ', 'retain': 'Bảo lưu','transfer': 'Chuyển lớp'},
                          
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
            <DialogTransfer
                open = {openStatus}
                handleClose = {handleCloseStatus}
                class_id = {class_id}
                students = {selected_data}
            />
            <DialogDropout
                open = {openDropout}
                handleClose = {handleCloseDropout}
                class_id = {class_id}
                students = {selected_data}
            />
            <DialogUploadAvatar
                open = {openUpload}
                handleClose = {handleCloseUpload}
                id = {selected_data.id}
                avatar = {selected_data.avatar}
            />
        </React.Fragment>
    )
}
export default ListStudent