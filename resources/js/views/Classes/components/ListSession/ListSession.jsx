import React , { useState, useEffect } from 'react'
import './ListSession.scss'
import { format } from 'date-fns'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import DialogSession from './DialogSession';
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
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState('create');
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    const [selected_session, setSelectedSession] = useState([]);
    const [columns, setColumn] = useState(
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
                          handleDeactivateSession(rowData.sid, rowData.tableData.id)}
                        }>
                      <DeleteForeverIcon fontSize='inherit' />
                      </IconButton>
                    </Tooltip>                                
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
            title: "Trạng thái",
            field: "status",
            lookup: {0: 'Khởi tạo', 1: 'Công nợ', 2: 'Điểm danh', 3: 'Chốt'},
            grouping: false,
            headerStyle: {
              padding: '0px',
              fontWeight: '600',                      
            },
            cellStyle: {
                padding: '0px',
            },
          }
      ]
    )
    const [openDocument, setOpenDocument] = useState(false);
    const [document, setDocument] = useState('');
    const [exercice, setExercice] = useState('');
    

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
      setFetchData(!fetchData)
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
      console.log(session_id)
      axios.post('/session/delete', {session_id: session_id})
        .then(response => {

        })
        .catch(err => {

        })
      setFetchData(!fetchData)
    }
    useEffect(() => {
        const fetchData = async() => {
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
        fetchData()
    }, [fetchData, props.from, props.to])
    return (
        <React.Fragment>
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
                columns={columns}
            />
            <DialogSession
              open={open}
              class={{}}
              session = {selected_session}
              class_id = {class_id}
              handleCloseDialog={handleCloseSessionDialog}
              dialogType = {dialogType}/>
            <DialogDocument 
              open_dialog={openDocument}
              handleCloseDialog={handleCloseDocument}
              document = {document}
              exercice = {exercice}
            />
        </React.Fragment>
    )
}
export default ListSession