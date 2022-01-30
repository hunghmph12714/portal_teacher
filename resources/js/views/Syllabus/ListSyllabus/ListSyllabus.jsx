import React, {useState, useEffect} from 'react';
import axios from 'axios'
import './ListSyllabus.scss'
import {Grid} from '@material-ui/core'
import MaterialTable from 'material-table'
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
const col = [
    {
        title: "Khoá học",
        field: "title",
    },
    {
        title: "Khối",
        field: "grade",
    },     
    {
        title: "Bộ môn",
        field: "subject",
    },     
    {
        title: "Người tạo",
        field: "name",
    },     
    {
        title: "Ngày tạo",
        field: "created_at",
    },     
]
const ListSyllabus = (props) => {
    const [data, setData] = useState([])
    useEffect(() =>{
        axios.post('/syllabus/list')
            .then(response => {
                setData(response.data)
            })
    }, [])
    return (
        <div className="root-class">
            <MaterialTable
                    title="Danh sách khoá học"
                    data={data}
                    options={{
                        pageSize: 20,
                        grouping: true,
                        filtering: true,
                        exportButton: true,
                        rowStyle: {
                        padding: '0px',
                        },
                        filterCellStyle: {
                        paddingLeft: '0px'
                        }
                    }}
                    onRowClick={(event, rowData) => this.handleClassDetail(event, rowData)}
                    actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm khoá học',
                            isFreeAction: true,
                            text: 'Thêm khoá học',
                            onClick: (event) => {
                                props.history.push('/khoa-hoc/tao-moi')
                            },
                        },
                        {
                        icon: () => <EditOutlinedIcon />,
                        tooltip: 'Chỉnh sửa',
                        text: 'Chỉnh sửa',
                        onClick: (event, rowData) => {
                            props.history.push('/khoa-hoc/'+ rowData.id)
                        }
                    },

                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy lớp học'
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
                columns={col}
            />
        </div>
    )
}

export default ListSyllabus