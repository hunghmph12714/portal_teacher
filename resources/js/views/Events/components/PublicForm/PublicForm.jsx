import React from 'react'
import './PublicForm.scss'
import axios from 'axios'
import {
  Grid, 
  TextField,
  Input,
  InputLabel,FormControl,
  RadioGroup, Radio,
  FormControlLabel,
  FormLabel,
  Button,
  Stepper ,
  Step ,
  StepLabel ,
  Dialog,
  DialogActions ,
  DialogContent ,
  DialogContentText,
  DialogTitle ,
  CircularProgress,
  Typography , Checkbox
} from "@material-ui/core";
import { format, isAfter } from 'date-fns'
import AsyncSelectCreatable from 'react-select/async-creatable';

import MaskedInput from 'react-text-mask'
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import vi from "date-fns/locale/vi";
import { throttle } from "lodash";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import {withSnackbar} from 'notistack'
const baseUrl = window.Laravel.baseUrl
var date = new Date();
var formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div>
            {children}
          </div>
        )}
      </div>
    );
  }
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
const InfoForm = (props) => {
  const promptTextCreator = (value) => {
      return 'Lựa chọn '+value
  }
  const findSchools = (inputValue) => {
    return axios.get('/school/find/' + inputValue)
        .then(response => {
            return  response.data.map(school => { return {label: school.name, value: school.id} })
        })
        .catch(err => {
            console.log('get schools bug' + err.response.data)
        })
  }
  const loadOptions = (type, inputValue) => {            
    if(type == 'school'){
        return findSchools(inputValue)
    }
  }; 

  const debouncedLoadOptions = throttle(loadOptions, 1000)
  return(
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <TextField  label="Họ tên học sinh(*)"  
              fullWidth
              className = "input-text"
              variant="filled"
              size="small"
              type="email"
              margin = "dense"
              name = 'student_name'
              value = {props.student_name}
              onChange = {props.onStudentNameChange}
          />   
        </Grid>
        <Grid item md={4} xs={12}>
          <div className="date-time">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi}>
                  <KeyboardDatePicker
                      autoOk
                      fullWidth
                      className="input-date"
                      variant="inline"
                      inputVariant="filled"
                      format="dd/MM/yyyy"
                      placeholder="Ngày sinh"
                      views={["year", "month", "date"]}
                      label="Ngày sinh"
                      value={props.dob}
                      onChange={props.handleChangeDob}
                  />                     
              </MuiPickersUtilsProvider>     
          </div>
        </Grid>
        <Grid item md={4} sm={12} >
          <AsyncSelectCreatable 
              cacheOptions
              autosize={true}
              loadOptions={inputValue => debouncedLoadOptions('school',inputValue)}
              placeholder={'Trường học'}
              onChange={props.handleChangeSchool}
              name="school"
              label="Trường học"
              value={props.school}
              className="school-select"
              formatCreateLabel={promptTextCreator}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={4} sm={12} className="full-grid">
          <TextField  label="Số điện thoại liên hệ(*)" 
              className = "input-text"
              pattern="\d*"
              variant="filled"
              size="small"
              type="text"
              fullWidth
              margin = "dense"
              name = 'phone'
              helperText="Số điện thoại đã đăng ký tại trung tâm (nếu có)"
              value = {props.phone}
              onChange = {props.onPhoneChange}
          />
        </Grid>
        <Grid item md={4} sm={12} className="full-grid">
          <TextField  label="Email(*)" 
                className = "input-text"
                variant="filled"
                size="small"
                type="text"
                fullWidth
                margin = "dense"
                name = 'email'
                value = {props.email}
                onChange = {props.onChange}
            />
        </Grid>
        <Grid item md={4} sm={12}>
          <FormControl component="fieldset" size="small" className="check-center">
            <FormLabel style={{color: 'white'}}>Học sinh đang học tại trung tâm VietElite ?</FormLabel>
            <RadioGroup row aria-label="position" name="position" defaultValue="top" value={props.activated} 
              onChange={props.onActiveChange}>
              <FormControlLabel value={"1"} control={<Radio color="primary" />} label="Có" />
              <FormControlLabel value={"0"} control={<Radio color="primary" />} label="Không" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
class PublicForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            student_name: '',
            dob: new Date(),
            school: '',
            phone:'',
            email:'',
            activated: "0",

            events: [],
            selected_event: null,
            products: [],
            locations: [],
            selected_location: null,
            classes: [],
            student_id: null,
            loading: false,

            total_fee: 0,
            discount_fee: 0,
            final_fee: 0,
            checkedB: false,
        }
    }
    componentDidMount = () => {
      this.getEvent();
      this.getLocation();
    }
    getEvent = () => {
      axios.get('/event-get-public')
        .then(response => {
          this.setState({events: response.data.map( e => {return {...e, active: false}})})
        })
        .catch(err => {

        })
    }
    
    getLocation = () => {
      axios.get('/event-get-location')
        .then(response => {
          this.setState({locations: response.data.map( (loc, index) => {
            if(index == 0){
              this.setState({selected_location: loc.id})
              return {...loc, active: true}
            }else return {...loc, active:false}
          })})
        })
        .catch(err => {

        })
    }
    handleChange = (event, newValue) => {
        this.setState({value: newValue})
    };
    onStudentNameChange = (event) => {
      let val = event.target.value
      this.setState(prevState => {
        let products = [...prevState.products]
        products = products.map(p => {
          return {...p, active: false, discount_fee: 0, className: '' }
        })
        return {...prevState, student_name: val, student_id: null, classes: [], products, total_fee:0, discount_fee: 0, activated: null}
      })
    } 
    onChange = (event) => {
      this.setState({ [event.target.name]: event.target.value })
    }
    handleTos = () => {
      this.setState({ checkedB: !this.state.checkedB })
    }
    formatPhoneNumber = (phoneNumberString) => {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      }
      return null
    }
    onPhoneChange = (e) => {
      this.setState({ phone: e.target.value })
      if(this.formatPhoneNumber(e.target.value)){
        this.setState({ phone:this.formatPhoneNumber(e.target.value) })
      }
    }
    handleChangeDob = (date) => {this.setState({ dob: date })}
    handleChangeSchool = (value) => {this.setState({ school: value })}
    
    onActiveChange = (e) => {
      if(this.state.phone == '' && this.state.student_name == ''){
        this.props.enqueueSnackbar('Vui lòng điền số điện thoại và họ tên học sinh', {
          variant: 'warning',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
        return;
      }
      this.setState({ activated: e.target.value })      
      this.setState(prevState => {
        let products = [...prevState.products]
        products = products.map(p => {
          return {...p, active: false, discount_fee: 0, className: '' }
        })
        return {...prevState, products, total_fee:0, discount_fee: 0}
      })
      if(e.target.value=="1" && this.state.phone != '' && this.state.student_name){
        var numb = this.state.phone.match(/\d/g);
        numb = numb.join("");
        
        axios.post('/check-phone', {phone: numb, student_name: this.state.student_name})
          .then(response => {
            let student_id = response.data[0].pivot.student_id            
            this.setState({ classes: response.data.map(r => {return {label: r.code, value: r.id, applied: false}}), student_id: student_id })
            let classes = response.data.map(r => r.code).toString()
            const key = this.props.enqueueSnackbar('Chào mừng, Các lớp đang theo học tại VietElite: '+ classes, {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              autoHideDuration: 6000,
            })
          })
          .catch(err => {
            this.props.enqueueSnackbar(err.response.data, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              } ,
              variant: 'warning'
            })
          })
      }
    }
    onEventChange = (evt) => {
      this.setState({selected_event: evt.id})
      this.getProducts(evt.id, this.state.selected_location)
      this.setState(prevState => {
        var events = [...prevState.events]
        var classes = [...prevState.classes]
        classes = classes.map(c => {
          return {...c, applied: false}
        })
        events = events.map(event => {
          if(event.id == evt.id){
            return {...event, active: true }
          }else return { ...event, active: false}
        })
        
        return {...prevState, events, selected_event: evt.id , total_fee: 0, discount_fee: 0, classes}
      }) 
    }
    getProducts = (evt, loc) => {
      if(evt == this.state.selected_event && loc == this.state.selected_location){
        return ;
      }
      axios.post('/event-get-product', {event_id: evt, location_id: loc})
      .then(response => {
        this.setState({products: response.data.map(d => {
          let time_formated = format(new Date(d.from), 'dd/MM');
          let from = format(new Date(d.from), 'HH:mm');
          let to = format(new Date(d.to), 'HH:mm');
          time_formated = time_formated + "(" + from + " - "+to+")"
          return {...d, active: false, time_formated: time_formated, className: '', classes: JSON.parse(d.classes), discount_fee: 0}
        })})
      })
      .catch(err => {

      })
    }
    onLocationChange = (loc) => {
      this.setState({selected_location: loc.id})
      this.getProducts(this.state.selected_event, loc.id)
      this.setState(prevState => {
        var locations = [...prevState.locations]
        locations = locations.map(l => {
          if(l.id == loc.id){
            return {...l, active: true }
          }else return { ...l, active: false}
        })

        return {...prevState, locations, total_fee: 0, discount_fee: 0}
      })
    }
    isDuplicated = (a, b) => {
      let a_to = new Date(a.to)
      let b_to = new Date(b.to)
      let a_from = new Date(a.from)
      let b_from = new Date(b.from)
      if(isAfter(a_from, b_from)){
        if(isAfter(a_from, b_to)){
          return false
        }else return true
      }else{
        if(isAfter(b_from, a_to)){
          return false
        }else return true
      }
      
    }
    onProductChange = (product) => {
      if(!this.state.activated){
        this.props.enqueueSnackbar('Vui lòng lựa chọn "Học sinh có đang theo học tại trung tâm VietElite?" để được giảm lệ phí!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          } ,
          variant: 'warning'
        })
        return ;
      }
      if(this.state.phone == "" || this.state.student_name == ""){
        this.props.enqueueSnackbar('Vui lòng điền thông tin học sinh.', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          } ,
          variant: 'warning'
        })
        return ;
      }
      this.setState(prevState => {
        var total_fee = prevState.total_fee
        var discount_fee  = prevState.discount_fee 
        var products = [...prevState.products]
        var tmp_products = [...prevState.products]
        var tmp_classes = [...prevState.classes]
        for( let i = 0; i < tmp_products.length; i++){
          let p = products[i]
          if(p.id == product.id && p.className == 'btn-disabled'){
            this.props.enqueueSnackbar('Môn thi trùng thời gian!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              } ,
              variant: 'warning'
            })
            continue
          }
          if(p.id == product.id){

            if(p.active){
              for(let j = 0 ; j < products.length; j++){
                if( products[j].className == "btn-disabled" && this.isDuplicated(products[j], p)){
                  products[j].className = ''
                }                
              }
              products[i].className = ''
              products[i].active = false
              //Trừ lệ phí thi
              total_fee -= p.fee
              loop1:
                for( let u = 0 ; u < this.state.classes.length; u++){
                loop2:
                  for( let v = 0 ; v < p.classes.length; v++){
                  if(p.classes[v].value == this.state.classes[u].value && this.state.classes[u].applied){                    
                    if(this.state.classes[u].applied == p.id){
                      discount_fee -= p.fee/100*p.percentage
                      tmp_classes[u].applied = false;
                    }                    
                    break loop1;
                  }
                }
              }
            } 
            else{
              for(let j = 0 ; j < products.length; j++){
                if(this.isDuplicated(products[j], p)){
                  products[j].className = 'btn-disabled'
                  products[j].active = false
                }                
              }
              products[i].className = 'btn-active'
              products[i].active = true
              //Cộng lệ phí thi
              total_fee += p.fee
              loop1:
                for( let u = 0 ; u < this.state.classes.length; u++){
                loop2:
                  for( let v = 0 ; v < p.classes.length; v++){
                  if(p.classes[v].value == this.state.classes[u].value  && !this.state.classes[u].applied){
                    discount_fee += p.fee/100*p.percentage
                    tmp_classes[u].applied = p.id;
                    break loop1;
                  }
                }
              }
            }
          }
        }
        return {...prevState, products, total_fee, discount_fee, classes: tmp_classes}
      })
    } 
    submitForm = (e) => {
      this.setState({
        loading: true,
      })
      let activeProduct = this.state.products.filter(p => p.active == true);
      
      if(activeProduct.length == 0){
        this.props.enqueueSnackbar('Vui lòng chọn môn thi', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
        this.setState({
          loading: false,
        })
        return 1;
      }
      if(this.state.student_name == "" || this.state.phone == "" ||this.state.email == "" || !this.state.selected_event){
        this.props.enqueueSnackbar('Vui lòng điền đầy đủ thông tin (*)', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
        this.setState({
          loading: false,
        })
      }else
      if(!this.state.checkedB){
        this.props.enqueueSnackbar('Vui lòng đồng ý với quy định của kỳ thi', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        })
        this.setState({
          loading: false,
        })
        return 1;
      }else
      {
        var numb = this.state.phone.match(/\d/g);
        numb = numb.join("");
        axios.post('/event/dang-ky', {...this.state, phone: numb})
          .then(response => {
            this.setState({ loading: false })
            this.props.enqueueSnackbar('Đăng ký thành công. Vui lòng kiểm tra hòm thư', {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
            })
          })
          .catch(err => {
            this.setState({ loading: false })
            this.props.enqueueSnackbar(err.response.data, {
              variant: 'err',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
            })
          })
      }

    }
    render(){
        document.title =  'FORM ĐĂNG KÝ'
        return (
          
          <div className="root-event-detail">
            <InfoForm
              student_name = {this.state.student_name}
              dob = {this.state.dob}
              school = {this.state.school}
              phone = {this.state.phone}
              email = {this.state.email}
              activated = {this.state.activated}
              handleChangeSchool = {this.handleChangeSchool}
              handleChangeDob = {this.handleChangeDob}
              onChange = {this.onChange}
              onPhoneChange = {this.onPhoneChange}
              onActiveChange = {this.onActiveChange}
              onStudentNameChange = {this.onStudentNameChange}
            />
            <Grid container spacing={2}>
              <Grid item md={7} sm={12}>
                <FormControl component="fieldset" size="small">
                  <FormLabel className="label-white">Khối thi(*)</FormLabel>
                  <span>
                  {this.state.events.map( (evt , index)=> {
                      return(
                        <Button
                          className="btn-vee"
                          // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                          variant="outlined" 
                          name={evt.id} 
                          onClick={() => this.onEventChange(evt)}
                          style={(!this.state.events[index].active) ? {fontWeight: 'bold', color: 'black',}:{fontWeight: 'bold', color: 'white', background: '#8bc34a'}}
                        >
                          {evt.note}
                        </Button>
                      )
                  })}
                </span>
                </FormControl>
                  <br/>
                
              </Grid>
              <Grid item md={5} sm={12}>
                <FormControl component="fieldset" size="small" fullWidth>
                  <FormLabel className="label-white">Địa điểm thi(*)</FormLabel>
                  {this.state.locations.map( (loc , index)=> {
                      return(
                        <Button 
                          // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                          className="btn-vee"
                          variant="outlined" 
                          onClick={() => this.onLocationChange(loc)}
                          style={(!this.state.locations[index].active) ? {fontWeight: 'bold', color: 'black', marginRight: '10px',align: 'left'}:
                          {fontWeight: 'bold', color: 'white', background: '#8bc34a', marginRight: '10px', align: 'left'}}
                        >
                          {loc.label}
                        </Button>
                      )
                  })}
                </FormControl>
              </Grid>
              
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={7} sm={12} className="mon-thi">
                <FormControl component="fieldset" size="small" fullWidth>
                  <FormLabel className="label-white">Chọn môn thi</FormLabel>
                  <span>
                  {this.state.products.map( (evt , index)=> {
                      return(
                        <div 
                          className={`btn-vee btn-product ${ this.state.products[index].className }`}
                          // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                          variant="outlined"  
                          onClick={() => this.onProductChange(evt)}
                        >
                          <Typography variant="p" display="block">
                            {evt.content}
                          </Typography> 
                          <Typography variant="caption" display="block">
                            {evt.time_formated}
                          </Typography>
                        </div>                        
                      )
                  })}
                </span>
                </FormControl>                
              </Grid>
              <Grid item md={5} sm={12}>
                {(this.state.total_fee != 0)? 
                  <React.Fragment>
                    <Grid container spacing={2}> 
                      <Grid item md={6} sm={12}>
                        <FormControl component="fieldset" size="small" fullWidth>
                          <Button 
                            className="btn-vee btn-fee"
                            variant="outlined" 
                            style={{fontWeight: 'bold', color: 'black', marginRight: '10px',align: 'left'}}
                          >
                            Lệ phí: <span className="fee"> {formatter.format(this.state.total_fee)}</span>
                            </Button>
                        </FormControl>            
                      </Grid>
                      <Grid item md={6} sm={1212}>
                        <FormControl component="fieldset" size="small" fullWidth>
                          <Button 
                            // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                            className="btn-vee btn-fee"
                            variant="outlined" 
                            style={ {fontWeight: 'bold', color: 'black', marginRight: '10px',align: 'left'}}
                          >
                            Ưu đãi: <span className="fee">{formatter.format(this.state.discount_fee)}</span>
                          </Button>
                        </FormControl>            
                      </Grid>
                    </Grid>
                    <FormControl component="fieldset" size="small" fullWidth>
                        <Button 
                          // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                          className="btn-vee btn-fee"
                          variant="outlined" 
                          style={{fontWeight: 'bold', color: 'black', marginRight: '10px',align: 'left'}}
                        >
                         Tổng lệ phí:  <span className="fee">{formatter.format(this.state.total_fee - this.state.discount_fee)}</span>
                        </Button>
                  </FormControl>
                </React.Fragment>
                : ""}
              </Grid>
              
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}
                style={{
                    textAlign:'center' // this does the magic
                }}
            >
              <span className="tos">
                <FormControlLabel
                  className="tos-checkbox"
                  control={
                    <Checkbox
                      checked={this.state.checkedB}
                      onChange={this.handleTos}
                      name="checkedB"
                      color="secondary"
                    />
                  }
                />
              <span onClick={this.handleTos}>Tôi đã đọc và đồng ý với <a target="_blank" rel="noopener noreferrer" href='https://thithu.info/quy-dinh-thi-thu'>quy định</a> của kỳ thi </span>
              </span>
              <Button 
                // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                color='primary'
                className="btn-submit"
                onClick = {e => this.submitForm(e)}
                style={ {fontWeight: 'bold', color: 'black'}}
                disabled = {this.state.loading}
              >
                ĐĂNG KÝ NGAY
                {this.state.loading ? (
                  <CircularProgress />
                ): ""}
               
              </Button>
            </Grid>
          </div>
        )
    }
}
export default withSnackbar(PublicForm)