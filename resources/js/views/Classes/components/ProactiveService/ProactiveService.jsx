import React, {useState, useEffect} from 'react';
import './ProactiveService.scss';
import Select , { components }  from "react-select";
import axios from 'axios';
import {
    Grid,
    Button,
    ImageList,
    ImageListItem,
    TextField,
    

} from '@material-ui/core'
import MaterialTable from "material-table";
import {useSnackbar} from 'notistack'
const ProactiveService = (props) => {
    const {enqueueSnackbar} = useSnackbar()
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(false)
    const col = [
        {
            title: "Học sinh",
            field: "student",
            headerStyle: {
                fontWeight: '600',
            },
            
        },
        {
            title: "Thời gian",
            field: "time",
            headerStyle: {
                fontWeight: '600',
            },
        },
        {
            title: "Người chăm sóc",
            field: "user",
            headerStyle: {
                fontWeight: '600',
            },
        },
    ]
    const [students, setStudents] = useState([])
    const [selected_student, setSelectedStudent] = useState({value: null,})
    const [method, setMethod] = useState([
        {value: 'Điện thoại' , label: 'Điện thoại'},
        {value: 'Email' , label: 'Email'},
        {value: 'Tin nhắn SMS' , label: 'Tin nhắn SMS'},
        {value: 'Zalo' , label: 'Zalo'},
        {value: 'Trực tiếp' , label: 'Trực tiếp'},
    ])
    const [selected_method, setSelectedMethod] = useState(null)
    const [criteria, setCriteria] = useState([])
    // const []
    function handleMethodChange(value){
        setSelectedMethod(value)
    }
    function handleStudentChange(newValue){
        setSelectedStudent(newValue)
    }
    function onCriteriaChange(e, item){
        console.log(item)
        let i = criteria.map(c => {
            if(c.id == item){
                return {...c, value: e.target.value}
            }else return c
        })
        setCriteria(i)
    }
    function submitService(){
        let data = {
            student_id: selected_student.value,
            class_id: props.class_id,
            method: selected_method.value,
            cares: criteria,
        }
        if(!selected_method || !selected_student.value){
            enqueueSnackbar('Vui lòng chọn phương thức', {variant: 'warning'})
        }
        axios.post('/proactive-service', data)
            .then(response => {
                enqueueSnackbar('Lưu thành công', {variant: 'success'})
                setRefresh(!refresh)
            })
            .catch(err => {

            })
    }
    useEffect(() => {
        axios.post('/student/get', {class_id: props.class_id})
        .then(response => {
            let options = response.data.map(r => {
                if(r.detail.status == 'active'){
                    return {label: r.fullname, value: r.id
                    }
                }
            })
            console.log(options)
            setStudents(options)
        })
        .catch(err => {
            console.log(err)
        })
        axios.post('/service-criteria/get',{})
            .then(response => {
                // console.log(response)
                let c = response.data.map((d) => {
                    return {...d, value:''}
                })
                setCriteria(c)
            })
            .catch(err => {

            })
        setRefresh(!refresh)
    }, [])
    useEffect(() => {
        axios.post('/proactive-service/list', {class_id: props.class_id})
            .then(response => {
                console.log(response.data)
                let i = response.data.map(r => {
                    return {
                        student: r.student.name,
                        time: r.time.created_at,
                        user: r.user.name,
                        care_services: r.care_services,
                    }
                })
                setData(i)
            })
            .catch(err => {

            })
    },[refresh])
    return (
        <div className="root-service">
            <Grid container spacing={2}>
                <Grid item md={4}>
                    <div className = "select-input">
                        <h5>Lựa chọn học sinh</h5>
                        <Select className = "select-box"                
                            value = {selected_student}
                            name = "selected_session"
                            placeholder="Chọn học sinh"
                            options={students}
                            onChange={handleStudentChange}
                        />                 
                    </div>
                </Grid>
                <Grid item md={4}>
                    <h5>Thông tin đào tạo</h5>
                    <span>Ngày nhập học: </span> {selected_student.entrance_date}<br></br>
                    <span>Mục tiêu: </span> {selected_student.aspiration}<br></br>
                </Grid>
                <Grid item md={4}>
                    <h5>Thông tin phụ huynh</h5>
                    <span>Họ tên: </span> {selected_student.p_name}<br></br>
                    <span>Số điện thoại: </span> {selected_student.p_phone}<br></br>
                    <span>Email: </span> {selected_student.p_email}<br></br>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item md={4}>
                    <h5>Phương thức chăm sóc</h5>
                    <Select className = "select-box"                
                        value = {selected_method}
                        placeholder="Chọn phương thức"
                        options={method}
                        onChange={handleMethodChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <h5>Tiêu chí chăm sóc</h5>
                    <ImageList rowHeight={150} cols={3}>
                        {criteria.map((item) => (
                            <ImageListItem key={item.id}>
                                <p style={{marginBottom: '0.2rem', height: '50px'}}>{item.name}</p>
                                <TextField id="outlined-basic" variant="outlined" fullWidth size='small' 
                                    onChange={(event) => onCriteriaChange(event, item.id)}
                                    value={item.value}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <Button
                        color='primary'
                        onClick={submitService}
                        className='btn'
                    >Lưu phiên chăm sóc
                    </Button>
                </Grid>
            </Grid>
            {/* LIST */}
            <MaterialTable
                isLoading ={isLoading}
                title="Danh sách chăm sóc"
                data={data}
                options={{
                    pageSize: 20,
                    grouping: true,
                    filtering: true,
                    exportButton: false,
                    rowStyle: {
                    padding: '0px',
                    },
                    filterCellStyle: {
                    paddingLeft: '0px'
                    }
                }}
                    //   onRowClick={(event, rowData) => this.handleClassDetail(event, rowData)}
                // actions={[   
                //     {
                //         icon: () => <GetAppIcon />,
                //         tooltip: 'Xuất danh sách chăm sóc',
                //         isFreeAction: true,
                //         text: 'Xuất danh sách chăm sóc',
                //         onClick: (event) => {
                //             this.handleExportClasses()
                //         },
                //      },
                // ]}
            localization={{
                body: {
                    emptyDataSourceMessage: 'Không tìm thấy chăm sóc'
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
            detailPanel={rowData => {
              // console.log(configs)
             
              return (
                <ImageList rowHeight={130} cols={3} gaps={2}>
                    {rowData.care_services.map((item) => (
                        <ImageListItem key={item.id} className="detail">
                            <b style={{marginBottom: '0.2rem'}}>{item.service_name}:</b>
                            <p>{item.content}</p>
                        </ImageListItem>
                    ))}
                </ImageList>
              )
                
            }}
                     
                />
        </div>
        
    )
}
export default ProactiveService;