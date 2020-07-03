import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

import { AccountProfile, AccountDetails } from './components';
import { Password } from '../Settings/components';

class Account extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
  }
  successNotification = (successMessage) => {
    store.addNotification({
      title: 'Thành công',
      message: successMessage,
      type: 'success',                         // 'default', 'success', 'info', 'warning'
      container: 'bottom-right',                // where to position the notifications
      animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
      animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
      width: 300,
      dismiss: {
        duration: 3000
      }
    })
  }
  errorNotification = (errorMessage) => {
    store.addNotification({
      title: 'Có lỗi',
      message: errorMessage,
      type: 'danger',                         // 'default', 'success', 'info', 'warning'
      container: 'bottom-right',                // where to position the notifications
      animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
      animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
      width: 300,
      dismiss: {
        duration: 3000
      }
    })
  }
  render() {
    return (
      <div className="root" style={{padding: 29}}>
        <Grid
          container
          spacing={4}
        >
          <ReactNotification />
          <Grid
            item
            lg={4}
            md={6}
            xl={4}
            xs={12}
          >
            <AccountProfile successNotification={this.successNotification} errorNotification={this.errorNotification}/>
            <Password/>
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xl={8}
            xs={12}
          >
            <AccountDetails  successNotification={this.successNotification} errorNotification={this.errorNotification}/>
            
          </Grid>
        </Grid>
      </div>
    );
  }
}


export default Account;
