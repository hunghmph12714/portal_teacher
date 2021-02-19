import React , { useState, useEffect } from 'react'
import './StepInform.scss'
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
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import MaterialTable from "material-table";
import { Can } from '../../../../Can';
import { TestDialog, MessageDialog, AnswersDialog  } from '../../components';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import { useSnackbar } from 'notistack';
import CheckIcon from '@material-ui/icons/Check';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';

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
const StepInform = (props) => {
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
              title: "Deadline",
              field: "deadline",
              headerStyle: {
                padding: '0px',
                fontWeight: '600',
              },
              cellStyle: {
                  padding: '0px',
              },
          },
          {
              title: "# Liên lạc",
              field: "attempts",
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
    
    const [refresh, setRefresh] = useState(true)
    const [loading , setLoading] = useState(true)
    const [openAppointment, setOpenAppointment] = useState(false)
    const [openMessage, setOpenMessage] = useState(false)
    const [selectedEntrance, setSelectedEntrance] = useState({})
    const [statusOptions, setStatusOptions] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const [open_answers, setOpenAnswer] = useState(false)
    const [answers, setAnswer] = useState([])
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    function fetchData(){
        setLoading(true)
        axios.post( "/entrance/get/inform", {centers: centers})
            .then(response => {
                // let d1, d2, d3 = []
                let d1 = []
                let d2 = []
                let d3 = []
                let d4 = []
                var d = new Date();
                // d.setHours(0,0,0,0);

                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i];
                    if(element.status == 'Thất bại 4'){
                        d4.push(element)
                        continue
                    }
                    switch (element.attempts) {
                        case 0:
                            d1.push(element)
                            break;
                        case 1:
                            d2.push(element)
                            break;
                        case 2:

                            d3.push(element)
                            break;
                        case 3:
                            d4.push(element)
                            break;
                        
                        default:
                            break;
                    }
                }
                console.log(d3)
                setData1(d1)
                setData2(d2)
                setData3(d3)
                setData4(d4)
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
        fetchData()
        fetchStatus()
        fetchCourse()        
    }, [centers])    
    function handleFailClick(rowData){
        axios.post('/entrance/step-init/fail-1', {id: rowData.eid, type: 'fail4'})
            .then(response => { 
                fetchData()
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
        if(rowData.test_answers){
            setAnswer(rowData.test_answers)
        }
        
        setOpenAnswer(true)
    }
    function handleCloseAnswerDialog(){
        setAnswer([])
        setOpenAnswer(false)
    }
    function handleOpenDialogAppointment(rowData){
        setOpenAppointment(true)
        setSelectedEntrance(rowData)
    }
    function handleCloseAppointment(){
        setOpenAppointment(false)
    }
    function handleCloseMessage(){
        setOpenMessage(false)
    }
    function handleOpenDialogMessage(rowData){
        setOpenMessage(true)
        setSelectedEntrance(rowData)
    }
    function handleRemove(rowData){
        axios.post('/entrance/step-init/fail-1', {id: rowData.eid, type: 'lostKT'})
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
                fetchData()
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
            })
            .catch(err => {
                console.log(err)
            })
    }
    function handleLostEntrance(rowData){
        axios.post('/entrance/step-init/fail-1', {id: rowData.eid, type: 'lost4'})
            .then(response => { 
                fetchData()
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
                                title="Chưa liên lạc"
                                data={data1}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,   
                                    rowStyle: rowData => {
                                        let today = new Date()
                                        let deadline = new Date(rowData.deadline_formated)
                                        if(today > deadline){
                                            return {backgroundColor: colors.orange[200],}
                                        }
                                    },
                                    filterCellStyle: {
                                        paddingLeft: '0px'
                                    }             
                                }}
                                onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                                actions={[  
                                    {
                                        icon: () => <AddCommentOutlinedIcon />,
                                        tooltip: 'Ghi chú',
                                        isFreeAction: false,
                                        text: 'Ghi chú',
                                        onClick: (event, rowData) => {handleOpenDialogMessage(rowData)},
                                    },                                   
                                    {
                                        icon: () => <PlusOneIcon />,
                                        tooltip: 'Tăng liên lạc',
                                        isFreeAction: false,
                                        text: 'Tăng liên lạc',
                                        onClick: (event, rowData) => {handleIncreaseContact(rowData)},
                                    },
                                    {
                                        icon: () => <DeleteOutlineOutlinedIcon />,
                                        tooltip: 'Thất bại ',
                                        isFreeAction: false,
                                        text: 'Thất bại ',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Chuyển trạng thái thất bại ?')) 
                                                handleFailClick(rowData)
                                            },
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                            />
                        </div>
                    
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="Liên lạc lần 1"
                                data={data2}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,      
                                    rowStyle: rowData => {
                                        let today = new Date()
                                        let deadline = new Date(rowData.deadline_formated)
                                        if(today > deadline){
                                            return {backgroundColor: colors.orange[200],}
                                        }
                                    },   
                                }}
                                onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                                actions={[                       
                                    {
                                        icon: () => <AddCommentOutlinedIcon />,
                                        tooltip: 'Ghi chú',
                                        isFreeAction: false,
                                        text: 'Ghi chú',
                                        onClick: (event, rowData) => {handleOpenDialogMessage(rowData)},
                                    },                                   
                                    {
                                        icon: () => <PlusOneIcon />,
                                        tooltip: 'Tăng liên lạc',
                                        isFreeAction: false,
                                        text: 'Tăng liên lạc',
                                        onClick: (event, rowData) => {handleIncreaseContact(rowData)},
                                    },
                                    {
                                        icon: () => <DeleteOutlineOutlinedIcon />,
                                        tooltip: 'Thất bại ',
                                        isFreeAction: false,
                                        text: 'Thất bại ',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Chuyển trạng thái thất bại ?')) 
                                                handleFailClick(rowData)
                                            },
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                                
                            />
                        </div>
                    
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="Liên lạc lần 2"
                                data={data3}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,         
                                    rowStyle: rowData => {
                                        let today = new Date()
                                        let deadline = new Date(rowData.deadline_formated)
                                        if(today > deadline){
                                            return {backgroundColor: colors.orange[200],}
                                        }
                                    },         
                                }}
                                onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                                actions={[                       
                                    {
                                        icon: () => <AddCommentOutlinedIcon />,
                                        tooltip: 'Ghi chú',
                                        isFreeAction: false,
                                        text: 'Ghi chú',
                                        onClick: (event, rowData) => {handleOpenDialogMessage(rowData)},
                                    },                                   
                                    {
                                        icon: () => <PlusOneIcon />,
                                        tooltip: 'Tăng liên lạc',
                                        isFreeAction: false,
                                        text: 'Tăng liên lạc',
                                        onClick: (event, rowData) => {handleIncreaseContact(rowData)},
                                    },
                                    {
                                        icon: () => <DeleteOutlineOutlinedIcon />,
                                        tooltip: 'Thất bại ',
                                        isFreeAction: false,
                                        text: 'Thất bại ',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Chuyển trạng thái thất bại ?')) 
                                                handleFailClick(rowData)
                                            },
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                                
                            />
                            <MaterialTable
                                title="Liên lạc lần 3 / Thất bại"
                                data={data4}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,         
                                    rowStyle: rowData => {
                                        let today = new Date()
                                        let deadline = new Date(rowData.deadline_formated)
                                        if(today > deadline){
                                            return {backgroundColor: colors.orange[200],}
                                        }
                                    },         
                                }}
                                onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                                actions={[                       
                                    {
                                        icon: () => <AddCommentOutlinedIcon />,
                                        tooltip: 'Ghi chú',
                                        isFreeAction: false,
                                        text: 'Ghi chú',
                                        onClick: (event, rowData) => {handleOpenDialogMessage(rowData)},
                                    },     
                                    {
                                        icon: () => <DeleteOutlineOutlinedIcon />,
                                        tooltip: 'Thất bại ',
                                        isFreeAction: false,
                                        text: 'Thất bại ',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Thất bại liên lạc?')) 
                                                handleLostEntrance(rowData)
                                            },
                                    },
                                ]}
                                localization={lang}
                                columns={column1}
                                
                            />  
                            <MessageDialog
                                open = {openMessage}
                                handleCloseDialog = {handleCloseMessage}
                                selectedEntrance = {selectedEntrance}
                                fetchData = {fetchData}
                            /> 
                        </div>
                    
                    </React.Fragment>
                )
            }
        </React.Fragment>
    )
}
export default StepInform
