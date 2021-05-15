import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter,Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/styles';
import ability from '../../config/ability'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import auth from '../../auth';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: {
      message: "Email chưa hợp lệ :D"
    },
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
};
const quotes = [
  ['"Anyone who has never made a mistake has never tried anything new."', 'Albert Einstein'],
  ['"He who opens a school door, closes a prison."', 'Victor Hugo'],
  ['"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."', 'Malcolm X'],
  ['"The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one."', 'Mark Twain'],
  ['"Education is what remains after one has forgotten what one has learned in school"', 'Albert Einstein'],
  ['"Education is what remains after one has forgotten what one has learned in school"', 'Albert Einstein'],
  ['"Education is what remains after one has forgotten what one has learned in school"', 'Albert Einstein'],
  ['"Education is what remains after one has forgotten what one has learned in school"', 'Albert Einstein'],
]
const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min) ) + min;
}
const rndQuote = getRndInteger(0, quotes.length)
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  year: {
    marginTop: theme.spacing(2)
  }
}));

const SignIn = props => {
  
  
  const { history } = props;

  const classes = useStyles(
    
  );

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

 
  const handleChange = event => {
    event.persist();
    
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = event => {
    event.preventDefault();
    let url = window.Laravel.baseUrl + "/login"
    const data = {
      email: formState.values.email,
      password: formState.values.password,
      year: (!formState.values.year) ? '2020' : formState.values.year
    }
    axios.post(url, data)
      .then(response => {
          axios.get(window.Laravel.baseUrl + "/check-auth")
            .then(response => {
              auth.login()
              localStorage.setItem('user', JSON.stringify(response.data.user))
              props.enqueueSnackbar('Đăng nhập thành công!', { 
                  variant: 'success',
              });
              //Cập nhật rule của ability
              ability.update(response.data.rules)
              setTimeout(history.push('/'), 1000)
            })
            .catch(err => {
              console.log('error check auth: '+ err.data)
            })
          // const res = response.data
          
      })
      .catch(err => {
        console.log(err.response.data)
        setFormState(formState => ({
          ...formState,
          isValid: false,
          errors: {'password': err.response.data},
        }));
      })
    
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  if(auth.isAuthenticated()){
    return  <Redirect to='/' />;
  }
  return (
    
    <div className={classes.root}>      
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                {quotes[rndQuote][0]} 
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  {quotes[rndQuote][1]} 
                </Typography>                
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignIn}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Đăng nhập
                </Typography>
                
                
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Địa chỉ email"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password : null
                  }
                  label="Mật khẩu"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                />
                <FormControl variant="outlined" fullWidth className={classes.year}>
                  <InputLabel id="demo-simple-select-outlined-label">Năm học</InputLabel>
                  <Select
                    value={formState.values.year  || '2020'}
                    onChange={handleChange}
                    name="year"
                    label="Năm học"
                  >
                    <MenuItem value={2020}>Năm học 2020-2021</MenuItem>
                    <MenuItem value={2021}>Năm học 2021-2022</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  className={classes.signInButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Đăng nhập ngay
                </Button>
                
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(withSnackbar(SignIn));
