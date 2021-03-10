import React from 'react'
import './PublicResult.scss'
import axios from 'axios'
import {ScoreChart} from '../'
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
  ListItemSecondaryAction ,
  IconButton ,
  Typography ,
} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GetAppIcon from '@material-ui/icons/GetApp';
import FolderIcon from '@material-ui/icons/Folder';
import MaterialTable from "material-table";

import {withSnackbar} from 'notistack'
const baseUrl = window.Laravel.baseUrl
var date = new Date();
var formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

class PublicResult extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            sbd: '',
            passcode: '',
            loading: false,
            existed: false,
            student: {},
            sessions: [],
            openResult: false,
            selected_name: '',
            label: [],
            data: [],
            score:'',
            comment: '',
            document: [],
            min: 0,
            max: 0,
            avg: 0,
            rank: 0,
        }
    }
    componentDidMount = () => {
      
    }
    onChange = (e) => {
      this.setState({
        [e.target.name] : e.target.value
      })
    }
    handleOpenResult = (rowData) => {
      var dc = []
      if(rowData.document){
        let doc = rowData.document.split(',')
        dc = doc.map(d => {
          return {url: d, name: d.split('_')[1]}
        })
      }
      this.setState({
        openResult: true,
        label: rowData.chart.label,
        data: rowData.chart.data,
        selected_name: rowData.content,
        score: rowData.score,
        comment: rowData.comment,
        document: dc,
        min: rowData.min,
        max: rowData.max,
        avg: rowData.avg,
        rank: rowData.rank,
      })
    }
    handleCloseResult = () => {
      this.setState({
        openResult: false
      })
    }
    submitForm = (e) => {
      if(this.state.sbd == "" || this.state.passcode == ""){
        this.props.enqueueSnackbar('Vui lòng nhập SBD và Mã cá nhận được cung cấp qua Email.', {
            anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          } ,
          variant: 'warning'
        })
        return 1;
      }
      axios.post('/event-get-result', {sbd: this.state.sbd, passcode: this.state.passcode})
        .then(response => {
          
          const student = response.data.student
          const sessions = response.data.sessions
          this.setState({
            student, sessions, existed: true,
          })
        })
        .catch(err => {
          this.props.enqueueSnackbar(err.response.data, {
              anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            } ,
            variant: 'error'
          })
          this.setState({
            existed: false,
            student: [],
            sessions: [],
          })
        })
    }
    render(){
      document.title =  'FORM TRA CỨU'
      return (
        <div className="root-event-detail">
          <Grid container spacing={8}>
            <Grid item md={3} sm={12}>
              <div className="form-tra-cuu">
                <h3>Nhập Thông Tin</h3>
                <TextField  label="ID tra cứu"  
                    fullWidth
                    className = "input-text"
                    variant="filled"
                    size="small"
                    margin = "dense"
                    name = 'sbd'
                    value = {this.state.sbd}
                    onChange = {this.onChange}
                />
                <TextField  label="Mã cá nhân"  
                    fullWidth
                    className = "input-text"
                    variant="filled"
                    size="small"
                    margin = "dense"
                    name = 'passcode'
                    value = {this.state.passcode}
                    onChange = {this.onChange}
                />
                <Button 
                  // color={(this.state.events[index].active) ? 'primary' : 'default'} 
                  color='primary'
                  className="btn-submit"
                  onClick = {e => this.submitForm(e)}
                  style={ {fontWeight: 'bold', color: 'black'}}
                  disabled = {this.state.loading}
                >
                  Tra cứu
                  {this.state.loading ? (
                    <CircularProgress />
                  ): ""}
                
                </Button>
              </div>
              
              {this.state.existed ? (
                <div className="student-info">
                  <h3>Thông tin học sinh</h3>
                  <b> Họ tên: </b> {this.state.student.fullname} <br/>
                  <b> Ngày sinh: </b> {this.state.student.dob}<br/>
                  <b> Trường: </b> {this.state.student.school}<br/>
                  <b> Số điện thoại: </b> {this.state.student.phone}<br/>
                  <b> Email: </b> {this.state.student.email}<br/>
                </div>
              ):""}
              
            </Grid>
            <Grid item md={9} sm={12}>
              {!this.state.existed ? (
                <div className="huong-dan">
                  <h3>Hướng dẫn</h3>
                  <p>Phụ huynh có thể sử dụng chức năng tra cứu để:</p>
                  <ul> 
                    <li>Tra cứu địa điểm thi, thời gian thi thử</li>
                    <li>Tra cứu kết quả, phổ điểm</li>
                    <li>Truy cập nguồn tài liệu phù hợp</li>
                  </ul>
                  <p>(*)Lưu ý: Phụ huynh cần phải điền chính xác <b>ID tra cứu</b> và <b> Mã cá nhân</b> được cung cấp qua email sau khi hoàn tất lệ phí thi.</p>
                </div>
              ) : 
              <div>                
                <MaterialTable
                  className="event-info"
                  title="Danh sách môn thi"
                  data={this.state.sessions}
                  options={{
                          paging: false,
                          grouping: false,
                          filtering: false,
                          exportButton: false,
                          rowStyle: rowData => {
                              return {padding: '0px',}   
                          },
                  }}
                  // onRowClick={(event, rowData) => { handleOpenStudent(rowData) }}
                  actions={[
                    {
                        icon: () => <Button className="btn-result">KẾT QUẢ</Button>,
                        isFreeAction: false,
                        text: 'Xem kết quả & phổ điểm',
                        onClick: (evt, rowData) => {this.handleOpenResult(rowData)},
                    },
                  ]}
                  localization={{
                          body: {
                              emptyDataSourceMessage: 'Không tìm thấy môn học'
                          },
                          toolbar: {
                              searchTooltip: 'Tìm kiếm',
                              searchPlaceholder: 'Tìm kiếm',
                              nRowsSelected: '{0} hàng được chọn'
                          },
                          header: {
                            actions: ''
                          },
                          pagination: {
                              labelRowsSelect: 'dòng',
                              labelDisplayedRows: ' {from}-{to} của {count}',
                              firstTooltip: 'Trang đầu tiên',
                              previousTooltip: 'Trang trước',
                              nextTooltip: 'Trang tiếp theo',
                              lastTooltip: 'Trang cuối cùng'
                          },
                          grouping: {
                            placeholder: 'Kéo tên cột vào đây để nhóm'
                          }
                      }}
                  columns={
                    [
                      
                      //Thứ
                        {
                          title: "Môn thi",
                          field: "content",
                          headerStyle: {
                              fontWeight: '600',
                          },
                          cellStyle: {
                          },
                        },
                        {
                          title: "Ngày",
                          field: "date",
                          headerStyle: {
                              fontWeight: '600',
                          },
                        },
                        {
                          title: "Thời gian",
                          field: "time",
                          headerStyle: {
                              fontWeight: '600',
                          },                      
                        },
                        {
                          title: "Địa điểm",
                          field: "room",
                          headerStyle: {
                              fontWeight: '600',
                          },    
                        },
                    ]
                  }
                />
              </div>
              }
              
              
            </Grid>
          </Grid>
          <Dialog
            open={this.state.openResult}
            onClose={this.handleCloseResult}
            aria-labelledby="form-dialog-title"
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle id="form-dialog-title"></DialogTitle>
            <DialogContent>
              <h3> Môn thi: {this.state.selected_name}</h3>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <h4><b> Điểm: </b> {this.state.score}</h4>                  
                  <h4><b> Xếp hạng: </b> {this.state.rank}</h4>
                  <h4><b> Điểm cao nhất: </b> {this.state.max}</h4>
                  <h4><b> Điểm thấp nhất: </b> {this.state.min}</h4>
                  <h4><b> Điểm trung bình: </b> {this.state.avg}</h4>
                </Grid>
                <Grid item md={8}>
                <h4><b> Nhận xét: </b> {this.state.comment}</h4>
                </Grid>
              </Grid>
              <ScoreChart 
                name = {this.state.selected_name}
                label = {this.state.label}
                data = {this.state.data}
                openResult = {this.state.openResult}
              />
              <div className="document">
              <h4><b> Tài liệu ôn luyện </b> </h4>
                <List >
                  {this.state.document.map(d => {
                    return (
                      <ListItem >
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={d.name}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => {
                             window.open("https://center.vietelite.edu.vn"+ d.url); 
                          }}>
                            <GetAppIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  })}
                    
                </List>
              </div>
            </DialogContent>              
          </Dialog>
        </div>
      )
    }
}
export default withSnackbar(PublicResult)