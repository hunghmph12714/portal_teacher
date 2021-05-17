import React, { useState } from 'react';
import './Topbar.scss'
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import axios from 'axios';
import auth from '../../../../auth'
import { StudentSearch } from '../../../../components'
const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { history } = props;

  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();
  const [student_name, setStudentName] = useState('');
  const [year, setYear] = useState('2020');
  
  React.useEffect(() => {
    axios.get('/user/get-year')
      .then(response => {
        setYear(response.data)
      })
      .catch(err => {

      })
  })
  const handleStudentChange = (value) => {
    if(value){
      window.open('/student/'+value.sid)
    }
  }
  const [notifications] = useState([]);

  const handleChange = (value) => {
    axios.post('/user/change-year', {year: value.target.value})
      .then(response => {
        location.href = "/"
      })
      .catch(err => {

      })
  }
  const signOut = () => {
    axios.post(window.Laravel.baseUrl + "/logout")
      .then(response => {
        auth.logout()
        // const res = response.data
        location.href = "/"

      })
      .catch(err => {console.log('sign out bug: ' + err)})
  }
  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img 
            width="150"
            alt="Logo"
            src="/images/logos/logo--white.png"
          />
        </RouterLink>
        <FormControl variant="outlined" className="year-select" size="small">
          <InputLabel id="demo-simple-select-outlined-label">Năm học</InputLabel>
          <Select
            value={year}
            onChange={handleChange}
            name="year"
            label="Năm học"
          >
            <MenuItem value={'2020'}>Năm học 2020-2021</MenuItem>
            <MenuItem value={'2021'}>Năm học 2021-2022</MenuItem>
          </Select>
        </FormControl>
        <div className={classes.flexGrow} />
        {/* <Hidden mdDown> */}
          <span className="search-bar">
            <StudentSearch
              student_name={student_name}
              handleStudentChange={handleStudentChange}
              className='search-bar'
            />
          </span>
          
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick = {signOut}
          >
            <InputIcon />
          </IconButton>
        {/* </Hidden> */}
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
