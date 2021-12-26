import React, {useState, useEffect} from 'react';
import './QuestionList.scss'
// import {QuestionDialog} from './components';
import MaterialTable from "material-table";
import axios from 'axios'
import Chip from '@material-ui/core/Chip';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {PreviewQuestion} from '../Question/SingleQuestion'
import EditIcon from '@material-ui/icons/Edit';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
const QuestionList = (props) => {
    const columns = [
        { title: 'Đề bài', field: 'content' ,
        render: rowData => {
            return <div>{ReactHtmlParser(rowData.content)}</div>
        },
        width: 500,
        },
        { title: 'Môn', field: 'domain' },
        { title: 'Khối', field: 'grade' },
        { title: 'Dạng bài', field: 'question_type',
            lookup: { 'mc':'TN', 'fib':'ĐVCT', 'essay':'TL'},
        },
        { title: 'Độ khó', field: 'question_level',
            // lookup: { 'mc':'TN', 'fib':'ĐVCT', 'essay':'TL'},
        },
        { title: 'Chủ đề', field: 'topics', 
            render: rowData => {
                return (<span>
                    {rowData.topics.map(topic => {
                        return (<Chip style={{margin: '3px'}} color="secondary" size="small" label={topic.title} clickable/>)
                    })}
                </span>)
            }
        },
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
    const [question, setQuestion] = useState({
        content: '',
        options: [],

    })
    useEffect(
        () => {
            fetchQuestion();
        },[])
    function handleOpenPreview(rowData){
        setPreviewOpen(true)
        setQuestion(rowData)
    }
    function handleClosePreview(){
        setPreviewOpen(false)
    }
    function fetchQuestion(){
        axios.post('/questions', {})
            .then(response => {
                setData(response.data);
            })
            .catch(err => {

            })
    }
    return(
        <div className="root-question">
            <MaterialTable
                title = "Danh sách câu hỏi"
                columns = {columns}
                data = {data}
                options = {{
                    grouping: true,
                    pageSize: 10,
                }}
                // editable={{
                //     onRowAdd: newData => addNewQuestionList(newData) ,
                //     onRowUpdate: (newData, oldData) => editQuestionList(oldData, newData),
                //     onRowDelete: oldData => deleteQuestionList(oldData),
                // }}
                actions = {[
                    {
                        icon: () => <ZoomInIcon />,
                        tooltip: 'Xem trước ',
                        isFreeAction: false,
                        text: 'Xem trước',
                        onClick: (event, rowData) => {
                            handleOpenPreview(rowData)
                        },
                    },
                    {
                        icon: () => <EditIcon />,
                        tooltip: 'Sửa ',
                        isFreeAction: false,
                        text: 'Sửa câu hỏi',
                        onClick: (event, rowData) => {
                            handleOpenPreview(rowData)
                        },
                    },
                    {
                        icon: () => <AddBoxIcon />,
                        tooltip: 'Thêm câu hỏi ',
                        isFreeAction: true,
                        text: 'Thêm câu hỏi',
                        onClick: (event, rowData) => {
                            props.history.push('/cau-hoi/tao-moi')
                        },
                    },
                ]}
                localization={{
                    header: {
                        actions: ''
                    },
                    body: {
                        emptyDataSourceMessage: 'Không tìm thấy Phân câu hỏi',
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
           <PreviewQuestion
                open={preview_open}
                handleCloseDialog={handleClosePreview}
                question={question}
           />
        </div>
    )
}

export default QuestionList
