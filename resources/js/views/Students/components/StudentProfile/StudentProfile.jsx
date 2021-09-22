import React from 'react';
import "./StudentProfile.scss";

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
import { withSnackbar } from 'notistack'
const cropper = React.createRef(null);

class StudentProfile extends React.Component {
  constructor(props){
    super(props)

    this.state = {
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
            formData.append("id", this.props.id)
            let file = formData.get("croppedImage");
            var url = URL.createObjectURL(file);
            // upload ảnh ở đây a nhé
            let upload_url = window.Laravel.baseUrl + "/student/uploadAvatar"
            axios.post(upload_url, formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    
                    this.props.enqueueSnackbar('Đã lưu avatar', {variant: 'success'})
                    window.location.reload();
                })
                .catch(errors => {
                    this.props.enqueueSnackbar(errors.response.data.errors.croppedImage[0], {variant: 'error'})
                    // this.props.errorNotification(errors.response.data.errors.croppedImage[0])
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
          
          <Card className="root-profile" >
            <CardContent>
              <div className="detail">
                <img className="avatar"
                  src={(this.props.avatar)? this.props.avatar : '/public/images/students/student.png'}/>
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
                TẢI ẢNH HỌC SINH
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

export default withSnackbar(StudentProfile);
