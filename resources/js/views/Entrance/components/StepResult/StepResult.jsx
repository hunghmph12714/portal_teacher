import React from 'react'
import './StepResult.scss'
import MaterialTable from "material-table";
import AddBoxIcon from '@material-ui/icons/AddBox';
const StepResult = (props) => {
    return(
        <MaterialTable
            title="Danh sách ghi danh"
            data={[]}
            options={{
                pageSize: 10,
                pageSizeOptions: [20, 50, 200],
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
            columns={[]}
            
            />
    )
}
export default StepResult
