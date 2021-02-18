import React from 'react'
import './StepAppointment.scss'
import MaterialTable from "material-table";
import AddBoxIcon from '@material-ui/icons/AddBox';
const StepAppointment = (props) => {
    return(
        <React.Fragment> 
            <div className= "entrance_table"> 
                <MaterialTable
                    title="Danh sách ghi danh trong 24h"
                    data={[]}
                    options={{
                        pageSize: 5,
                        pageSizeOptions: [5, 20, 50, 200],
                        grouping: true,
                        filtering: true,
                        exportButton: true,                
                    }}
                    onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                    actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm mới ghi danh',
                            isFreeAction: true,
                            text: 'Thêm ghi danh',
                            onClick: (event) => {
                                this.props.history.push('/entrance/create')
                            },
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy ghi danh'
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
                    columns={[

                    ]}
                    
                />
            </div>
        
            <div className= "entrance_table"> 
                <MaterialTable
                    title="Danh sách ghi danh quá 24h"
                    data={[]}
                    options={{
                        pageSize: 5,
                        pageSizeOptions: [5, 20, 50, 200],
                        grouping: true,
                        filtering: true,
                        exportButton: true,                
                    }}
                    onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                    actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm mới ghi danh',
                            isFreeAction: true,
                            text: 'Thêm ghi danh',
                            onClick: (event) => {
                                this.props.history.push('/entrance/create')
                            },
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy ghi danh'
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
                    columns={[

                    ]}
                    
                />
            </div>
        
            <div className= "entrance_table"> 
                <MaterialTable
                    title="Danh sách cần tư vấn"
                    data={[]}
                    options={{
                        pageSize: 5,
                        pageSizeOptions: [5, 20, 50, 200],
                        grouping: true,
                        filtering: true,
                        exportButton: true,                
                    }}
                    onRowClick={(event, rowData) => { console.log(rowData.tableData.id) }}
                    actions={[                       
                        {
                            icon: () => <AddBoxIcon />,
                            tooltip: 'Thêm mới ghi danh',
                            isFreeAction: true,
                            text: 'Thêm ghi danh',
                            onClick: (event) => {
                                this.props.history.push('/entrance/create')
                            },
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Không tìm thấy ghi danh'
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
                    columns={[

                    ]}
                    
                />
            </div>
        

        </React.Fragment>
        
    )
}
export default StepAppointment
