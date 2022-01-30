import React, { Fragment } from 'react';
import './TableView.scss'
import {
    Menu,
    MenuItem,
    IconButton,
} from "@material-ui/core";
import MaterialTable from "material-table";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import Icofont from "react-icofont";

import axios from 'axios'

const baseUrl = window.Laravel.baseUrl;

class TableView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            anchorElOptionTeacher: null,
        }

    }
    getTeacher = () => {
        axios.get(window.Laravel.baseUrl + "/get-teacher")
            .then(response => {
                this.setState({
                    data: response.data
                })
            })
            .catch(err => {
                console.log('center bug: ' + err)
            })
    }

    componentDidMount() {
        this.getTeacher()
    }

    handleClickOptionTeacher = event => {
        this.setState({ anchorElOptionTeacher: event.currentTarget });
    };

    handleCloseOptionTeacher = () => {
        this.setState({ anchorElOptionTeacher: null });
    };
    render() {
        document.title = 'Giáo viên'
        return (
            <Fragment>

                <MaterialTable
                    title="Danh sách giáo viên"
                    data={this.props.data}
                    options={{
                        selection: true,
                        pageSize: 10,
                        grouping: true,
                        rowStyle: {
                            padding: '0px',
                        }
                    }}
                    onRowClick={(event, rowData) => { if (rowData.links > 0 && rowData.clicks > 0) this.props.history.push(`/teacher/${rowData.id}`) }}
                    actions={[
                        {
                            icon: () => <PersonAddIcon />,
                            tooltip: 'Thêm giáo viên',
                            isFreeAction: true,
                            text: 'Thêm giáo viên',
                            onClick: (event) => {
                                this.props.handleOpenDialog()
                            },
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy giáo viên'
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
                    columns={[
                        {
                            title: "Tên giáo viên",
                            field: "name",
                            headerStyle: {
                                padding: '0px',
                                fontWeight: '600',
                            },
                            cellStyle: {
                                padding: '0px',
                            },
                        },
                        {
                            title: "Bộ môn",
                            field: "domain",
                            headerStyle: {
                                padding: '0px',
                                fontWeight: '600',
                            },
                            cellStyle: {
                                padding: '0px',
                            },
                        },
                        {
                            title: "Email",
                            field: "email",
                            headerStyle: {
                                padding: '0px',
                                fontWeight: '600',
                            },
                            cellStyle: {
                                padding: '0px',
                            },
                        },

                        {
                            title: "Số điện thoại",
                            field: "phone",
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
                                padding: '0px',
                            },
                        },
                        {
                            title: "",
                            field: "action",
                            disableClick: true,
                            sorting: false,
                            headerStyle: {
                                padding: '0px',
                                fontWeight: '600',
                                width: '20px',
                            },
                            cellStyle: {
                                width: '20px',
                                padding: '0px',
                            },
                            render: rowData => (
                                <div>

                                    <IconButton
                                        aria-controls="optionCampain-menu"
                                        aria-haspopup="true"
                                        onClick={this.handleClickOptionTeacher}
                                    >
                                        <MoreHorizIcon className="icon-more__in-table-Campaign" />
                                    </IconButton>
                                    <Menu
                                        id="optionCampain-menu"
                                        anchorEl={this.state.anchorElOptionTeacher}
                                        keepMounted
                                        open={Boolean(this.state.anchorElOptionTeacher)}
                                        onClose={this.handleCloseOptionTeacher}
                                    >

                                        <MenuItem onClick={this.props.handleOpenEditDialog(rowData)}>
                                            <Icofont icon="icofont-ui-edit" />Sửa chi tiết
                                        </MenuItem>
                                        <MenuItem onClick={this.handleCloseOptionTeacher}>
                                            <Icofont icon="icofont-not-allowed" />Xem chi tiết
                                        </MenuItem>
                                        <MenuItem onClick={this.handleClickOpenAddPerson}>
                                            <PersonAddIcon /> Khởi tạo tài khoản
                                        </MenuItem>
                                        <MenuItem onClick={this.handleCloseOptionTeacher}>
                                            <DeleteIcon />Tạm dừng hợp đồng
                                        </MenuItem>
                                    </Menu>
                                </div>
                            )
                        }
                    ]}

                />

            </Fragment>
        );
    }
}

export default TableView