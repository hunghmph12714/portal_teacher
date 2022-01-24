import React , { useState, useEffect } from 'react'
import './ListResult.scss'
import SpreadSheet from '@rowsncolumns/spreadsheet'

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
  import FolderOpenIcon from '@material-ui/icons/FolderOpen';
const baseUrl = window.Laravel.baseUrl

// var i = pattern.map(p => {
//     z = {...z, [7+p] :45, [8+p]:50, [9+p]:45, [11+p]: 45}
//     return {[7+p] :45, [8+p]:45, [9+p]:45, [11+p]: 45}
// });
const ListResult = (props) => {
    const [sessions, setSessions] = useState([])
    const [columns, setColumns] = useState([
        //STT
        {
            title: "STT",
            field: "id",
            filtering: false,
            headerStyle: {
                width: '10px',
                fontWeight: '600',
                padding: '0px'
            },
            cellStyle: {
                width: '10px',
                padding: '0px'
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
        {
            title: "ID",
            field: "sbd",
            filtering: false,
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
                    {/* <br/><a target="_blank" href={"https://vietelite.3cx.vn:5001/webclient/#/call?phone=" + rowData.pphone} > {rowData.pphone} </a>  */}
                    <br/>{rowData.pphone}
                    <br/>{rowData.pemail}
                </Typography>                              
                ),
            renderGroup: (pname, groupData) => (
                <Chip variant="outlined" label={pname} size="small" />       
            )
        },
        
        //Trạng thái
        {
            title: "Trạng thái",
            field: "result_status",
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
    async function fetchJSON () {
        axios.post('/event/result', {event_id: props.class_id})
            .then(response => {
                setSessions(response.data)
            })
    }    
    fetchJSON()
  }, [])
  
  return (
    <>
        {sessions.map(s => {
        return(
            <div>
                <h3>{s.content}</h3>
                <MaterialTable    
                    // tableRef={tableRef}            
                    title="Danh sách học sinh"
                    data={s.students}
                    options={{
                        grouping: false,
                        filtering: true,
                        selection: true,
                        exportButton: true,
                        pageSize: 10,
                        pageSizeOptions: [10, 20, 50],                    
                        rowStyle: rowData => {
                            return {padding: '0px',}                         
                            
                        },
                        rowStyle: rowData => {                       
                            if(rowData.result_status == 'Đã có bài'){
                                return { backgroundColor: '#d4cad5'}
                            }
                            if(rowData.result_status == 'Chưa làm bài'){
                                return { backgroundColor: 'rgb(234, 221, 218)'}
                            }
                            if(rowData.result_status == 'Chưa có bài'){
                                return { backgroundColor: 'rgb(234, 102, 218)'}
                            }
                        },
                        filterCellStyle: {
                            paddingLeft: '0px'
                        },
                    }}
                    onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                    // isLoading={loading}
                    actions={[                       
                             
                            {
                                icon: () => <EditOutlinedIcon />,
                                tooltip: 'Chỉnh sửa',
                                isFreeAction: false,
                                text: 'Chỉnh sửa',
                                // onClick: (event, rowData) => {handleOpenEditDialog(rowData)}
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
            </div>
        )   
        })}
    </>
  )
}
export default ListResult