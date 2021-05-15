import React , { useState, useEffect } from 'react'
import './StepFinal.scss'
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
    Chip, colors ,
    Typography ,LinearProgress
  } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import { EditEntrance } from '../../EditEntrance';
import CreateIcon from '@material-ui/icons/Create';
import { CsvBuilder } from 'filefy';

import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import EditLocationOutlinedIcon from '@material-ui/icons/EditLocationOutlined';
import MaterialTable from "material-table";
import { Can } from '../../../../Can';
import { TestDialog, MessageDialog, StatusDialog, AnswersDialog, ClassDialog  } from '../../components';
import { useSnackbar } from 'notistack';
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
const StepFinal = (props) => {
    const {centers,  ...rest} = props
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [column1, setCol1] = useState(
        [
          //Học sinh
            {
              title: "Học sinh",
              field: "sname",
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
                      <Can I="read_phone" on="Ghi danh"><br />{rowData.phone} </Can>                                
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
              title: "Điểm",
              field: "test_score",
              headerStyle: {
                padding: '0px',
                fontWeight: '600',
              },
              cellStyle: {
                  padding: '0px',
              },
          },
          {
              title: "Nhận xét",
              field: "test_note",
              headerStyle: {
                padding: '0px',
                fontWeight: '600',
              },
              cellStyle: {
                  padding: '0px',
              },
          },
          {
              title: "Xếp lớp",
              field: "class",
              headerStyle: {
                padding: '0px',
                fontWeight: '600',
              },
              cellStyle: {
                  padding: '0px',
              },
          },
          {
              title: "Ngày bắt đầu",
              field: "enroll_date",
              type: "date",
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
    const [results, setResults] = useState([])

    const [refresh, setRefresh] = useState(true)
    const [loading , setLoading] = useState(true)
    const [openAppointment, setOpenAppointment] = useState(false)
    const [openMessage, setOpenMessage] = useState(false)
    const [selectedEntrance, setSelectedEntrance] = useState({})
    const [statusOptions, setStatusOptions] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const [open_answers, setOpenAnswer] = useState(false)
    const [answers, setAnswer] = useState([])
    const [openStatus, setOpenStatus] = useState(false)
    const [typeStatus, setTypeStatus] = useState('')
    const [classes, setClasses] = useState([])
    const [open_class, setOpenClass] = useState(false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [open_edit, setOpenEdit] = useState(false);
    function handleOpenEditDialog(rowData){
        setOpenEdit(true)
        setSelectedEntrance(rowData)
    }
    function handleCloseDialogCreate(){
        setOpenEdit(false)
    }
    function fetchdata(){
        setLoading(true)
        axios.post( "/entrance/get/final", {centers: centers})
            .then(response => {
                let d1 = []
                let d2 = []
                let d3 = []
                var d = new Date();
                d.setHours(0,0,0,0);
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i];
                    const date = new Date(element.enroll_date)
                    if(element.status == 'Thất bại 5'){
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
        const fetchClass = async() => {
            const c = await axios.get('/class/get-all/-1/-1')
            setClasses(c.data.map(cl => {
                    return {label: cl.code, value: cl.id}
                })
            )
        }
        fetchdata()
        fetchStatus()
        fetchCourse()  
        fetchClass()      
    }, [centers])    
    function handleFailClick(rowData, reason, comment){
        axios.post('/entrance/step-init/fail-1', {id: rowData.eid, type: 'fail4', reason: reason, comment: comment})
            .then(response => { 
                fetchdata()
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                
            })
            .catch(err => {
                console.log(err)
            })
    }
    function handleOpenAnswerDialog(rowData) {
        if(typeof rowData.test_answers == 'string'){
            rowData.test_answers = rowData.test_answers.split(',')
        }
        if(typeof rowData.test_results == 'string'){
            rowData.test_results = rowData.test_results.split(',')
        }
        if(rowData.test_answers){
            setAnswer(rowData.test_answers)
        }
        if(rowData.test_results){
            setResults(rowData.test_results)
        }
          
        setOpenAnswer(true)
    }
    function handleCloseAnswerDialog(){
        setAnswer([])
        setOpenAnswer(false)
    }
    function handleCloseMessage(){
        setOpenMessage(false)
    }
    function handleOpenDialogMessage(rowData){
        setOpenMessage(true)
        // console.log(rowData)
        setSelectedEntrance(rowData)
    }
    function handleOpenDialogStatus(rowData, type){
        setOpenStatus(true)
        setTypeStatus(type)
        setSelectedEntrance(rowData)
    }
    function handleCloseStatus(){
        setOpenStatus(false)
    }
    function handleOpenClassDialog(rowData){
        setOpenClass(true)
        setSelectedEntrance(rowData)
    }
    function handleCloseClass(){
        setOpenClass(false)
    }
    function handleRemove(rowData, reason, comment){
        axios.post('/entrance/step-init/fail-1', {id: rowData.eid, type: 'lostKT', reason: reason, comment: comment})
            .then(response => { 
                const d3 = data3.filter(d => d.eid !== rowData.eid)
                setData3(d3)
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
            })
            .catch(err => {
                console.log(err)
            })
    }
    function handleIncreaseContact(rowData){
        axios.post('/entrance/inform/increase', {id: rowData.eid})
            .then(response => { 
                fetchdata()
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
            })
            .catch(err => {
                console.log(err)
            })
    }
    function handleLostEntrance(rowData){
        axios.post('/entrance/step-init/fail-1', {id: rowData.eid, type: 'lost4'})
            .then(response => { 
                fetchdata()
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                
            })
            .catch(err => {
                console.log(err)
            })
    }
    return(
        <React.Fragment>
            {
                loading ? 
                (<LinearProgress  className="loading"/>):
                (
                    <React.Fragment> 
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="HS sắp nhập học"
                                data={data1}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,   
                                    // rowStyle: rowData => {
                                    //     let today = new Date()
                                    //     let deadline = new Date(rowData.deadline_formated)
                                    //     if(today > deadline){
                                    //         return {backgroundColor: colors.orange[200],}
                                    //     }
                                    // },
                                    filterCellStyle: {
                                        paddingLeft: '0px'
                                    }     ,
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
                                        icon: () => <EditLocationOutlinedIcon />,
                                        tooltip: 'Xếp lớp',
                                        isFreeAction: false,
                                        text: 'Xếp lớp',
                                        onClick: (event, rowData) => {handleOpenClassDialog(rowData)},
                                    },   
                                    {
                                        icon: () => <DeleteOutlineOutlinedIcon />,
                                        tooltip: 'Thất bại ',
                                        isFreeAction: false,
                                        text: 'Thất bại ',
                                        onClick: (event, rowData) => {handleOpenDialogStatus(rowData, 'type4')},
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                            />
                        </div>
                    
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="HS quá hạn nhập học"
                                data={data2}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,      
                                    // rowStyle: rowData => {
                                    //     let today = new Date()
                                    //     let deadline = new Date(rowData.deadline_formated)
                                    //     if(today > deadline){
                                    //         return {backgroundColor: colors.orange[200],}
                                    //     }
                                    // },   
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
                                        icon: () => <EditLocationOutlinedIcon />,
                                        tooltip: 'Xếp lớp',
                                        isFreeAction: false,
                                        text: 'Xếp lớp',
                                        onClick: (event, rowData) => {handleOpenClassDialog(rowData)},
                                    },   
                                    {
                                        icon: () => <DeleteOutlineOutlinedIcon />,
                                        tooltip: 'Thất bại ',
                                        isFreeAction: false,
                                        text: 'Thất bại ',
                                        onClick: (event, rowData) => {handleOpenDialogStatus(rowData, 'type4')},
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                                
                            />
                        </div>
                    
                        <div className= "Học sinh quá hạn nhập học"> 
                            <MaterialTable
                                title="Thất bại"
                                data={data3}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,         
                                    // rowStyle: rowData => {
                                    //     let today = new Date()
                                    //     let deadline = new Date(rowData.deadline_formated)
                                    //     if(today > deadline){
                                    //         return {backgroundColor: colors.orange[200],}
                                    //     }
                                    // },         
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
                                        icon: () => <EditLocationOutlinedIcon />,
                                        tooltip: 'Xếp lớp',
                                        isFreeAction: false,
                                        text: 'Xếp lớp',
                                        onClick: (event, rowData) => {handleOpenClassDialog(rowData)},
                                    },   
                                    {
                                        icon: () => <DeleteOutlineOutlinedIcon />,
                                        tooltip: 'Thất bại ',
                                        isFreeAction: false,
                                        text: 'Thất bại ',
                                        onClick: (event, rowData) => {handleOpenDialogStatus(rowData, 'type4')},
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                                
                            />
                           
                            <MessageDialog
                                open = {openMessage}
                                handleCloseDialog = {handleCloseMessage}
                                selectedEntrance = {selectedEntrance}
                                fetchdata = {fetchdata}
                            /> 
                            
                            <AnswersDialog 
                                open_answers={open_answers}
                                handleCloseDialog={handleCloseAnswerDialog}
                                answers = {answers}
                                results = {results}
                            />  
                            <StatusDialog
                                open = {openStatus}
                                handleClose = {handleCloseStatus}
                                selectedEntrance = {selectedEntrance}
                                handleStatusChange = {(typeStatus == 'type4') ? handleFailClick : handleRemove}
                            /> 
                            <ClassDialog
                                open = {open_class}
                                classes = {classes}
                                confirm = {true}
                                handleClose = {handleCloseClass}
                                selectedEntrance = {selectedEntrance}
                                fetchdata= {fetchdata}
                            /> 
                            <EditEntrance 
                                open={open_edit} 
                                handleCloseDialog={handleCloseDialogCreate}
                                entrance={selectedEntrance}
                                fetchdata = {fetchdata}
                            />
                        </div>
                    
                    </React.Fragment>
                )
            }
        </React.Fragment>
    )
}
export default StepFinal
