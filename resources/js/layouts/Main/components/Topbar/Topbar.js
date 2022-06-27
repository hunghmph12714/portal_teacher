import React, { useState } from 'react';
import './Topbar.scss'
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Dialog } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import BugReportIcon from '@material-ui/icons/BugReport';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import axios from 'axios';
import auth from '../../../../auth'
import { StudentSearch } from '../../../../components'
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  help: {
    position: 'fixed',
    bottom: '0px',
    right: '0px',
    
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Topbar = props => {
  const { history } = props;

  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();
  const [student_name, setStudentName] = useState('');
  const [year, setYear] = useState('2020');
  const [open, setOpen] = useState(false)
  React.useEffect(() => {
    axios.get('/user/get-year')
      .then(response => {
        setYear(response.data)
      })
      .catch(err => {

      })
  }, [])
  function handleClose(){
    setOpen(false)
  }
  function openFeedbackDialog(){
    setOpen(true)
  }
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
            <MenuItem value={'2022'}>Năm học 2022-2023</MenuItem>
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
          <IconButton
            className={classes.help}
            color="primary"
            onClick = {openFeedbackDialog}
          >
            <BugReportIcon style={{fontSize: '3.5rem'}}/>
          </IconButton>
          <FeedbackDialog
            open={open}
            handleClose={handleClose}
            classes={classes}
          />
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
const FeedbackDialog = (props) => {
  return (
    <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
        <AppBar className={props.classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={props.classes.title}>
              Góp ý và Báo cáo lỗi
            </Typography>
          </Toolbar>
        </AppBar>
        <iframe src="https://center.vietelite.edu.vn/feedback/gui-phan-hoi" height={800}></iframe> 
      </Dialog>
  )
}
Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
