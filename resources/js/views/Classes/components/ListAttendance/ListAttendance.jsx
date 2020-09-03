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
                    1: {text: 'Tên học sinh',bold: true},
                    2: {text: 'Ngày sinh',bold: true},
                    3: {text: 'Email', bold:true},
                    4: {text: 'Điện thoại', bold:true},
                    5: {text: 'Học phí', bold:true},
                    6: {text: 'Miễn giảm', bold:true},
                    7: {text: 'SD kì trước', bold:true},            
                    8: {text: 'Cần đóng', bold:true},            
                    9: {text: 'Đã đóng', bold:true},            
                    10: {text: 'Còn nợ', bold:true},            
                },
            },
            id: 1,
            
            filterViews: [
                {
                    bounds: {
                    top: 1,
                    bottom: students.length + 1,
                    left: 1,
                    right: 10+sessions.length,
                    }
                }
            ]
        }
        
        for (let j = 0 ; j < sessions.length ; j++){
            const d = format(new Date(sessions[j].date), 'd/M')
            sheet.cells[1][11+j] = {text: d, bold:true}
        }
        for (let i = 0 ; i < students.length ; i++){
            const student = students[i];
            const keys = Object.keys(student)
            const rowIndex = i + 2
            sheet.cells[rowIndex] =  sheet.cells[rowIndex] ?? {}
            sheet.cells[rowIndex][1] = {text: student.fullname}
            sheet.cells[rowIndex][2] = {text: student.dob}
            sheet.cells[rowIndex][3] = {text: student.email}
            sheet.cells[rowIndex][4] = {text: student.phone}
            sheet.cells[rowIndex][5] = {text: student.hp, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][6] = {text: -student.mg, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][7] = {text: student.remain, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][8] = {text: student.cd, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][9] = {text: student.dd, datatype: 'number', format: '#,##0'}
            sheet.cells[rowIndex][10] = {text: student.no, datatype: 'number', format: '#,##0'}
            for (let k = 0 ; k < sessions.length; k++){
                sheet.cells[rowIndex][11+k] = {text: student.attendance[k]}
            }
                    
        }
        sheet.cells[2 + students.length] =  sheet.cells[2 + students.length] ?? {}
        sheet.cells[2 + students.length][5] = { text: '=SUM(E2:E'+(students.length+1) +')',datatype: 'number', format: '#,##0'}
        setSheets([sheet])
    }
    
    fetchJSON()
  }, [props.from, props.to])
  return (
    <SpreadSheet
        className = "sheet"
        sheets={sheets}
        onChange = {setSheets}
    />
  )
}
export default ListAttendance