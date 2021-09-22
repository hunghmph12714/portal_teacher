import React from 'react';
import "./AccountProfile.scss";

import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Popover,
  LinearProgress
} from '@material-ui/core';

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from 'axios';

const cropper = React.createRef(null);

class AccountProfile extends React.Component {
  constructor(props){
    super(props)
    const user = (localStorage.getItem('user') !== null) ? JSON.parse(localStorage.getItem('user')) : {}
    this.state = {
      name: user.first_name + " "+user.last_name,
      phone: user.phone,
      avatar: user.avatar,
      email: user.email,
      uploaded_avatar: "",
      openUploadImg: false,
      image: null,
    };
    this.fileInputRef = React.createRef(null);
  }

  handleClickOpenUploadImg = () => {
    this.setState({ openUploadImg: true })
  }
  handleCloseUploadImg = () => {
    this.setState({ openUploadImg: false })
  }
  handleUploadedImg = () => {
    this.setState({ openUploadImg: false })
    this._crop();
  }
  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
    // console.log(event.target.files);
  };
  _crop = () => {
    var dataUrl = cropper.current.cropper.getCroppedCanvas({
      // maxWidth: 300,
      // maxHeight: 300,
      fillColor: "#fff",
      imageSmoothingEnabled: false,
      imageSmoothingQuality: "high"
    });
    if (dataUrl.toBlob) {
      dataUrl.toBlob(
        (blob) => {

          var formData = new FormData();
          formData.append("croppedImage", blob);
          let file = formData.get("croppedImage");
          var url = URL.createObjectURL(file);
          // upload ảnh ở đây a nhé
          let upload_url = window.Laravel.baseUrl + "/user/uploadAvatar"
          axios.post(upload_url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
            .then(response => {
              this.setState({ avatar: url });
              localStorage.setItem('user', JSON.stringify(response.data))

              this.props.successNotification('Đã lưu avatar')
            })
            .catch(errors => {
              this.props.errorNotification(errors.response.data.errors.croppedImage[0])
            })
          //End
        },
        "image/jpeg",
        0.8
      );
    }
  }
  
    render(){
      return (
        <div className="">
          
          <Card className="root" >
            <CardContent>
              <div className="detail">
                <div>
                  <Typography
                    gutterBottom
                    variant="h2"
                  >
                    {this.state.name}
                  </Typography>
                  <Typography
                    className="locationText"
                    color="textSecondary"
                    variant="body1"
                  >
                    {this.state.phone}
                  </Typography>
                  <Typography
                    className="dateText"
                    color="textSecondary"
                    variant="body1"
                  >
                    {moment().format('hh:mm A')} (GMT +7)
                  </Typography>
                </div>
                <Avatar
                  className="avatar"
                  src={this.state.avatar}
                />
              </div>           
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                className="uploadButton"
                color="primary"
                variant="text"
                onClick={() => this.handleClickOpenUploadImg()}
              >
                Upload picture
              </Button>
            </CardActions>
            <Dialog
              open={this.state.openUploadImg}
              onClose={this.handleCloseUploadImg}
              aria-labelledby="form-dialog-title"
              maxWidth="md"
              fullWidth={true}
            >
              <DialogTitle id="form-dialog-title">Tải ảnh lên</DialogTitle>
              <DialogContent>
                <label htmlFor="file" className="label-upload-img"></label>
                <input
                  ref={this.fileInputRef}
                  id="file"
                  type="file"
                  onChange={this.onImageChange}
                  accept="image/*"
                />
                <Cropper
                  ref={cropper}
                  src={this.state.image}
                  style={{ height: 300, width: 500, margin: "auto" }}
                  // Cropper.js options
                  aspectRatio={1 / 1}
                  guides={false}
                  // crop={this._crop.bind(this)}
                  dragMode="move"
                  background={false}
                  viewMode={1}
                  cropBoxMovable={false}
                  cropBoxResizable={false}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleCloseUploadImg}
                  color="secondary"
                  className="button-cancel__upload-img"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={this.handleUploadedImg}
                  className="button-comfirm__upload-img"
                >
                  Xác nhận
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        
        </div>
      )
    };
  

}

export default AccountProfile;
