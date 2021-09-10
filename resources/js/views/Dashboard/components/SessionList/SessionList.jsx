import React , { useState, useEffect } from 'react'
import './SessionList.scss'
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
import Select from 'react-select';
import {
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Tooltip,LinearProgress,
    Button, Card, CardContent
  } from "@material-ui/core";
  import MaterialTable from "material-table";
  import Chip from '@material-ui/core/Chip';
  import FolderOpenIcon from '@material-ui/icons/FolderOpen';
  import DateFnsUtils from "@date-io/date-fns"; // choose your lib

import vi from "date-fns/locale/vi";
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
const baseUrl = window.Laravel.baseUrl
const SessionList = (props) => {
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

    const [from, setFrom] = useState(new Date());
    const [to, setTo] = useState(new Date());
    const [centers, setCenters] = useState([]);
    const [selected_centers, setSelectedCenter] = useState([{value: -1, label: 'Tất cả cơ sở'}])

    const [stats, setStats] = useState({
      diemdanh: 0, upbt: 0, uptl: 0, hsvang: 0, hsnghi: 0, hsmoi: 0, hsnoti: 0
    })
    function onCenterChange(value){
      setSelectedCenter(value)
    }

    function handleFromChange(value){
      setFrom(value)
    }
    function handleToChange(value){
      setTo(value)
    }
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
      //ss
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
        setLoading(false)
        const response = await axios.post(baseUrl + '/session/get-dashboard', {center_id: selected_centers, from: from, to: to})
        setData(response.data.result.map(r => {
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
        setStats(response.data.stats)
        setLoading(true)
    }
    function refreshDashboard(){
      fetchdataa()
    }
    useEffect(() => {
      axios.get('/get-center')
        .then(response => {
          setCenters(response.data.map(d => {
              return {value: d.id, label: d.name }
            })
          )
        })
        .catch(err => {
          console.log('get center bug: '+ err)
        })
    }, [])
    useEffect(() => {
        fetchdataa()
    }, [fetchdata])
    return (
        <React.Fragment>
            {!isLoading ? <LinearProgress  className="loading"/>: ''}
            <div className='dashboard-select'>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <Card>
                    <CardContent>
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                        <KeyboardDatePicker
                          autoOk
                          size= "small"
                          className="input-from-range"
                          variant="inline"
                          inputVariant="outlined"
                          format="dd/MM/yyyy"
                          label="Từ ngày"
                          views={["year", "month", "date"]}
                          value={from}
                          onChange={handleFromChange}
                        />  
                      </MuiPickersUtilsProvider>
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} className='to'>
                        <KeyboardDatePicker
                          autoOk
                          minDate = {from}
                          className="input-to-range"
                          size= "small"
                          variant="inline"
                          inputVariant="outlined"
                          format="dd/MM/yyyy"
                          label="Đến ngày"
                          views={["year", "month", "date"]}
                          value={to}
                          onChange={handleToChange}
                        />  
                      </MuiPickersUtilsProvider>
                        <Select
                          className="center"
                          placeholder="Lựa chọn cơ sở"
                          isMulti
                          isClearable={false}
                          name="centers"
                          options={centers}
                          value = {selected_centers}
                          onChange = {onCenterChange}
                        />
                        <Button fullWidth className="refresh-btn" onClick={refreshDashboard}> Làm mới</Button>
                    </CardContent>
                  </Card>
                  </Grid>
                <Grid item md={8}>
                  <div className="stats"> 
                      <Grid container spacing={2} className="grid-no-shadow">
                        <Grid item md={2} sm={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="span" color="textSecondary" gutterBottom>
                                Ca chưa điểm danh: <br/>
                              </Typography>
                              <span className="stats_number"> {stats.diemdanh}</span>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item md={2} sm={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="span" color="textSecondary" gutterBottom>
                                Ca chưa up bài tập:<br/>
                              </Typography>
                              <span className="stats_number"> {stats.upbt} </span>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item md={2} sm={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="span"  color="textSecondary" gutterBottom>
                                Ca chưa up tài liệu: <br/>
                              </Typography>
                              <span className="stats_number"> {stats.uptl} </span>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item md={2} sm={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="span"  color="textSecondary" gutterBottom>
                                Nghỉ không phép: <br/>
                              </Typography>
                              <span className="stats_number"> {stats.hsvang} </span>
                              
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item md={2} sm={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="span"  color="textSecondary" gutterBottom>
                                Học sinh thôi học: <br/>
                              </Typography>
                              <span className="stats_number"> {stats.hsnghi} </span>
                              
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item md={2} sm={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="span"  color="textSecondary" gutterBottom>
                                Học sinh mới: <br/>
                              </Typography>
                              <span className="stats_number"> {stats.hsmoi} </span>
                              
                            </CardContent>
                          </Card>
                        </Grid>
                        
                      </Grid>

                      <Grid container spacing={2} className="grid-no-shadow, stats-row-second">
                        <Grid item md={2} sm={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="span" color="textSecondary" gutterBottom>
                                Chưa gửi THHT: <br/>
                              </Typography>
                              <span className="stats_number"> {stats.hsnoti}</span>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                      </Grid>
                
                
                </div>
            
                  </Grid>
                </Grid>
            </div>  
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
                        rowData => ({
                          icon: () => <EditOutlinedIcon />,
                          tooltip: 'Sửa ca học',
                          isFreeAction: false,
                          text: 'Sửa ca học',
                          onClick: () => handleEditSession(rowData),
                        }),
                        rowData => ({
                          icon: () => <DeleteForeverIcon />,
                          tooltip: 'Xoá ca học',
                          isFreeAction: false,
                          text: 'Xoá ca học',
                          onClick: () => {
                            if (window.confirm('Bạn có chắc muốn xóa bản ghi này? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn !')) 
                              handleDeactivateSession(rowData.id, rowData.tableData.id)
                          }                          
                        }),
                        rowData => ({
                          icon: () => {
                            if(rowData.status == 0){
                              return <DoneIcon />
                            }else{
                              return <LockOpenOutlinedIcon />
                            }
                          },
                          isFreeAction: false,
                          onClick: () => {
                            if(rowData.status == 0){
                              handleCheckSession(rowData)
                            }else{
                              if (window.confirm('Mở khoá ca học sẽ ảnh hưởng đến hạch toán, xác nhận thao tác')) 
                                handleUnlockSession(rowData)                              
                            }
                          }                          
                        }),
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
                    
                    //Lớp
                      {
                        title: "Lớp",
                        field: "code",
                        headerStyle: {
                            padding: '0px',
                            fontWeight: '600',
                        },
                        cellStyle: {
                            padding: '0px',
                        },
                      },
                    //Cơ sở
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
                      {
                        title: "Sĩ số",
                        field: "ss_number",
                        grouping: false,
                        headerStyle: {
                          padding: '0px',
                          fontWeight: '600',
                          width: '80px',
                        },
                        cellStyle: {
                            padding: '0px',
                            width: '80px',
                        },
                      },
                      {
                        title: "Có mặt",
                        field: "present_number",
                        grouping: false,
                        headerStyle: {
                          padding: '0px',
                          fontWeight: '600',        
                          width: '80px',              
                        },
                        cellStyle: {
                            padding: '0px',
                            width: '80px',
                        },
                      },
                      {
                        title: "Vắng",
                        field: "absent_number",
                        grouping: false,
                        headerStyle: {
                          padding: '0px',
                          fontWeight: '600',      
                          width: '80px',                
                        },
                        cellStyle: {
                            padding: '0px',
                            width: '80px',
                        },
                      },
                  ]
                }
            />
            <DialogSession
              open={open}
              class={{}}
              session = {selected_session}
              class_id = {class_id}
              class_fee = {0}
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
            
        </React.Fragment>
    )
}
export default (SessionList)