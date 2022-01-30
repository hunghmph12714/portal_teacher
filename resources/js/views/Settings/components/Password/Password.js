import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
  root: {}
}));
const baseUrl = window.Laravel.baseUrl
const Password = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [values, setValues] = useState({
    password: '',
    confirm: '',
    current_password: '',
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  function updatePassword() {
    axios.post(baseUrl+ '/user/password', values)
      .then(response => {
        enqueueSnackbar('Cập nhật mật khẩu thành công', {variant: 'success'})
      })
      .catch(err => {
        console.log(err.response)
        if(err.response.status == 422){
          enqueueSnackbar('Mật khẩu xác nhận không khớp', {variant: 'error'})
        }
        if(err.response.status == 400){
          enqueueSnackbar('Mật khẩu cũ không chính xác', {variant: 'error'})
        }
        
      })
  }
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      style={{ marginTop: '1rem' }}
    >
      <form>
        <CardHeader
          subheader="Cập nhật mật khẩu"
          title="Mật khẩu"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Mật khẩu hiện tại"
            name="current_password"
            onChange={handleChange}
            type="password"
            value={values.current_password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Mật khẩu mới"
            name="password"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            name="confirm"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={values.confirm}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={updatePassword}
          >
            Thay đổi mật khẩu
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
