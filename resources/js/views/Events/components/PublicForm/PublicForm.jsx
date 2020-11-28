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
Typography ,
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
          <TextField  label="Họ tên học sinh"  
              
              className = "input-text"
              variant="outlined"
              size="small"
              type="email"
              fullWidth
              margin = "dense"
              name = 'student_name'
              value = {props.student_name}
              onChange = {props.onChange}
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
                      inputVariant="outlined"
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
        <Grid item md={4} sm={12}>
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
        <Grid item md={4} sm={12}>
          <TextField  label="Số điện thoại liên hệ" 
              className = "input-text"
              pattern="\d*"
              variant="outlined"
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
        <Grid item md={4} sm={12}>
          <TextField  label="Email" 
                className = "input-text"
                variant="outlined"
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
            <FormLabel>Học sinh đang học tại trung tâm VietElite ?</FormLabel>
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

            total_fee: 0,
            discount_fee: 0,
            final_fee: 0,

            activeStep: 0,
            steps: this.getSteps()
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
    onChange = (event) => {
      this.setState({ [event.target.name]: event.target.value })
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
      this.setState({ activated: e.target.value })
      if(e.target.value=="1" && this.state.phone != '' && this.state.student_name){
        var numb = this.state.phone.match(/\d/g);
        numb = numb.join("");
        axios.post('/check-phone', {phone: numb, student_name: this.state.student_name})
          .then(response => {
            this.setState({ classes: response.data.map(r => {return {label: r.code, value: r.id}}) })
            let classes = response.data.map(r => r.code).toString()
            const key = this.props.enqueueSnackbar('Chào mừng phụ huynh em ' +  +', các lớp đang theo học tại VietElite: '+ classes, {
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
        events = events.map(event => {
          if(event.id == evt.id){
            return {...event, active: true }
          }else return { ...event, active: false}
        })
        
        return {...prevState, events, selected_event: evt.id}
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
          return {...d, active: false, time_formated: time_formated, className: '', classes: JSON.parse(d.classes)}
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
        return {...prevState, locations}
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
      this.setState(prevState => {
        var total_fee = prevState.total_fee
        var discount_fee  = prevState.discount_fee 
        var products = [...prevState.products]
        var tmp_products = [...prevState.products]
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
                  if(p.classes[v].value == this.state.classes[u].value){
                    discount_fee -= p.fee/100*p.percentage
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
                  if(p.classes[v].value == this.state.classes[u].value){
                    discount_fee += p.fee/100*p.percentage
                    break loop1;
                  }
                }
              }
            }
          }
        }
        return {...prevState, products, total_fee, discount_fee}
      })
    } 
    getSteps() {
      return ['Select master blaster campaign settings', 'Create an ad group', 'Create an ad'];
    }
    
    getStepContent(stepIndex) {
      switch (stepIndex) {
        case 0:
          return (<InfoForm
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

          />);
        case 1:
          return 'What is an ad group anyways?';
        case 2:
          return 'This is the bit I really care about!';
        default:
          return 'Unknown stepIndex';
      }
    }
    handleNext = () => {
      this.setState( {activeStep: this.state.activeStep + 1 })
    };
  
    handleBack = () => {
      this.setState( {activeStep: this.state.activeStep - 1 })
    };
  
    handleReset = () => {
      this.setState( {activeStep: 0 })
    };
    render(){
        document.title =  'FORM ĐĂNG KÝ'
        return (
          
          <div className="root-class-detail">
            <div>
            <Stepper activeStep={this.state.activeStep} alternativeLabel>
              {this.state.steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
              <div>
                {this.state.activeStep === this.state.steps.length ? (
                  <div>
                    <Typography >All steps completed</Typography>
                    <Button onClick={this.handleReset}>Reset</Button>
                  </div>
                ) : (
                  <div>
                    <Typography >{this.getStepContent(this.state.activeStep)}</Typography>
                    <div>
                      <Button
                        disabled={this.state.activeStep === 0}
                        onClick={this.handleBack}                     
                      >
                        Back
                      </Button>
                      <Button variant="contained" color="primary" onClick={this.handleNext}>
                        {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Grid container spacing={2}>
              <Grid item md={6} sm={12}>
                <FormControl component="fieldset" size="small">
                  <FormLabel>Khối thi(*)</FormLabel>
                  <span>
                  {this.state.events.map( (evt , index)=> {
                      return(
                        <Button 
                          className="btn-vee"
                          // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                          variant="outlined" 
                          name={evt.id} 
                          onClick={() => this.onEventChange(evt)}
                          style={(!this.state.events[index].active) ? {fontWeight: 'bold', color: 'black',}:{fontWeight: 'bold', color: 'white', background: 'green'}}
                        >
                          {evt.note}
                        </Button>
                      )
                  })}
                </span>
                </FormControl>
                  <br/>
                
              </Grid>
              <Grid item md={6} sm={12}>
                <FormControl component="fieldset" size="small">
                  <FormLabel>Địa điểm thi(*)</FormLabel>
                  {this.state.locations.map( (loc , index)=> {
                      return(
                        <Button 
                          // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                          className="btn-vee"
                          variant="outlined" 
                          onClick={() => this.onLocationChange(loc)}
                          style={(!this.state.locations[index].active) ? {fontWeight: 'bold', color: 'black', marginRight: '10px',align: 'left'}:
                          
                          {fontWeight: 'bold', color: 'white', background: 'green', marginRight: '10px', align: 'left'}}
                        >
                          {loc.label}
                        </Button>
                      )
                  })}
                </FormControl>
              </Grid>
              
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12}>
                <FormControl component="fieldset" size="small">
                  <FormLabel>Chọn môn thi</FormLabel>
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
                  <br/>
                
              </Grid>
              <Grid item md={6} sm={12}>
                {this.state.total_fee} <br/>
                {this.state.discount_fee} <br/>
              </Grid>
              
            </Grid>
          </div>
        )
    }
}
export default withSnackbar(PublicForm)