import React , {useState, useEffect} from 'react'
import './Revenue.scss'
import axios from 'axios'
import SpreadSheet from '@rowsncolumns/spreadsheet'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import Select , { components }  from "react-select";
import Divider from '@material-ui/core/Divider';
import { format } from 'date-fns'
import {
    Tooltip,
  } from "@material-ui/core";
import { Grid, IconButton, Button } from '@material-ui/core';

import DateFnsUtils from "@date-io/date-fns"; // choose your lib

import vi from "date-fns/locale/vi";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
const baseUrl = window.Laravel.baseUrl;
const customChip = (color = '#ccc') => ({
  border: '1px solid ' + color,
  color: '#000',
  fontSize: '12px',
})

const trl = {'present': 'x', 'late':'l', 'absence': 'cp', 'n_absence': 'kp','holding': '-'}
const ClassSelect = React.memo(props => {
    const {center, course} = props
    const [classes, setClasses] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/class/get/'+center+'/'+course)
            const result = r.data.map(c => {
                return {label: c.code + ' - ' +c.name, value: c.id}
            })
            const classes = [{label: 'Tất cả', value: '-1'},{label: 'Cơ sở Trung Yên' , value: 'ty'}, {label: 'Cơ sở Trần Duy Hưng' , value: 'tdh'}, {label: 'Cơ sở Phạm Tuấn Tài' , value: 'ptt'} , ...result];

            setClasses(classes)
        }
        fetchdata()
    }, [])
    
    return( 
        <Select className = "select-box"
            className="select-box"
            key = "class-select"
            value = {props.selected_class}
            name = "selected_class"
            placeholder="Chọn lớp"
            isClearable
            options={classes}
            onChange={props.handleChange}
        />)
})
const TeacherSelect = React.memo(props => {
    const [teachers, setTeachers] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/get-teacher')
            const result = r.data.map(c => {
                return {label: c.name + ' - ' +c.domain, value: c.id}
            })
            
            setTeachers(result)
        }
        fetchdata()
    }, [])
    
    return( 
        <Select className = "select-box"
            className="select-box"
            key = "teacher-select"
            value = {props.selected_teacher}
            name = "selected_teacher"
            placeholder="Chọn giáo viên"
            isClearable
            options={teachers}
            onChange={props.handleChange}
        />)
})
class Revenue extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            loading: false,
            data : [],
            selected_class : null,
            selected_teacher: null,
            from: null,
            to: null,  
            sheet: [{name: 'Sheet 1',
                cells: {
                    1: {
                        1: {}            
                    },
                },
                id: 1}
            ] 

        }
    }
    handleTeacherChange = (newValue, event) => {
        this.setState({selected_teacher:newValue})
    }
    handleClassChange = (newValue , event) => {
        this.setState({
            selected_class : (newValue)?newValue:[],                
        })
    }
    
    handleChange = (newValue , event)=> {
        this.setState({
            [event.name]: newValue
        })    
    };
    handleFromChange = date => {
        this.setState({ from: date });
    }
    handleToChange = date => {
    this.setState({ to: date });
    }
    getRevenue = (event) =>{
        event.preventDefault()
        this.setState({loading: true})
        const data = {class: this.state.selected_class, teacher: this.state.selected_teacher, from: this.state.from, to: this.state.to}

        axios.post(baseUrl + '/report/get-revenue', data)
            .then(response => {
                this.setState({loading: false})
                const data = response.data
                const sheet = {
                    name: 'Báo cáo doanh thu',
                    cells: {
                        1: {
                            1: {text: 'Lớp',bold: true, locked: true, stroke:'black'},
                            2: {text: 'Ngày',bold: true, locked: true, stroke:'black' },
                            3: {text: 'Giáo viên', bold:true, locked: true, stroke:'black'},
                            4: {text: 'Thời lượng', bold:true, locked: true, stroke:'black'},
                            5: {text: 'Có mặt', bold:true, locked: true, stroke:'black'},                           
                            6: {text: 'Chưa điểm danh', bold:true, locked: true,stroke:'black'},            
                            7: {text: 'Có phép', bold:true, locked: true,stroke:'black'},               
                            8: {text: 'Không phép', bold:true, locked: true,stroke:'black'},               
                            9: {text: 'Tổng thu', bold:true, locked: true,stroke:'black'},               
                            10: {text: 'Miễn giảm', bold:true, locked: true,stroke:'black'},               
                            11: {text: 'Tỷ lệ', bold:true, locked: true,stroke:'black'},               
                            12: {text: 'Tiền giờ', bold:true, locked: true,stroke:'black'},               
                            13: {text: 'Lương tối thiểu', bold:true, locked: true,stroke:'black'},               
                            14: {text: 'Bước nhảy', bold:true, locked: true,stroke:'black'},               
                            15: {text: 'Tạm tính', bold:true, locked: true,stroke:'black'},               
                        }
                    },
                    id: 1,
                    filterViews: [
                        {
                            bounds: {
                            top: 1,
                            bottom: data.length + 1,
                            left: 1,
                            right: 14,
                            }
                        }
                    ],
                   
                }
                for (let j = 0 ; j < data.length ; j++){
                    const d = data[j];
                    const keys = Object.keys(d)
                    const rowIndex = j+2
                    sheet.cells[rowIndex] =  sheet.cells[rowIndex] ?? {}
                    sheet.cells[rowIndex][1] = {text: d.class }
                    sheet.cells[rowIndex][2] = {text: d.date }
                    sheet.cells[rowIndex][3] = {text: d.teacher }
                    sheet.cells[rowIndex][4] = {text: d.diff }
                    sheet.cells[rowIndex][5] = {text: d.present }
                    sheet.cells[rowIndex][6] = {text: d.holding }
                    sheet.cells[rowIndex][7] = {text: d.absence }
                    sheet.cells[rowIndex][8] = {text: d.n_absence }
                    sheet.cells[rowIndex][9] = {text: d.revenue,  horizontalAlign: 'right' ,datatype: 'number', format: '#,##0'}
                    sheet.cells[rowIndex][10] = {text: d.discount,  horizontalAlign: 'right',datatype: 'number', format: '#,##0'}
                    sheet.cells[rowIndex][11] = {text: d.percentage,  horizontalAlign: 'right',datatype: 'number', format: '#,##0'}
                    sheet.cells[rowIndex][12] = {text: d.perhour,  horizontalAlign: 'right',datatype: 'number', format: '#,##0'}
                    sheet.cells[rowIndex][13] = {text: d.basic,  horizontalAlign: 'right',datatype: 'number', format: '#,##0'}
                    sheet.cells[rowIndex][14] = {text: d.jump,  horizontalAlign: 'right',datatype: 'number', format: '#,##0'}
                    sheet.cells[rowIndex][15] = {text: d.pretax,  horizontalAlign: 'right',datatype: 'number', format: '#,##0'}
                }
                sheet.cells[2 + data.length] =  sheet.cells[2 + data.length] ?? {}
                sheet.cells[2 + data.length][9] = { text: '=SUM(I2:I'+(data.length+1) +')',datatype: 'number', format: '#,##0'}
                sheet.cells[2 + data.length][10] = { text: '=SUM(J2:J'+(data.length+1) +')',datatype: 'number', format: '#,##0'}
                sheet.cells[2 + data.length][15] = { text: '=SUM(O2:O'+(data.length+1) +')',datatype: 'number', format: '#,##0'}
                // console.log(sheet)
                this.setState({sheet: [sheet]})
            })
            .catch(err => {
                this.setState({loading: false})
            })
    }
    setSheet = (sheets) => {
        this.setState(prevState => {
            return {...prevState, sheets}
        })
    }
    render(){
        document.title = 'Doanh thu'
        return(
            <div className="root-revenue">
                <Grid container spacing={1} className="select-session">
                    <Grid item lg={3} sm={12} xs={12}>
                        <ClassSelect 
                            selected_class = {this.state.selected_class}
                            handleChange={this.handleClassChange}
                            course = {-1}
                            center = {-1}
                        />
                    </Grid>
                    <Grid item lg={3} sm={12} xs={12}>
                        <TeacherSelect 
                            selected_teacher = {this.state.selected_teacher}
                            handleChange={this.handleTeacherChange}                        
                        />
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                            <KeyboardDatePicker
                            autoOk
                            fullWidth
                            size= "small"
                            className="input-date-range"
                            variant="inline"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            label="Từ ngày"
                            views={["year", "month", "date"]}
                            value={this.state.from}
                            onChange={this.handleFromChange}
                            />  
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={vi} >
                            <KeyboardDatePicker
                            autoOk
                            fullWidth
                            minDate = {this.state.from}
                            className="input-date-range"
                            size= "small"
                            variant="inline"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            label="Đến ngày"
                            views={["year", "month", "date"]}
                            value={this.state.to}
                            onChange={this.handleToChange}
                            />  
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item md={2} lg={2}> 
                        <Button variant="contained" color="primary" fullWidth={1} onClick={(event) => this.getRevenue(event)}>
                            {!this.state.loading ? 'XEM' : <CircularProgress />}
                        </Button>
                    </Grid>
                </Grid>
               
                <Divider/>
                <SpreadSheet
                    className = "sheet"
                    sheets={this.state.sheet}
                    onChange = {(sheets) => {
                        this.setState({sheet: sheets})
                    }}                    
                    minHeight={600}
                    snap={true}
                    selectionMode='row|column|both'
                />
                
            </div>
        )
    }
}
export default withSnackbar(Revenue);
