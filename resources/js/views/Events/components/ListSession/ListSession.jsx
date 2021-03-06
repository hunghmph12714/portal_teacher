import React , { useState, useEffect } from 'react'
import './ListSession.scss'
import { format } from 'date-fns'
import { useSnackbar } from 'notistack';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import DialogSession from './DialogSession';
import DialogDocument from './DialogDocument'
import DialogStudent from './DialogStudent'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
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
const ListSession = (props) => {
    const Vndate = ['','Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const { class_id } = props
    const class_fee = props.class_fee
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState('create');
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [fetchdata, setFetchData] = useState(true);
    const [selected_session, setSelectedSession] = useState([]);
    const [columns, setColumn] = useState()
    const [openDocument, setOpenDocument] = useState(false);
    const [openStudent, setOpenStudent] = useState(false);

    const [document, setDocument] = useState('');
    const [exercice, setExercice] = useState('');
    const [classes, setClasses] = useState([]);    
    const [selected_students, setSelectedStudents] = useState([]);
    const [session_name, setSessionName] = useState('');
    const [sessionId, setSessionId] = useState(null)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const handleCloseStudent = () => {
      setOpenStudent(false)
      setFetchData(!fetchdata)
    } 
    const handleOpenStudent = (rowData) => {
      setSessionName(rowData.content)
      setSessionId(rowData.id)
      setOpenStudent(true)
    }
  function handleOpenDocument(rowData){
      setOpenDocument(true)
      setDocument(rowData.document ? rowData.document : '')
      setExercice(rowData.exercice ? rowData.exercice : '')
    }
    function handleCloseDocument (){
      setOpenDocument(false)
      setFetchData(!fetchdata)
    }
    function handleCloseSessionDialog(){
      setOpen(false)
      setSelectedSession([])
      setFetchData(!fetchdata)
    }
    function handleCreateSession(){
      setOpen(true)
      setDialogType('create')
    }
    function handleEditSession(rowData){
      setOpen(true)
      setDialogType('edit')
      setSelectedSession(rowData)
      //ss
    }
    function handleDeactivateSession(session_id, table_id){
      axios.post('/session/delete', {session_id: session_id})
        .then(response => {
          enqueueSnackbar('Xóa sản phẩm thành công', {variant: 'success'})
          fetchdataa()          
        })
        .catch(err => {

        })
    }
    function handleSendEmailReminder(rowData){
      console.log(rowData)
      const sessions = rowData.map(r => r.id)
      const class_id = rowData[0].cid
      axios.post('/session/send-reminder', {class_id: class_id, sessions:sessions})
        .then(response => {
          
        })
        .catch(err => {

        })
    }
    const fetchdataa = async() => {
        const response = await axios.post(baseUrl + '/session/get', {class_id: class_id, from_date: props.from, to_date: props.to})
        setData(response.data.map(r => {
            let date = new Date(r.date)
            r.from_full = r.from
            r.to_full = r.to
            r.date = format(date , 'dd-MM-yyyy')
            r.day = format(date, 'i') 
            r.from = format(new Date(r.from), 'HH:mm')
            r.to = format(new Date(r.to), 'HH:mm')
            r.document = (r.document)?r.document:'',
            r.exercice = (r.exercice)?r.exercice:'',
            r.time = r.from + ' - ' + r.to
            return r
          })
        )
        const c = await axios.get('/event/get-class')
        setClasses(c.data.map( r => {return {label: r.code, value: r.id}}))
        setLoading(true)
    }
    
    useEffect(() => {
        fetchdataa()
    }, [fetchdata, props.from, props.to])
    return (
        <React.Fragment>
            <MaterialTable
              title="Danh sách sản phẩm"
              data={data}
              isLoading={!isLoading}
              options={{
                      pageSize: 10,
                      grouping: true,
                      filtering: true,
                      exportButton: true,
                      selection: true,
                      rowStyle: rowData => {
                          return {padding: '0px',}                         
                        
                      },
                      filterCellStyle: {
                        paddingLeft: '0px'
                      }
              }}
              onRowClick={(event, rowData) => { handleOpenStudent(rowData) }}
              actions={[
                {
                    icon: () => <AddBoxIcon />,
                    tooltip: 'Thêm mới môn học',
                    isFreeAction: true,
                    text: 'Thêm môn học',
                    onClick: handleCreateSession,
                },
                {
                  icon: () => <MailOutlineIcon />,
                  tooltip: 'Gửi Email thông báo địa điểm',
                  isFreeAction: false,
                  text: 'Gửi Email thông báo địa điểm',
                  onClick: (event, rowData) => { handleSendEmailReminder(rowData) }
                },
              ]}
              localization={{
                      body: {
                          emptyDataSourceMessage: 'Không tìm thấy môn học'
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
              columns={
                [
                  //Action
                    {
                      title: "",
                      field: "action",
                      filtering: false,
                      disableClick: true,
                      sorting: false,
                      headerStyle: {
                          padding: '0px', 
                          width: '90px',
                      },
                      cellStyle: {
                          width: '90px',
                          padding: '0px',
                      },
                      render: rowData => (
                          <div style = {{display: 'block'}}>
                              {/* {rowData.tableData.id} */}
                              <Tooltip title="Chỉnh sửa" arrow>
                                <IconButton onClick={() => handleEditSession(rowData)}>
                                  <EditOutlinedIcon fontSize='inherit' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa môn học" arrow>
                                <IconButton onClick={() => {
                                  if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                                    handleDeactivateSession(rowData.id, rowData.tableData.id)}
                                  }>
                                <DeleteForeverIcon fontSize='inherit' />
                                </IconButton>
                              </Tooltip>                                
                          </div>
                      )
                    },
                  //Thứ
                    {
                      title: "Sản phẩm",
                      field: "content",
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          padding: '0px',
                      },
                    },
                  //Ngày học
                    {
                      title: "Ngày",
                      field: "date",
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          padding: '3px 0px',
                      },
                    },
                    {
                      title: "Thời gian",
                      field: "time",
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          padding: '3px 0px',
                      }                        
                    },
                  //Phòng học
                    {
                      title: "Cơ sở",
                      field: "ctname",
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          padding: '0px',
                      },        
                    },
                    
                    {
                      title: "Tổng",
                      field: "present_number",
                      headerStyle: {
                          padding: '0px',
                          width: '90px',
                          fontWeight: '600',
                      },
                      cellStyle: {
                          width: '90px',
                          padding: '0px 5px',
                      },        
                    },
                    // {
                    //   title: "Địa điểm",
                    //   field: "rname",
                    //   headerStyle: {
                    //       padding: '0px',
                    //       fontWeight: '600',
                    //   },
                    //   cellStyle: {
                    //       padding: '0px',
                    //   },      
                    // },
                    // {
                    //   title: "Giáo viên",
                    //   field: "tname",
                    //   disableClick: true,
                    //   headerStyle: {
                    //       padding: '0px',                            
                    //       fontWeight: '600',
                    //   },
                    //   cellStyle: {
                    //       padding: '0px',
                    //   },
                    //   render: rowData => {
                    //       return (                                
                    //         <Typography variant="body2" component="p">                                    
                    //             <b>{rowData.tname}</b>
                    //             <br /> {rowData.phone}
                    //             <br /> {rowData.email}
                    //         </Typography>
                    //       )
                    //     },
                        
                    //   renderGroup: (tname, groupData) => (
                    //       <Chip variant="outlined" label={tname} size="small" />      
                    //   )
                                      
                    // },      
                    {
                      title: "Tài liệu",
                      field: "document",     
                      grouping: false,                   
                      headerStyle: {
                          padding: '0px',
                          fontWeight: '600',                      
                      },
                      cellStyle: {
                          padding: '0px',
                      },
                      render: rowData => {                    
                        return (rowData.document.length != 0 || rowData.exercice.length != 0) ? (
                          <FolderOpenIcon  onClick = {() => handleOpenDocument(rowData)}/>
                          
                        ): ("")
                      } 
                    },  
                    // {
                    //   title: "Ghi chú",
                    //   field: "note",
                    //   grouping: false,
                    //   headerStyle: {
                    //     padding: '0px',
                    //     fontWeight: '600',                      
                    //   },
                    //   cellStyle: {
                    //       padding: '0px',
                    //   },
                    // } ,
                    // {
                    //   title: "Loại",
                    //   field: "type",
                    //   lookup: {'main': 'Chính khóa', 'tutor': 'Phụ đạo', 'tutor_online': 'Phụ đạo ONLINE','exam': 'KTĐK'},
                    //   grouping: false,
                    //   headerStyle: {
                    //     padding: '4px',
                    //     fontWeight: '600',                      
                    //   },
                    //   cellStyle: {
                    //       padding: '4px',
                    //   },
                    // },
                    // {
                    //   title: "Trạng thái",
                    //   field: "status",
                    //   lookup: {0: 'Khởi tạo', 1: 'Công nợ', 2: 'Điểm danh', 3: 'Chốt'},
                    //   grouping: false,
                    //   headerStyle: {
                    //     padding: '0px',
                    //     fontWeight: '600',                      
                    //   },
                    //   cellStyle: {
                    //       padding: '0px',
                    //   },
                    // }
                ]
              }
            />
            <DialogSession
              open={open}
              class={{}}
              classes={classes}
              session = {selected_session}
              class_id = {class_id}
              class_fee = {class_fee}
              handleCloseDialog={handleCloseSessionDialog}
              dialogType = {dialogType}/>
            <DialogDocument 
              open_dialog={openDocument}
              handleCloseDialog={handleCloseDocument}
              document = {document}
              exercice = {exercice}
            />
            <DialogStudent 
              open_dialog={openStudent}
              handleCloseDialog={handleCloseStudent}
              event = {props.class_code}
              session_id = {sessionId}
              session_name = {session_name}
            />
        </React.Fragment>
    )
}
export default (ListSession)