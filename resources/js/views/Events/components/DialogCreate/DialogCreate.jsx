import React from 'react';
import './DialogCreate.scss';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Divider from '@material-ui/core/Divider';
import {
    KeyboardTimePicker,
    KeyboardDatePicker,
    MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import  DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";

import {format, subDays } from 'date-fns';

import NumberFormat from 'react-number-format';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';
const baseUrl = window.Laravel.baseUrl
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
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
  

const initState = {
    name: "",
    code: "",
    open_date: new Date(),
    note:"",    
    class_id: null,
} 
class DialogCreate extends React.Component {
    constructor(props){
        super(props)      
        this.state = initState 
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.dialogType=='edit'){
            
            this.setState({
                class_id: nextProps.class.id,
                name: (nextProps.class.name)?nextProps.class.name:'',
                code: (nextProps.class.code)?nextProps.class.code:'',
                open_date: nextProps.class.open_date ? new Date(nextProps.class.open_date) : null,
                note: nextProps.class.note,
            })
        }
        if(nextProps.dialogType=='create'){
            this.setState(initState)  
        }
        
    }
    
    onChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    };
    
    handleDateChange = date => {
        this.setState({ open_date: date });
      };
    handleCreateNewClass = () => {
        let url = baseUrl + "/event/create"
        if(!this.state.code || !this.state.name || !this.state.open_date){
            this.props.enqueueSnackbar('Vui lòng điền đầy đủ các trường *', { 
                variant: 'error',
            });
            return 0;
        }
        axios.post(url, this.state)
            .then(response => {
                this.props.updateTable(response.data)
                this.props.enqueueSnackbar('Thêm sự kiện thành công', { 
                    variant: 'success',
                });
                this.props.handleCloseDialog();
            })
            .catch(err => {
                this.props.enqueueSnackbar('Thêm sự kiện thành công', { 
                    variant: 'success',
                });
                console.log("Create class bug: "+ err)
            })
    }
    handleEditClass = () => {
        let url = baseUrl + "/event/edit"
        if(!this.state.code || !this.state.name || !this.state.open_date){
            this.props.enqueueSnackbar('Vui lòng điền đầy đủ các trường *', { 
                variant: 'error',
            });
            return 0;
        }
        axios.post(url, this.state)
            .then(response => {
                this.props.updateTable(response.data)
                this.props.enqueueSnackbar('Sửa thành công', { 
                    variant: 'success',
                });
                this.props.handleCloseDialog();
            })
            .catch(err => {
                this.props.enqueueSnackbar('Có lỗi xảy ra', { 
                    variant: 'error',
                });
                console.log("Create class bug: "+ err)
            })
    }    
    render(){
        
        return (
            <div>
                {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Open form dialog
                </Button> */}
                <Dialog 
                    className="dialog-class-create"
                    fullWidth 
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth='lg'
                    scroll='paper'
                    open={this.props.open} onClose={this.props.handleCloseDialog} aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{
                        this.props.dialogType == "create" ? (<h4>Thêm sự kiện</h4>):(<h4>Sửa thông tin sự kiện</h4>)
                    }</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Vui lòng điền đầy đủ thông tin cần thiết (*)
                        </DialogContentText>
                        <form noValidate autoComplete="on">
                        <h5>Thông tin sự kiện</h5>   
                            <Grid
                                container
                                spacing={4}
                            >
                                <Grid
                                    item
                                    md={12}
                                    lg={6}
                                >
                                    {/* <FormControl variant="outlined" size="small" fullWidth>                                        
                                        <Autocomplete
                                            options={this.state.centers}
                                            getOptionLabel={(option) => option.label}
                                            value={this.state.center_selected}
                                            onChange={(event, newValue) => {
                                                this.handleCenterChange(newValue)
                                            }}
                                            renderInput={(params) => 
                                                <TextField {...params} 
                                                    label="Cơ sở" 
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            }
                                        />
                                        <FormHelperText >Cơ sở học tập</FormHelperText>
                                    </FormControl>                          */}
                                    <TextField  label="Tên sự kiện " 
                                        id="name"
                                        required
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        helperText="Tên sự kiện eg: Toán chuyên 9.1"
                                        margin = "dense"
                                        value = {this.state.name}
                                        name = 'name'
                                        onChange = {this.onChange}
                                    />
                                    {/* <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="outlined-adornment-amount">Học phí/ca</InputLabel>
                                        <OutlinedInput
                                            value={this.state.fee}
                                            name = "fee"
                                            onChange={this.onChange}
                                            startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                                            labelWidth={70}
                                            inputComponent = {NumberFormatCustom}
                                        >
                                        </OutlinedInput>
                                    </FormControl> */}
                                    <div className="date-time">
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                                            <KeyboardDatePicker
                                                autoOk
                                                required
                                                className="input-date"
                                                variant="inline"
                                                inputVariant="outlined"
                                                format="dd/MM/yyyy"
                                                placeholder= "Hạn đăng ký *"
                                                views={["year", "month", "date"]}
                                                value={this.state.open_date}
                                                onChange={this.handleDateChange}
                                            />                     
                                            </MuiPickersUtilsProvider>
                                        
                                    </div>  
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    lg={6}
                                >
                                    {/* <FormControl variant="outlined" size="small" fullWidth >
                                        <Autocomplete
                                            options={this.state.courses}
                                            getOptionLabel={(option) => option.label}
                                            value={this.state.course_selected}
                                            onChange={(event, newValue) => {
                                                this.handleCourseChange(newValue)
                                            }}
                                            renderInput={(params) => 
                                                <TextField {...params} 
                                                    label="Khoá học" 
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            }
                                        />
                                        <FormHelperText >Cơ sở học tập</FormHelperText>
                                    </FormControl>      */}
                                    
                                    <TextField  label="Mã sự kiện" 
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        required
                                        fullWidth
                                        helperText="Mã sự kiện: eg:TC9.1"
                                        margin = "dense"
                                        name = 'code'
                                        value = {this.state.code}
                                        onChange = {this.onChange}
                                    />  
                                    
                                    <TextField  label="Ghi chú" 
                                        variant="outlined"
                                        size="medium"
                                        type="text"
                                        
                                        fullWidth
                                        helperText="Ghi chú của sự kiện"
                                        margin = "dense"
                                        name = 'note'
                                        value = {this.state.note}
                                        onChange = {this.onChange}
                                    />
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
                                <Button onClick={this.handleCreateNewClass} color="primary" id="btn-save">
                                    Tạo mới sự kiện
                                </Button>
                            ) : (
                                <Button onClick={this.handleEditClass} color="primary" id="btn-save">
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