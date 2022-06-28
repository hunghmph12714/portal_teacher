import React , { useState, useEffect } from 'react'
import './StepAppointment.scss'
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
    Chip, colors ,
    Typography ,LinearProgress
  } from "@material-ui/core";
import ImportExportOutlinedIcon from '@material-ui/icons/ImportExportOutlined';

import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import MaterialTable from "material-table";
import { Can } from '../../../../Can';
import { AppointmentDialog, TestDialog, MessageDialog, StatusDialog } from '../../components';
import { EditEntrance } from '../../EditEntrance';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useSnackbar } from 'notistack';
import CheckIcon from '@material-ui/icons/Check';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';
import CreateIcon from '@material-ui/icons/Create';
import { CsvBuilder } from 'filefy';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
const statuses = [
    {value: 'Đang xử lý', label: 'Đang xử lý'},
    {value: 'Thất bại', label: 'Cần tư vấn từ quản lý'},
    // {value: 'Mất', label: 'Mất'},
    // {value: 'Chờ', label: 'Chờ'},
]
const lang = {
    body: {
        emptyDataSourceMessage: 'Không tìm thấy ghi danh'
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
}
const customChip = (color = '#ccc') => ({
    border: '1px solid ' + color,
    color: '#000',
    fontSize: '12px',
  })
const StepAppointment = (props) => {
    const {centers,  ...rest} = props
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [column1, setCol1] = useState(
        [
          //Học sinh
            {
              title: "Học sinh",
              field: "sname",
              headerStyle: {
                  padding: '0px',
                  fontWeight: '600',
                  fontWeight: '600'
              },
              cellStyle: {
                  padding: '0px',
              },
              render: rowData => {
                return (                                
                    <Typography variant="body2" component="p">                                    
                        <b>{rowData.sname}</b>
                        <br /> {rowData.dob}
                        <CreateIcon fontSize="small" onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditDialog(rowData)
                        }}/>
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
                      {rowData.phone}                                 
                      <br />{rowData.pemail}
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
          {
            title: "Môn ĐK",
            field: "course",
            // type: "date",
            headerStyle: {
              padding: '0px',
              fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
          },
          {
            title: "Ngày hẹn",
            field: "test_time",
            // type: "date",
            headerStyle: {
              padding: '0px',
              fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
          },
          {
              title: "Nguyện vọng",
              field: "note",
              headerStyle: {
                padding: '0px',
                fontWeight: '600',
              },
              cellStyle: {
                  padding: '0px',
              },
          },
          {
            title: "Nguồn",
            field: "source",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
          },
        
        ]
    )
    const [openStatus, setOpenStatus] = useState(false)
    const [typeStatus, setTypeStatus] = useState('')
   
    const [refresh, setRefresh] = useState(true)
    const [loading , setLoading] = useState(true)
    const [openAppointment, setOpenAppointment] = useState(false)
    const [openTest, setOpenTest] = useState(false)
    const [openMessage, setOpenMessage] = useState(false)
    const [selectedEntrance, setSelectedEntrance] = useState({})
    const [statusOptions, setStatusOptions] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [open_edit, setOpenEdit] = useState(false);
    
    
    function handleDeleteEntrance(rowData){
        axios.post('/entrance/delete', {id: rowData.eid})
            .then(resposne => {
                enqueueSnackbar('Đã xoá', {variant: 'success'});
                fetchdata()
            })
            .catch( err => {

            })
    }
    function handleOpenEditDialog(rowData){
        setOpenEdit(true)
        setSelectedEntrance(rowData)
    }
    function handleCloseDialogCreate(){
        setOpenEdit(false)
    }
    function fetchdata(){
        axios.post( "/entrance/get/appointment", {centers: centers, from: props.from, to: props.to})
            .then(response => {
                // let d1, d2, d3 = []
                let d1 = []
                let d2 = []
                let d3 = []
                var d = new Date();
                d.setHours(0,0,0,0);
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i];
                    const date = new Date(element.test_time)
                    
                    if(element.status == 'Thất bại 2'){
                        d3.push(element)
                        continue
                    }
                    if(date >= d){
                        d1.push(element)
                        continue
                    }else{
                        d2.push(element)
                        continue
                    }
                }
                setData1(d1)
                setData2(d2)
                setData3(d3)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        
        const fetchStatus = async() => {
            const r = await axios.post('/status/get', {'type': 'Quy trình đầu vào'})
            setStatusOptions(r.data.map(s => {
                    return {label: s.name , value: s.id}
                })
            )
        }
        const fetchCourse = async() => {
            const c = await axios.get('/get-courses')
            setCourseOptions(c.data.map(center => {
                    return {label: center.name + center.grade, value: center.id}
                })
            )
        }
        fetchdata()
        fetchStatus()
        fetchCourse()        
    }, [centers, props.to, props.from])    
    function handleFailClick(rowData, reason, comment, status){
        axios.post('/entrance/step/fail', {id: rowData.eid, type: 'fail2', reason: reason, comment: comment, status: status})
            .then(response => { 
                fetchdata()
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                
            })
            .catch(err => {
                console.log(err)
            })
    }
    function handleOpenDialogTest(rowData){
        setOpenTest(true)
        setSelectedEntrance(rowData)
    }
    function handleCloseTest(){
        setOpenTest(false)
    }
    function handleCloseMessage(){
        setOpenMessage(false)
    }
    function handleOpenDialogMessage(rowData){
        setOpenMessage(true)
        setSelectedEntrance(rowData)
    }
    function handleRemove(rowData, reason, comment){
        axios.post('/entrance/step/fail', {id: rowData.eid, type: 'lostKT', reason: reason, comment: comment})
            .then(response => { 
                const d3 = data3.filter(d => d.eid !== rowData.eid)
                setData3(d3)
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
            })
            .catch(err => {
                console.log(err)
            })
    }
    function handleOpenDialogStatus(rowData, type){
        setOpenStatus(true)
        setTypeStatus(type)
        setSelectedEntrance(rowData)
    }
    function handleOpenDialogAppointment(rowData){
        setOpenAppointment(true)
        setSelectedEntrance(rowData)
    }
    function handleCloseAppointment(){
        setOpenAppointment(false)
    }
    function handleCloseStatus(){
        setOpenStatus(false)
    }
    return(
        <div>
            {
                loading ? 
                (<LinearProgress  className="loading"/>):
                (
                    <div> 
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="Ghi danh kiểm tra sắp tới"
                                data={data1}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,   
                                    rowStyle: rowData => {
                                        let today = new Date()
                                        if(rowData.test_time_formated){
                                            let test_time = (rowData.test_time_formated) ? rowData.test_time_formated.split(' ')[0].split('/').map(t => parseInt(t)): NULL                      
                                            if(today.getDate() == parseInt(test_time[0])  && today.getMonth()+1 == parseInt(test_time[1])  && today.getFullYear() == parseInt(test_time[2]) ){
                                                return {backgroundColor: yellow[200]}
                                            }
                                        }
                                        
                                        if(rowData.priority >= 8){
                                        return {backgroundColor: colors.orange[300],}
                                        }
                                        if(rowData.priority >= 6){
                                        return {backgroundColor: colors.orange[200],}
                                        }
                                        if(rowData.priority >= 4){
                                        return {backgroundColor: colors.orange[100],}
                                        }
                                    },
                                    filterCellStyle: {
                                        paddingLeft: '0px'
                                    },
                                    exportCsv: (c, d) => {
                                        const cols = ['Học sinh','Ngày sinh','Phụ huynh','SĐT','Email','Khối đăng ký', 'Lịch hẹn', 'Ghi chú', 'Nguồn'];
                                        const data = d.map(dt => [dt.sname,dt.dob ,dt.pname, dt.phone,dt.pemail, dt.course, dt.test_time, dt.note, dt.source]);
                                        const builder = new CsvBuilder('DSHS ghi danh kiểm tra.csv');
                                        builder
                                        .setDelimeter(',')
                                        .setColumns(cols)
                                        .addRows(data)
                                        .exportFile();
                                    }           
                                }}
                                
                                onRowClick={(event, rowData) => { 
                                }}
                                actions={[  
                                    {
                                        icon: () => <AddCommentOutlinedIcon />,
                                        tooltip: 'Ghi chú',
                                        isFreeAction: false,
                                        text: 'Ghi chú',
                                        onClick: (event, rowData) => {handleOpenDialogMessage(rowData)},
                                    },
                                    {
                                        icon: () => <AddAlarmIcon />,
                                        tooltip: 'Hẹn lại lịch',
                                        isFreeAction: false,
                                        text: 'Hẹn lại lịch',
                                        onClick: (event, rowData) => {handleOpenDialogAppointment(rowData)},
                                    },
                                    {
                                        icon: () => <CheckIcon />,
                                        tooltip: 'Đã đến kiểm tra',
                                        isFreeAction: false,
                                        text: 'Đã đến kiểm tra',
                                        onClick: (event, rowData) => {handleOpenDialogTest(rowData)},
                                    },
                                    {
                                        icon: () => <ImportExportOutlinedIcon />,
                                        tooltip: 'Chuyển trạng thái',
                                        isFreeAction: false,
                                        text: 'Chuyển trạng thái',
                                        onClick: (event, rowData) => {handleOpenDialogStatus(rowData, 'type1')},
                                    },
                                    {
                                        icon: () => <HighlightOffIcon />,
                                        tooltip: 'Xoá',
                                        isFreeAction: false,
                                        text: 'Xoá',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Bạn có chắc muốn xóa bản ghi này? !')) handleDeleteEntrance(rowData)}
                                            
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                            />
                        </div>
                    
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="Ghi danh kiểm tra quá hạn"
                                data={data2}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,      
                                    rowStyle: rowData => {
                                        
                                        if(rowData.priority >= 8){
                                        return {backgroundColor: colors.orange[300],}
                                        }
                                        if(rowData.priority >= 6){
                                        return {backgroundColor: colors.orange[200],}
                                        }
                                        if(rowData.priority >= 4){
                                        return {backgroundColor: colors.orange[100],}
                                        }
                                    },  
                                    
                                    exportCsv: (c, d) => {
                                        const cols = ['Học sinh','Ngày sinh','Phụ huynh','SĐT','Email','Khối đăng ký', 'Lịch hẹn', 'Ghi chú', 'Nguồn'];
                                        const data = d.map(dt => [dt.sname,dt.dob ,dt.pname, dt.phone,dt.pemail, dt.course, dt.test_time, dt.note, dt.source]);
                                        const builder = new CsvBuilder('DSHS ghi danh kiểm tra.csv');
                                        builder
                                        .setDelimeter(',')
                                        .setColumns(cols)
                                        .addRows(data)
                                        .exportFile();
                                    }                 
                                }}
                                
                                onRowClick={(event, rowData) => { 
                                }}
                                actions={[                       
                                    {
                                        icon: () => <AddCommentOutlinedIcon />,
                                        tooltip: 'Ghi chú',
                                        isFreeAction: false,
                                        text: 'Ghi chú',
                                        onClick: (event, rowData) => {handleOpenDialogMessage(rowData)},
                                    },
                                    {
                                        icon: () => <AddAlarmIcon />,
                                        tooltip: 'Hẹn lại lịch',
                                        isFreeAction: false,
                                        text: 'Hẹn lại lịch',
                                        onClick: (event, rowData) => {handleOpenDialogAppointment(rowData)},
                                    },
                                    {
                                        icon: () => <CheckIcon />,
                                        tooltip: 'Đã đến kiểm tra',
                                        isFreeAction: false,
                                        text: 'Đã đến kiểm tra',
                                        onClick: (event, rowData) => {handleOpenDialogTest(rowData)},
                                    },
                                    {
                                        icon: () => <ImportExportOutlinedIcon />,
                                        tooltip: 'Chuyển trạng thái',
                                        isFreeAction: false,
                                        text: 'Chuyển trạng thái',
                                        onClick: (event, rowData) => {handleOpenDialogStatus(rowData, 'type1')},
                                    },
                                    {
                                        icon: () => <HighlightOffIcon />,
                                        tooltip: 'Xoá',
                                        isFreeAction: false,
                                        text: 'Xoá',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Bạn có chắc muốn xóa bản ghi này? !')) handleDeleteEntrance(rowData)}
                                            
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                                
                            />
                        </div>
                    
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="Danh sách Chuyển trạng thái"
                                data={data3}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,         
                                    rowStyle: rowData => {
                                        
                                        if(rowData.priority >= 8){
                                        return {backgroundColor: colors.orange[300],}
                                        }
                                        if(rowData.priority >= 6){
                                        return {backgroundColor: colors.orange[200],}
                                        }
                                        if(rowData.priority >= 4){
                                        return {backgroundColor: colors.orange[100],}
                                        }
                                    }, 
                                    exportCsv: (c, d) => {
                                        const cols = ['Học sinh','Ngày sinh','Phụ huynh','SĐT','Email','Khối đăng ký', 'Lịch hẹn', 'Ghi chú', 'Nguồn'];
                                        const data = d.map(dt => [dt.sname,dt.dob ,dt.pname, dt.phone,dt.pemail, dt.course, dt.test_time, dt.note, dt.source]);
                                        const builder = new CsvBuilder('DSHS ghi danh kiểm tra.csv');
                                        builder
                                        .setDelimeter(',')
                                        .setColumns(cols)
                                        .addRows(data)
                                        .exportFile();
                                    }              
                                }}
                                
                                onRowClick={(event, rowData) => { 
                                }}
                                actions={[                       
                                    {
                                        icon: () => <AddCommentOutlinedIcon />,
                                        tooltip: 'Ghi chú',
                                        isFreeAction: false,
                                        text: 'Ghi chú',
                                        onClick: (event, rowData) => {handleOpenDialogMessage(rowData)},
                                    },                                    
                                    {
                                        icon: () => <AddAlarmIcon />,
                                        tooltip: 'Hẹn lại lịch',
                                        isFreeAction: false,
                                        text: 'Hẹn lại lịch',
                                        onClick: (event, rowData) => {handleOpenDialogAppointment(rowData)},
                                    },
                                    {
                                        icon: () => <CheckIcon />,
                                        tooltip: 'Đã đến kiểm tra',
                                        isFreeAction: false,
                                        text: 'Đã đến kiểm tra',
                                        onClick: (event, rowData) => {handleOpenDialogTest(rowData)},
                                    },
                                    {
                                        icon: () => <Can I="soft_delete_entrance" on="Ghi danh"><ImportExportOutlinedIcon /></Can>,
                                        tooltip: 'Thất bại tư vấn',
                                        isFreeAction: false,
                                        text: 'Thất bại tư vấn',
                                        onClick: (event, rowData) => {handleOpenDialogStatus(rowData, 'lost')},
                                    },
                                    {
                                        icon: () => <HighlightOffIcon />,
                                        tooltip: 'Xoá',
                                        isFreeAction: false,
                                        text: 'Xoá',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Bạn có chắc muốn xóa bản ghi này? !')) handleDeleteEntrance(rowData)}
                                            
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                                
                            />
                            <TestDialog
                                open = {openTest}
                                handleCloseDialog = {handleCloseTest}
                                selectedEntrance = {selectedEntrance}
                                statusOptions = {statusOptions}
                                courseOptions = {courseOptions}
                                fetchdata = {fetchdata}
                            />   
                            <MessageDialog
                                open = {openMessage}
                                handleCloseDialog = {handleCloseMessage}
                                selectedEntrance = {selectedEntrance}
                                fetchdata = {fetchdata}
                            />   
                            <StatusDialog
                                open = {openStatus}
                                handleClose = {handleCloseStatus}
                                selectedEntrance = {selectedEntrance}
                                handleStatusChange = {handleFailClick}
                                statuses = {statuses}
                            />   
                            <AppointmentDialog
                                open = {openAppointment}
                                handleCloseDialog = {handleCloseAppointment}
                                selectedEntrance = {selectedEntrance}
                                statusOptions = {statusOptions}
                                courseOptions = {courseOptions}
                                fetchdata = {fetchdata}
                            /> 
                            <EditEntrance 
                                open={open_edit} 
                                handleCloseDialog={handleCloseDialogCreate}
                                entrance={selectedEntrance}
                                fetchdata = {fetchdata}
                            />
                        </div>
                    
                    </div>
                )
            }
        </div>
    )
}
export default StepAppointment
