import React , { useState, useEffect } from 'react'
import './CompletedEntrance.scss'
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Grid,
    Button,
    Chip, 
    Typography,LinearProgress 
  } from "@material-ui/core";
import Select from 'react-select';

import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import MaterialTable from "material-table";
import { Can } from '../../../Can';
import { AppointmentDialog, MessageDialog, StatusDialog } from '../components';
import { EditEntrance } from '../EditEntrance';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useSnackbar } from 'notistack';
import CreateIcon from '@material-ui/icons/Create';
import { CsvBuilder } from 'filefy';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ReplyIcon from '@material-ui/icons/Reply';

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
const CompletedEntrance = (props) => {
    const { ...rest} = props
    const [data1, setData1] = useState([]);
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
                      {rowData.phone}                                 
                      <br />{rowData.pemail}
                  </Typography>                              
                ),
              renderGroup: (pname, groupData) => (
                <Chip variant="outlined" label={pname} size="small" />       
              )
        
            },
          {
            title: "Bước",
            field: "step",
            headerStyle: {
              padding: '0px',
              fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
          },
          {
            title: "Ngày tạo",
            field: "created_at",
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
    const [centers, setCenters] = useState([])
    const [selected_centers, setSelectedCenters] = useState([])
    const [openStatus, setOpenStatus] = useState(false)
    const [typeStatus, setTypeStatus] = useState('')
    const [loading , setLoading] = useState(true)
    const [refresh, setRefresh] = useState(true)
    const [openAppointment, setOpenAppointment] = useState(false)
    const [openMessage, setOpenMessage] = useState(false)
    const [selectedEntrance, setSelectedEntrance] = useState({})
    const [statusOptions, setStatusOptions] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
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
        axios.post( "/entrance/get/completed", {center_id: selected_centers})
            .then(response => {
                setData1(response.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }
    function onCenterChange(value){
        setSelectedCenters(value)
    }
    useEffect(() => {
        fetchdata()
        // fetchStatus()
        // fetchCourse()        
    }, [selected_centers])
    useEffect(() => {
        axios.get('/get-center')
        .then(response => {
        // let selected_center_ids = this.props.match.params.center_id.split('_')
            setCenters(response.data.map(d => {
                return {value: d.id, label: d.code }
                })
            )
        })
        .catch(err => {
            console.log('get center bug: '+ err)
        })
    },[])    
    function handleFailClick(rowData, reason, comment){
        axios.post('/entrance/step/fail', {id: rowData.eid, type: 'fail1', reason: reason, comment: comment})
            .then(response => { 
                var d = new Date();
                let yesterday = d.setDate(d.getDate() - 1);
                const date = new Date(rowData.created_at);
                let element = {}
                if(date > yesterday){
                    element = data1.filter(d => d.eid == rowData.eid)
                    const d1 = data1.filter(d => d.eid !== rowData.eid)
                    setData1(d1)
                }else{
                    element = data2.filter(d => d.eid == rowData.eid)
                    const d2 = data2.filter(d => d.eid !== rowData.eid)
                }
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                
            })
            .catch(err => {
                console.log(err)
            })
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
    
    function handleOpenDialogStatus(rowData, type){
        setOpenStatus(true)
        setTypeStatus(type)
        setSelectedEntrance(rowData)
    }
    function handleCloseStatus(){
        setOpenStatus(false)
    }
    function handleNotCompleteEntrance(rowData){
        axios.post('/entrance/un-complete', {id: rowData.eid})
            .then(resposne => {
                enqueueSnackbar('Đã chuyển', {variant: 'success'});
                fetchdata()
            })
            .catch( err => {

            })
    }
    
    return(
        <div className='root-entrance'>
            {
                loading ? 
                (<LinearProgress  className="loading"/>):
                (
                    <div> 
                        <Grid container spacing={2}>
                            <Grid item md={4} sm={12}>
                            <h4>CƠ SỞ GHI DANH</h4>
                            <Select
                                isMulti
                                isClearable={false}
                                name="centers"
                                options={centers}
                                value = {selected_centers}
                                onChange = {onCenterChange}
                            />
                            </Grid>
                        </Grid>
                        <div className= "entrance_table"> 
                            <MaterialTable
                                title="Danh sách ghi danh đã hoàn thành"
                                data={data1}
                                options={{
                                    pageSize: 5,
                                    pageSizeOptions: [5, 20, 50, 200],
                                    grouping: true,
                                    filtering: true,
                                    exportButton: true,   
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
                                        icon: () => <ReplyIcon />,
                                        tooltip: 'Chưa hoàn thành',
                                        isFreeAction: false,
                                        text: 'Chưa hoàn thành',
                                        onClick: (event, rowData) => {
                                            if (window.confirm('Chuyển về trạng thái chưa hoàn thành?')) handleNotCompleteEntrance(rowData)}
                                    },
                                    // {
                                    //     icon: () => <HighlightOffIcon />,
                                    //     tooltip: 'Xoá',
                                    //     isFreeAction: false,
                                    //     text: 'Xoá',
                                    //     onClick: (event, rowData) => {
                                    //         if (window.confirm('Bạn có chắc muốn xóa bản ghi này? !')) handleDeleteEntrance(rowData)}
                                    // },
                                ]}
                                localization={lang}
                                columns={column1}
                            />
                        </div>
                        <MessageDialog
                                open = {openMessage}
                                handleCloseDialog = {handleCloseMessage}
                                selectedEntrance = {selectedEntrance}
                                fetchdata = {fetchdata}
                            />   
                    </div>
        
                )
            }
        </div>
        
    )
}
export default CompletedEntrance