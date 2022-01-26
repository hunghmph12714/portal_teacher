import React , { useState, useEffect } from 'react'
import './ListResult.scss'
import SpreadSheet from '@rowsncolumns/spreadsheet'
import DialogQuiz from './DialogQuiz'
import { format } from 'date-fns'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import FindInPageIcon from '@material-ui/icons/FindInPage';
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

const ListResult = (props) => {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([
    
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
            
              
        },
        {
            title: "Bắt đầu",
            field: "start_time",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
            
              
        },
        {
            title: "Mục tiêu",
            field: "objectives",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '0px',
            },
            
              
        },

    ])
    const [open, setOpen] = useState(false)
    const [ss_id, setSsId] = useState('')
    useEffect(() => {
    async function fetchJSON () {
        axios.post('/event/result', {event_id: props.class_id})
            .then(response => {
                setSessions(response.data)
                setLoading(false)
            })
    }    
    fetchJSON()
  }, [])
  function handleOpenQuizDialog(rowData){
      if(rowData.result_status == 'Đã có bài'){
        window.open(
            '/mark/'+rowData.pivot.id,
            '_blank' // <- This is what makes it open in a new window.
          );
      }

  }
  function handleCloseDialog(){
      setOpen(false)
  }
  return (
      <>
      {loading ? <LinearProgress /> : (
        <div className="result-root">
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
                        selection: false,
                        exportButton: true,
                        pageSize: 10,
                        pageSizeOptions: [10, 20, 50],                    
                        rowStyle: rowData => {
                            return {padding: '0px',}                         
                            
                        },
                        rowStyle: rowData => {                       
                            if(rowData.result_status == 'Đã có bài'){
                                // return { backgroundColor: '#d4cad5'}
                            }
                            if(rowData.result_status == 'Chưa làm bài'){
                                return { backgroundColor: 'rgb(234, 221, 218)'}
                            }
                            if(rowData.result_status == 'Chưa có bài'){
                                return { backgroundColor: '#d4cad5'}
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
                                icon: () => <FindInPageIcon />,
                                tooltip: 'Xem bài thi',
                                isFreeAction: false,
                                text: 'Xem bài thi',
                                onClick: (event, rowData) => {handleOpenQuizDialog(rowData)}
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
        <DialogQuiz
            open={open}
            ss_id = {ss_id}
            handleCloseDialog = {handleCloseDialog}
        />
    </div>
    )}
      </>
    
    
  )
}
export default ListResult