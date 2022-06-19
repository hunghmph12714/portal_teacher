import React , { useState, useEffect } from 'react'
import './ListSession.scss'
import { format } from 'date-fns'
import { useSnackbar } from 'notistack';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import DialogSession from './DialogSession';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import DialogDocument from './DialogDocument'
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
    const [document, setDocument] = useState('');
    const [exercice, setExercice] = useState('');
    const [open_check, setOpenCheck] = useState(false);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    function handleOpenDocument(rowData){
      setOpenDocument(true)
      setDocument(rowData.document ? rowData.document : '')
      setExercice(rowData.exercice ? rowData.exercice : '')
    }
    function handleCloseDocument (){
      setOpenDocument(false)
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
    }
    function handleCheckSession(rowData){
      setOpenCheck(true)
      setSelectedSession(rowData)
    }
    function handleCheckClose(){
      setOpenCheck(false)
      setSelectedSession([])

    }
    function handleSubmitChecked(){
      axios.post('/session/lock', {'session_id': selected_session.id})
        .then(response => {
          enqueueSnackbar('Chốt buổi học thành công', {variant: 'success'})
          setFetchData(!fetchdata)
          setOpenCheck(false)
        })
        .catch(err => {
          enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại', {variant: 'error'})
          
        })
    }
    function handleUnlockSession(rowData){
      axios.post('/session/unlock', {session_id: rowData.id})
        .then(response => {
          enqueueSnackbar('Huỷ chốt buổi học thành công', {variant: 'success'})
          setFetchData(!fetchdata)
        })
        .catch(err => {

        })
    }
    function handleDeactivateSession(session_id, table_id){
      axios.post('/session/delete', {session_id: session_id})
        .then(response => {
          enqueueSnackbar('Xóa buổi học thành công', {variant: 'success'})
          fetchdataa()          
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
        setLoading(true)
    }
    useEffect(() => {
        fetchdataa()
    }, [fetchdata, props.from, props.to])
    return (
        <div>
            <MaterialTable
                title="Danh sách ca học"
                data={data}
                isLoading={!isLoading}
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
                            tooltip: 'Thêm mới ca học',
                            isFreeAction: true,
                            text: 'Thêm ca học',
                            onClick: handleCreateSession,
                        },
                    ]}
                localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy ca học'
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
                    //Actionsds
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
                                  <IconButton onClick={() => handleEditSession(rowData)}>
                                    <EditOutlinedIcon fontSize='inherit' />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa ca học" arrow>
                                  <IconButton onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                                      handleDeactivateSession(rowData.id, rowData.tableData.id)}
                                    }>
                                  <DeleteForeverIcon fontSize='inherit' />
                                  </IconButton>
                                </Tooltip>     
                                {
                                  (rowData.status == 0) ? (
                                    <Tooltip title="" arrow>
                                      <IconButton onClick={() => handleCheckSession(rowData)}>
                                        <DoneIcon fontSize='inherit' />
                                      </IconButton>
                                    </Tooltip>
                                  ): (
                                    <Tooltip title="" arrow>
                                      <IconButton onClick={() => {
                                      if (window.confirm('Mở khoá ca học sẽ ảnh hưởng đến hạch toán, xác nhận thao tác')) 
                                        handleUnlockSession(rowData)}
                                      }>
                                        <LockOpenOutlinedIcon fontSize='inherit' />
                                      </IconButton>
                                    </Tooltip>     
                                    
                                  )}
                            </div>
                        )
                      },
                    //Thứ
                      {
                        title: "Thứ",
                        field: "day",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {
                          return (                                
                            <div>
                                {Vndate[rowData.day]}
                            </div>                           
                          )
                        },
                        
                        renderGroup: (day, groupData) => (
                          <Chip variant="outlined" label={Vndate[day]} size="small" />      
                        )
                      },
                    //Ngày học
                      {
                        title: "Ngày học",
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
                        title: "Phòng học",
                        field: "rname",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                        render: rowData => {                            
                          return (                              
                            <Tooltip title={rowData.ctname}>
                              <Chip variant="outlined" label={rowData.rname} size="small" />
                            </Tooltip>                          
                          )
                        },
                        renderGroup: (rname, groupData) => (                            
                          <Chip variant="outlined" label={rname} size="small" />
                        )                
                      }, 
                      {
                        title: "Giáo viên",
                        field: "tname",
                        disableClick: true,
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
                                  <b>{rowData.tname}</b>
                                  <br /> {rowData.phone}
                                  <br /> {rowData.email}
                              </Typography>
                            )
                          },
                          
                        renderGroup: (tname, groupData) => (
                            <Chip variant="outlined" label={tname} size="small" />      
                        )
                                       
                      },      
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
                      {
                        title: "Ghi chú",
                        field: "note",
                        grouping: false,
                        headerStyle: {
                          padding: '0px',
                          fontWeight: '600',                      
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                      } ,
                      {
                        title: "Loại",
                        field: "type",
                        lookup: {'main': 'Chính khóa', 'tutor': 'Phụ đạo', 'tutor_online': 'Phụ đạo ONLINE','exam': 'KTĐK'},
                        grouping: false,
                        headerStyle: {
                          padding: '4px',
                          fontWeight: '600',                      
                        },
                        cellStyle: {
                            padding: '4px',
                        },
                      },
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
            {selected_session ? (
              <Dialog
                open={open_check}
                onClose={handleCheckClose}
              >
                <DialogTitle id="alert-dialog-title">{"Khoá ca học và khởi tạo doanh thu"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Bạn có muốn khoá ca học của lớp <b>{selected_session.code} </b> ngày <b>{selected_session.date} </b> của thầy/cô <b>{selected_session.tname}</b>.
                    Buổi học có: <b>{selected_session.present_number} </b>HS có mặt, <b>{selected_session.absent_number} </b>HS vắng mặt, <b>{selected_session.ss_number - selected_session.present_number - selected_session.absent_number} HS chưa được điểm danh !</b>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCheckClose} color="primary">
                    Huỷ
                  </Button>
                  <Button onClick={handleSubmitChecked} color="primary" autoFocus>
                    Đồng ý
                  </Button>
                </DialogActions>
              </Dialog>) : ""
            }
        </div>
    )
}
export default (ListSession)