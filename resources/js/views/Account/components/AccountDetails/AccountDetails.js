import React, { useState } from 'react';
import './AccountDetails.scss';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  TextField
} from '@material-ui/core';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import Icofont from "react-icofont";
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";

class AccountDetails extends React.Component{
  constructor(props){
    super(props)
    const user = (localStorage.getItem('user') !== null) ? JSON.parse(localStorage.getItem('user')) : {}
    this.state = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      dob: new Date(user.dob),
      gender: user.gender,
      address: user.address,
    }
    
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };
  handleDateChange = date => {
    this.setState({ dob: date });
  };
  handleChangeRadio = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };
  handleSaveProfile = () => {
    let url = window.Laravel.baseUrl + "/user/update-profile";
    let data = this.state;
    axios.post(url, data)
      .then(response => {
        localStorage.setItem('user', JSON.stringify(response.data))
        this.props.successNotification('Đã lưu hồ sơ')
      })
      .catch(err => {
        this.props.errorNotification(err)
      })
  }
  render() {
      return(
        <div>
          <Card
            className="root"
          >
            <form
              autoComplete="off"
              noValidate
            >
              <CardHeader
                subheader="Những thông tin sau có thể chỉnh sửa"
                title="Hồ sơ cá nhân"
              />
              <Divider />
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Họ của bạn"
                      margin="dense"
                      name="last_name"
                      onChange={this.onChange}
                      required
                      value={this.state.last_name}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Tên của bạn"
                      margin="dense"
                      name="first_name"
                      onChange={this.onChange}
                      required
                      value={this.state.first_name}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Email"
                      margin="dense"
                      name="email"
                      onChange={this.onChange}
                      required
                      value={this.state.email}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      margin="dense"
                      name="phone"
                      onChange={this.onChange}
                      type="number"
                      value={this.state.phone}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                   <div className="date-time">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        autoOk
                        className="input-date"
                        variant="inline"
                        inputVariant="outlined"
                        format="dd/MM/yyyy"
                        placeholder="Ngày sinh"
                        views={["year", "month", "date"]}
                        value={this.state.dob}
                        onChange={this.handleDateChange}

                      />                     
                    </MuiPickersUtilsProvider>
                  </div>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <div className="form-gender">
                      <RadioGroup
                        aria-label="gender"
                        className="gender-group"
                        name="gender"
                        value={this.state.gender}
                        onChange={this.handleChangeRadio("gender")}
                      >
                        <FormControlLabel
                          value="Nam"
                          control={<Radio />}
                          label="Nam"
                          className="radio"
                        />
                        <FormControlLabel
                          value="Nữ"
                          control={<Radio />}
                          label="Nữ"
                          className="radio"
                        />                      
                      </RadioGroup>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  onClick = {() => this.handleSaveProfile()}
                >
                  Lưu thay đổi
                </Button>
              </CardActions>
            </form>
          </Card>
  
        </div>
      )
  }
  
}

export default AccountDetails;
