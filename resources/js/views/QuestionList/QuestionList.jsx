import React, {useState, useEffect} from 'react';
import './QuestionList.scss'
// import {QuestionDialog} from './components';
import MaterialTable from "material-table";
import axios from 'axios'

const QuestionList = (props) => {
    const columns = [];
    const [data, setData] = useState('')
    return(
        <div className="root-question">
            <MaterialTable
                title = "Danh sách câu hỏi"
                columns = {columns}
                data = {this.state.data}
                options = {{
                    grouping: true,
                    pageSize: 10,
                }}
                editable={{
                    onRowAdd: newData => this.addNewQuestionList(newData) ,
                    onRowUpdate: (newData, oldData) => this.editQuestionList(oldData, newData),
                    onRowDelete: oldData => this.deleteQuestionList(oldData),
                }}
                actions = {[
                    {
                        icon: () => <AddBoxIcon />,
                        tooltip: 'Thêm ',
                        isFreeAction: false,
                        text: 'Thêm sự kiện',
                        onClick: (event, rowData) => {
                            this.handleOpenDialogQuestion(rowData)
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
            {/* <QuestionDialog
                handleCloseQuestion = {this.handleCloseQuestion}
                open_permission = {this.state.open_permission}
                selected_permission = {this.state.selected_permission}
                selected_id = {this.state.selected_role.id}
                permissions = {this.state.permissions}
                onQuestionChange = { this.onQuestionChange }
                handleSubmitQuestion = {this.handleSubmitQuestion}
            /> */}
        </div>
    )
}

export default QuestionList
