import React from 'react';
import './DialogCreate.scss';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';

import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix="$"
      />
    );
  }
  
NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};
export default class DialogCreate extends React.Component {
    constructor(props){
        super(props)      
        this.state = {
            name:  "",
            email:  '',
            phone:  '',
            school: '',
            domain:  '',
            tncn: 0,
            hdType: '',
            salary_percent: 0,
            salary_per_hour: 0,
            salary_min : 0,
            hdTypes: [
                {
                    value: 'Cơ hữu',
                    label: 'Cơ hữu',
                },
                {
                    value: 'Hợp tác',
                    label: 'Hợp tác',
                },
            ]
        }  
    }
    
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };
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
                    <DialogTitle id="form-dialog-title"><h4>Thêm giáo viên</h4></DialogTitle>
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
                                    <TextField id="standard-basic" label="Họ tên" 
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
                                    <TextField id="standard-basic" label="Email" 
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
                                    <TextField id="standard-basic" label="Số điện thoại" 
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
                                    <TextField id="standard-basic" label="Nơi công tác" 
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        helperText="Trường học giáo viên đang giảng dạy"
                                        margin = "dense"
                                        name = 'school'
                                        value = {this.state.school}
                                        onChange = {this.onChange}
                                    />  
                                    <TextField id="standard-basic" label="Bộ môn" 
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
                                            max = '100'
                                            id="outlined-adornment-amount"
                                            value={this.state.salary_percent}
                                            name = "salary_percent"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                            labelWidth={75}
                                            
                                        />
                                        <FormHelperText id="standard-weight-helper-text">Tỷ lệ lương giáo viên / ca học</FormHelperText>
                                    </FormControl> 

                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="outlined-adornment-amount">Lương theo giờ</InputLabel>
                                        <OutlinedInput
                                            type= 'number'
                                            id="outlined-adornment-amount"
                                            value={this.state.salary_per_hour}
                                            name = "salary_per_hour"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                            labelWidth={100}
                                            inputComponent = {NumberFormatCustom}
                                        >
                                            
                                        </OutlinedInput>
                                        <FormHelperText id="standard-weight-helper-text">Lương giáo viên / 1 giờ dạy</FormHelperText>
                                    </FormControl>        
                                    
                                    <Divider variant="middle" className="divider" />
                                    <h5>Áp dụng thuế</h5> 
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="outlined-adornment-amount">Thuế thu nhập cá nhân</InputLabel>
                                        <OutlinedInput
                                            type= 'number'
                                            max = '100'
                                            id="outlined-adornment-amount"
                                            value={this.state.tncn}
                                            name = "tncn"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                            labelWidth={150}
                                            helperText=""
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </form>
                        </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleCloseDialog} color="primary">
                            Hủy bỏ
                        </Button>
                        <Button onClick={this.props.handleCloseDialog} color="primary" id="btn-save">
                            Lưu thay đổi
                        </Button>
                    </DialogActions>
                </Dialog>
                </div>
          );
    }

  
}