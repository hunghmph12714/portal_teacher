import React, {useState, useEffect} from 'react';
import './DialogCreate.scss';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from "react-select";

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';

import NumberFormat from 'react-number-format';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { withSnackbar } from 'notistack' 
const baseUrl = window.Laravel.baseUrl

function NumberFormatCustom(props) {
    const { inputRef, onChange, name, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              name: name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  }
  
const MinSalarySelect = React.memo(props => {
    const [data, setData] = useState([])
    const fetchdata = async() => {
        const r = await axios.get(window.Laravel.baseUrl + "/get-base-salary")
        let data = r.data.map(c => {
            var formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            return {
                value: c.id, label: c.domain+" "+c.level+" "+ c.grade+" - "+ formatter.format(c.salary)
            }

        })
        setData(data)
    }
    useEffect(() => {        
        fetchdata()
    }, [])    
    return(        
        <div className = "select-input">
            <Select className = "select-box"                
                key = "session-select"
                isMulti
                value = {props.min_salary}
                name = "min-salary"
                placeholder="Chọn bậc lương tối thiểu"
                options={data}
                onChange={props.handleChange}
            />                 
        </div>
    )
})

class DialogCreate extends React.Component {
    constructor(props){
        super(props)      
        this.state = {
            id: "",
            name:  "",
            email:  '',
            phone:  '',
            school: '',
            domain:  '',
            //Thuế
            tncn: '',
            insurance: '',
            //Loại hợp đồng
            hdType: '',
            hdTypes: [
                {
                    value: 'Cơ hữu',
                    label: 'Cơ hữu',
                },
                {
                    value: 'Hợp tác',
                    label: 'Hợp tác',
                },
            ],
            //Lương
            salary_percent: 0,
            salary_per_hour: 0,
            min_salary: [],
            
        }  
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        
        const contract = {value: nextProps.teacher.contract, label : nextProps.teacher.contract}
        var formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        console.log(nextProps.teacher['min_salary'])
        let min_salary = []
        if(nextProps.teacher.min_salary){
            min_salary = nextProps.teacher['min_salary'].map(c => {            
                return {
                    value: c.id, label: c.domain+" "+c.level+" "+ c.grade+" - "+ formatter.format(c.salary)
                }
            })
        }
        this.setState({
            id : nextProps.teacher.id,
            name: nextProps.teacher.name,
            email: nextProps.teacher.email,
            phone: nextProps.teacher.phone,
            school: nextProps.teacher.school,
            domain: nextProps.teacher.domain,

            tncn: nextProps.teacher.personal_tax,
            insurance: nextProps.teacher.insurance,
            salary_percent: nextProps.teacher.percent_salary,
            salary_per_hour: nextProps.teacher.salary_per_hour,
            min_salary : min_salary,
            hdType : contract,
        })
    }
    
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    handleMinSalaryChange = (min_salary)=> {
        this.setState({ min_salary: min_salary })
    }
    
    handleCreateNewTeacher = () => {
        let url = baseUrl + "/teacher/create"
        let data =  this.state;
        axios.post(url, data)
            .then(response => {
                this.props.updateTable(response.data);
                this.props.enqueueSnackbar('Tạo giáo viên thành công', {
                    variant: 'success'
                })
                this.props.handleCloseDialog();
            })
            .catch(err => {
                console.log('teacher create bug: ' + err)
            })
    }
    handleEditTeacher = () => {
        let url = baseUrl + "/teacher/edit"
        axios.post(url, this.state)
            .then(response => {
                this.props.updateTable(response.data)
                this.props.enqueueSnackbar('Đã lưu thay đổi', {
                    variant: 'success'
                })
                this.props.handleCloseDialog();
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', {
                    variant: 'error'
                })
            })
    }
    render(){
        return (
            <div>
                {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Open form dialog
                </Button> */}
                <Dialog 
                    fullWidth={true}
                    maxWidth='lg'
                    open={this.props.open} onClose={this.props.handleCloseDialog} aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{
                        this.props.dialogType == "create" ? (<h4>Thêm giáo viên</h4>):(<h4>Sửa giáo viên</h4>)
                    }</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Vui lòng điền đầy đủ thông tin giáo viên
                        </DialogContentText>
                        <form noValidate autoComplete="on">
                            <Grid
                                container
                                spacing={4}
                            >
                                <Grid
                                    item
                                    md={12}
                                    lg={6}
                                >
                                    <h5>Thông tin giáo viên</h5>                                       
                                    <TextField  label="Họ tên" 
                                        id="name"
                                        required
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        helperText="Họ tên giáo viên"
                                        margin = "dense"
                                        value = {this.state.name}
                                        name = 'name'
                                        onChange = {this.onChange}
                                    />           
                                    <TextField  label="Email" 
                                        variant="outlined"
                                        size="small"
                                        type="email"
                                        fullWidth
                                        helperText="Email của giáo viên"
                                        margin = "dense"
                                        name = 'email'
                                        value = {this.state.email}
                                        onChange = {this.onChange}
                                    />    
                                    <TextField  label="Số điện thoại" 
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        type = "number"
                                        helperText="Số điện thoại của giáo viên"
                                        margin = "dense"
                                        name = 'phone'
                                        value = {this.state.phone}
                                        onChange = {this.onChange}
                                    />  
                                    <TextField  label="Nơi công tác" 
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        helperText="Trường học giáo viên đang giảng dạy"
                                        margin = "dense"
                                        name = 'school'
                                        value = {this.state.school}
                                        onChange = {this.onChange}
                                    />  
                                    <TextField  label="Bộ môn" 
                                        variant="outlined"
                                        required
                                        size="small"
                                        fullWidth
                                        helperText=""
                                        margin = "dense"
                                        name = 'domain'
                                        value = {this.state.domain}
                                        onChange = {this.onChange}
                                    />  
                                                              
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    lg={6}
                                >
                                    <h5>Chi tiết hợp đồng</h5> 
                                    <TextField
                                        fullWidth
                                        id="outlined-select-currency-native"
                                        select
                                        label="Loại hợp đồng"
                                        value={this.state.hdType}
                                        onChange={this.onChange}
                                        SelectProps={{
                                            native: true,
                                        }}
                                        variant="outlined"
                                        margin = "dense"
                                        name = "hdType"
                                    >
                                    {this.state.hdTypes.map(option => (
                                        <option key={option.value} value={option.value}>
                                        {option.label}
                                        </option>
                                    ))}                                    
                                    </TextField> 

                                    <Divider variant="middle" className="divider" />
                                    <h5>Chế độ lương</h5> 
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="outlined-adornment-amount">Tỷ lệ lương</InputLabel>
                                        <OutlinedInput
                                            type= 'number'
                                            inputProps={{ min: "0", max: "100" }}
                                            
                                            value={this.state.salary_percent}
                                            name = "salary_percent"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                            labelWidth={75}
                                            
                                        />
                                    <FormHelperText >Tỷ lệ lương giáo viên / ca học</FormHelperText>
                                    </FormControl> 

                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="outlined-adornment-amount">Lương theo giờ</InputLabel>
                                        <OutlinedInput
                                            
                                            value={this.state.salary_per_hour}
                                            name = "salary_per_hour"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                            labelWidth={100}
                                            inputComponent = {NumberFormatCustom}
                                        >
                                            
                                        </OutlinedInput>
                                        <FormHelperText >Lương giáo viên / 1 giờ dạy</FormHelperText>
                                    </FormControl>        
                                    <FormControl variant="outlined" className="min_salary" fullWidth  margin="dense">
                                        <MinSalarySelect 
                                            min_salary = {this.state.min_salary}
                                            handleChange = {this.handleMinSalaryChange}
                                        />
                                        <FormHelperText >Lương cơ bản theo lớp/trình độ</FormHelperText>

                                    </FormControl>

                                    <Divider variant="middle" className="divider" />
                                    <h5>Áp dụng thuế</h5> 
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="outlined-adornment-amount">Thuế thu nhập cá nhân</InputLabel>
                                        <OutlinedInput
                                            type= 'number'
                                            inputProps={{ min: "0", max: "100" }}                                            
                                            value={this.state.tncn}
                                            name = "tncn"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                            labelWidth={150}
                                            helperText=""
                                        />
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="outlined-adornment-amount">Bảo hiểm</InputLabel>
                                        <OutlinedInput
                                            value={this.state.insurance}
                                            name = "insurance"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                            labelWidth={70}
                                            inputComponent = {NumberFormatCustom}                                           
                                        />
                                        <FormHelperText>Bảo hiểm trên 1 tháng</FormHelperText>

                                    </FormControl>
                                </Grid>
                            </Grid>
                        </form>
                        </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleCloseDialog} color="primary">
                            Hủy bỏ
                        </Button>
                        {
                            (this.props.dialogType == 'create') ? (
                                <Button onClick={this.handleCreateNewTeacher} color="primary" id="btn-save">
                                    Tạo mới giáo viên
                                </Button>
                            ) : (
                                <Button onClick={this.handleEditTeacher} color="primary" id="btn-save">
                                    Lưu thay đổi
                                </Button>
                            )
                        }
                        
                    </DialogActions>
                </Dialog>
                </div>
          );
    }
}
export default withSnackbar(DialogCreate)