import React , { useState, useEffect } from 'react'
import './ListAttendance.scss'
import SpreadSheet from '@rowsncolumns/spreadsheet'

import { format } from 'date-fns'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Typography from '@material-ui/core/Typography';

import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
  } from "@material-ui/core";
  import MaterialTable from "material-table";
  import Chip from '@material-ui/core/Chip';
  import FolderOpenIcon from '@material-ui/icons/FolderOpen';
const baseUrl = window.Laravel.baseUrl
const ListAttendance = (props) => {
    const [sheets, setSheets] = useState([{name: 'Sheet 1',
    cells: {
        1: {
            1: {}            
        },
    },
    id: 1}])
  useEffect(() => {
    async function fetchJSON () {
        const resource = await axios.post(baseUrl + '/class/report' , {class_id: props.class_id, from: props.from, to: props.to})
        const students = resource.data.students
        const sessions = resource.data.sessions
        const sheet = {
            name: 'Sheet 1',
            cells: {
                1: {
                    1: {text: 'ID',bold: true, locked: true, stroke:'black'},
                    2: {text: 'Tên học sinh',bold: true, locked: true, stroke:'black' },
                    3: {text: 'Ngày sinh', bold:true, locked: true, stroke:'black'},
                    4: {text: 'Email', bold:true, locked: true, stroke:'black'},                           
                    5: {text: 'Điện thoại', bold:true, locked: true,stroke:'black'},            
                    6: {text: 'Trạng thái', bold:true, locked: true,stroke:'black'},
                    7: {text: 'Nhập học', bold:true, locked: true,stroke:'black'},
                    8: {text: 'Nghỉ học', bold:true, locked: true,stroke:'black'},
                    9: {text: 'Học phí', bold:true},
                    10: {text: 'Miễn giảm', bold:true},
                    11: {text: 'SD kì trước', bold:true},            
                    12: {text: 'Cần đóng', bold:true},            
                    13: {text: 'Đã đóng', bold:true},            
                    14: {text: 'Còn nợ', bold:true},            
                },
            },
            id: 1,
            
            filterViews: [
                {
                    bounds: {
                    top: 1,
                    bottom: students.length + 1,
                    left: 1,
                    right: 14+sessions.length,
                    }
                }
            ]
        }
        //d
        for (let j = 0 ; j < sessions.length ; j++){
            const d = format(new Date(sessions[j].date), 'd/M')
            sheet.cells[1][15 + j] = {text: d, bold:true}
        }
        for (let i = 0 ; i < students.length ; i++){
            const student = students[i];
            const keys = Object.keys(student)
            const rowIndex = i + 2
            sheet.cells[rowIndex] =  sheet.cells[rowIndex] ?? {}
            sheet.cells[rowIndex][1] = {text: student.id, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'', strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][2] = {text: student.fullname, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'', strokeBottomColor: (i == students.length-1) ? 'black': ''  }
            sheet.cells[rowIndex][3] = {text: student.dob, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][4] = {text: student.email, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][5] = {text: student.phone, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][6] = {text: student.status, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][7] = {text: student.entrance, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][8] = {text: student.drop, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            
            sheet.cells[rowIndex][9] = {text: student.hp, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][10] = {text: -student.mg, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][11] = {text: student.remain, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][12] = {text: student.cd, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][13] = {text: student.dd, datatype: 'number', format: '#,##0', fill: '#98FF98'}
            sheet.cells[rowIndex][14] = {text: student.no, datatype: 'number', format: '#,##0'}
            for (let k = 0 ; k < sessions.length; k++){
                sheet.cells[rowIndex][15+k] = {text: student.attendance[k]}
            }
                    
        }
        sheet.cells[2 + students.length] =  sheet.cells[2 + students.length] ?? {}
        sheet.cells[2 + students.length][9] = { text: '=SUM(I2:I'+(students.length+1) +')',datatype: 'number', format: '#,##0'}
        sheet.cells[2 + students.length][10] = { text: '=SUM(J2:J'+(students.length+1) +')',datatype: 'number', format: '#,##0'}
        sheet.cells[2 + students.length][11] = { text: '=SUM(K2:K'+(students.length+1) +')',datatype: 'number', format: '#,##0'}
        sheet.cells[2 + students.length][12] = { text: '=SUM(L2:L'+(students.length+1) +')',datatype: 'number', format: '#,##0'}
        sheet.cells[2 + students.length][13] = { text: '=SUM(M2:M'+(students.length+1) +')',datatype: 'number', format: '#,##0'}
        sheet.cells[2 + students.length][14] = { text: '=SUM(N2:N'+(students.length+1) +')',datatype: 'number', format: '#,##0'}
        setSheets([sheet])
    }
    
    fetchJSON()
  }, [props.from, props.to])
  return (
    <SpreadSheet
        className = "sheet"
        sheets = {sheets}
        onChange = {setSheets}
    />
    
  )
}
export default ListAttendance