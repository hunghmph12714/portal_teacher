import React , { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import PublishIcon from '@material-ui/icons/Publish';
import { CsvBuilder } from 'filefy';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import MaterialTable from "material-table";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  }));
const DialogStudent = props => {
    const classes = useStyles();
    const {state, open_dialog, handleCloseDialog, document, exercice, ...rest} = props
    const [file, setFile] = useState('');
    const [rows, setRows] = useState([]);
    const [cols, setCols] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [columns, setColumns] = useState([
        //STT
        {
            title: "STT",
            field: "id",
            headerStyle: {
                width: '10px',
                fontWeight: '600',
            },
            cellStyle: {
                width: '10px',
            },
            filtering: false,
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
            title: "SBD",
            field: "sbd",
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
        },
        {
            title: "Trường",
            field: "school",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '3px 0px',
            },

        },        
        {
            title: "Ngày sinh",
            field: "dob",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '3px 0px',
            },

        },        
        {
            title: "Phòng thi",
            field: "room",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '3px 0px',
            },

        },        
        {
            title: "Điểm",
            field: "score",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '3px 0px',
            },

        },        
        {
            title: "Tổng",
            field: "max_score",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '3px 0px',
            },

        },        
        {
            title: "Nhận xét",
            field: "comment",
            headerStyle: {
                padding: '0px',
                fontWeight: '600',
            },
            cellStyle: {
                padding: '3px 0px',
            },

        },        
        
       
    ])
    const fetchData = async() => {
        const response = await axios.post('/session-students', {session_id: props.session_id})
        setStudents(response.data.map(s => {
            return ({'fullname': s.label, 'dob': s.dob, 'school': s.school, 'sbd': s.sbd, 'score': s.pivot.score,'max_score': s.pivot.max_score, 'comment': s.pivot.comment, 'room': s.pivot.btvn_comment})
        }))
        setLoading(false)
    }
    
    useEffect(() => {
        fetchData()
    }, [props.open_dialog])
    
    const onUploadChange = (event) => {
        const formData = new FormData(); 
        const f = event.target.files[0];
        ExcelRenderer(f, (err, resp) => {
            if(err){
                enqueueSnackbar('Có lỗi trong quá trình tải lên', {'variant': 'error'})  
            }
            else{
                setCols(resp.cols)
                setRows(resp.rows)
                setLoading(true)
                axios.post('/event-upload-score',{
                    file: resp.rows,
                    session_id: props.session_id,
                    event_id: props.event
                })
                .then(response => {
                    enqueueSnackbar('Đã cập nhật', {'variant': 'success'})
                    setStudents(response.data)
                    setLoading(false)
                })
                .catch(err => {
                    enqueueSnackbar('Có lỗi xảy ra', {'variant': 'error'})
                })
            }
          });    
    }
    return(
        <Dialog 
            {...rest}    
            fullScreen          
            // maxWidth='lg'
            scroll='paper'
            className='root-edit-entrance'
            open={open_dialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4></h4>
            </DialogTitle>
            <DialogContent>
                <MaterialTable
                title={"Danh sách học sinh - " + props.session_name}
                data={students}
                options={{
                    paging: false,
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
                isLoading={isLoading}
                onRowClick={(event, rowData) => {  }}
                actions={[
                    {
                        icon: () => (
                            <form enctype="multipart/form-data; charset=utf-8">
                               <input
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv"
                                    onChange={onUploadChange}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    hidden
                                />
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span">
                                        Upload
                                    </Button>
                                </label>
                            </form>
                        ),
                        tooltip: 'Upload điểm',
                        isFreeAction: true,
                        text: 'Upload điểm',
                        // onClick: () => {fileUploadButton()},
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
                columns={columns}

                />
                {/* <OutTable data={rows} columns={cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" /> */}
                </DialogContent>    
            <DialogActions>
                
            </DialogActions>
        </Dialog>
    )

}
export default DialogStudent