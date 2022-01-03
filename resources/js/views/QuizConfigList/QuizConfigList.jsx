import React, {useState, useEffect} from 'react';
import './QuizConfigList.scss'
import MaterialTable from "material-table";
import axios from 'axios'
import Chip from '@material-ui/core/Chip';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
const QuizConfigList = (props) => {
    const columns = [
        { title: 'Tiêu đề', field: 'title'
        },
        { title: 'Miêu tả', field: 'description'
        },
        { title: 'Khối', field: 'grade' },        
        { title: 'Mục tiêu', field: 'objectives', 
            render: rowData => {
                return (<span>
                    {rowData.objectives.map(obj => {
                        return (<Chip style={{margin: '3px'}} color="secondary" size="small" label={obj.content} clickable/>)
                    })}
                </span>)
            }
        },
                

    ];
    const [data, setData] = useState([])
    const [preview_open, setPreviewOpen] = useState(false)
    const [quiz_config, setQuizConfig] = useState({
        content: '',
        options: [],

    })
    useEffect(
        () => {
            fetchQuizConfig();
        },[])
    function handleOpenPreview(rowData){
        setPreviewOpen(true)
        setQuizConfig(rowData)
    }
    function handleClosePreview(){
        setPreviewOpen(false)
    }
    function fetchQuizConfig(){
        axios.get('/quiz-config/get')
            .then(response => {
                setData(response.data);
            })
            .catch(err => {

            })
    }
    function handleEditQuizConfig(rowData){
        props.history.push('/quiz-config/'+rowData.id)
    }
    return(
        <div className="root-quiz-config">
            <MaterialTable
                title = "Danh sách cấu hình câu hỏi"
                columns = {columns}
                data = {data}
                options = {{
                    grouping: true,
                    pageSize: 10,
                }}
                // editable={{
                //     onRowAdd: newData => addNewQuizConfigList(newData) ,
                //     onRowUpdate: (newData, oldData) => editQuizConfigList(oldData, newData),
                //     onRowDelete: oldData => deleteQuizConfigList(oldData),
                // }}
                actions = {[
                    
                    {
                        icon: () => <EditIcon />,
                        tooltip: 'Sửa ',
                        isFreeAction: false,
                        text: 'Sửa cấu hình câu hỏi',
                        onClick: (event, rowData) => {
                            handleEditQuizConfig(rowData)
                        },
                    },
                    {
                        icon: () => <AddBoxIcon />,
                        tooltip: 'Thêm cấu hình câu hỏi ',
                        isFreeAction: true,
                        text: 'Thêm cấu hình câu hỏi',
                        onClick: (event, rowData) => {
                            props.history.push('/quiz-config')
                        },
                    },
                ]}
                localization={{
                    header: {
                        actions: ''
                    },
                    body: {
                        emptyDataSourceMessage: 'Không tìm thấy Phân cấu hình câu hỏi',
                        editRow:{
                        deleteText: 'Bạn có chắc muốn xóa dòng này ?',
                        cancelTooltip: 'Đóng',
                        saveTooltip: 'Lưu'
                        },
                        deleteTooltip: "Xóa",
                        addTooltip: "Thêm mới"
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
                    }
                }}
            />
           
        </div>
    )
}

export default QuizConfigList
