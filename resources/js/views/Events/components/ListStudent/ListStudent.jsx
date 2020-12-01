import React , { useState, useEffect } from 'react'
import './ListStudent.scss'
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
import { CsvBuilder } from 'filefy';

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
    const [columns, setColumns] = useState([
        //STT
        {
            title: "STT",
            field: "id",
            headerStyle: {
                width: '10px',
                fontWeight: '600',
                padding: '0px'
            },
            cellStyle: {
                width: '10px',
                padding: '0px'
            },
            filtering: false,
            render: rowData => {
                return (                                
                    <span key={rowData.tableData.id }> {rowData.tableData.id + 1} </span>                             
                )
            },
            
            renderGroup: (sname, groupData) => (
                <Chip variant="outlined" label={sname} size="small" />      
            )
        },
        {
            title: "SBD",
            field: "sbd",
            headerStyle: {
                width: '20px',
                fontWeight: '600',
            },
            cellStyle: {
                width: '20px',
            },
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
                    <br /> {
                        rowData.classes.map(c => {return (<Chip variant="outlined" label={c.code} size="small" className="classes"/>)})
                    }  

                </Typography>)
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
        // {
        //     title: "Quan hệ",
        //     field: "rname",
        //     headerStyle: {
        //         padding: '0px',
        //         width: '120px',
        //         fontWeight: '600',
        //     },
        //     cellStyle: {
        //         padding: '0px',
        //         width: '120px',
        //     },
        //     render: rowData => {
        //         return (                              
        //         <Chip style={customChip(rowData.color)} variant="outlined" label={rowData.rname} size="small" />                         
        //         )
        //     },
        //     renderGroup: (rname, groupData) => (                            
        //         <Chip variant="outlined" label={rname} size="small" />
        //     )                
        // },
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
        {
            title: "Đăng ký",
            field: "sessions_str",
            grouping: false,
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
            render: rowData => (<span>{
                rowData.sessions.map(s => {
                    return (<Chip variant="outlined" label={s} size="small" />)
                })
            } </span>)
                
        },
        //Lệ phí
        {
            title: "Lệ phí",
            field: "debit",
            type: 'currency',
            currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
                    
        },
        //Đã đóng
        {
            title: "Đã đóng",
            field: "credit",
            type: 'currency',
            currencySetting: {currencyCode: 'VND', minimumFractionDigits: 0, maximumFractionDigits:0},
            headerStyle: {
                padding: '0px 5px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '0px 5px',
            },
                    
        },
        //Ngày nhập học
        {
            title: "Ngày đăng ký",
            field: "entrance_date_format",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },           
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
            lookup: {'active': 'Xác nhận', 'waiting': 'Đăng ký'},
              
        } 
    ])
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
                className="table-student"
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
                            return { backgroundColor: 'rgb(234, 221, 218)'}
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
                            icon: () => <EditOutlinedIcon />,
                            tooltip: 'Chỉnh sửa',
                            isFreeAction: false,
                            text: 'Chỉnh sửa',
                            onClick: (event, rowData) => {handleOpenEditDialog(rowData)}
                        },
                        {
                            icon: () => <DeleteForeverIcon />,
                            tooltip: 'Xoá',
                            isFreeAction: false,
                            text: 'Xoá học sinh',
                            onClick: (event, rowData) => {handleOpenEditDialog(rowData)}
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
               
                columns={columns}
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