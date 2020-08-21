import React , { useState, useEffect } from 'react'
import './ListScore.scss'
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
const ListScore = (props) => {
    const [sheets, setSheets] = useState([{name: 'Sheet 1',
    cells: {
        1: {
            1: {}            
        },
    },
    id: 1}])
  useEffect(() => {
    async function fetchJSON () {
        const resource = await axios.get(baseUrl + '/score/report/'+props.class_id)
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
                },
                2: {
                    1: {text: 'Tên học sinh',bold: true},
                    2: {text: 'Ngày sinh',bold: true},
                    3: {text: 'Email', bold:true},
                    4: {text: 'Điện thoại', bold:true},                           
                },
            },
            id: 1,
            
            // filterViews: [
            //     {
            //         bounds: {
            //         top: 1,
            //         bottom: students.length + 1,
            //         left: 1,
            //         right: 4+sessions.length,
            //         }
            //     }
            // ],
            mergedCells: [
                {top: 1, bottom: 2, left: 1, right: 1,},
                {top: 1, bottom: 2, left: 2, right: 2,},
                {top: 1, bottom: 2, left: 3, right: 3,},
                {top: 1, bottom: 2, left: 4, right: 4,},
            ]
        }
        let t = 0
        for (let j = 0 ; j < sessions.length ; j++){
            const d = format(new Date(sessions[j].date), 'd/M')
            sheet.cells[1][5+t] = {text: sessions[j].id+ " | "+ d + ": " + sessions[j].name, bold:true}
            sheet.cells[2][5+t] = {text: 'Điểm danh', bold:true}
            sheet.cells[2][6+t] = {text: 'BTVN tổng', bold:true}
            sheet.cells[2][7+t] = {text: 'BTVN hoàn thành', bold:true}
            sheet.cells[2][8+t] = {text: 'BTVN điểm', bold:true}
            sheet.cells[2][9+t] = {text: 'Điểm trên lớp', bold:true}
            sheet.cells[2][10+t] = {text: 'Điểm trên lớp (tổng) ', bold:true}            
            sheet.cells[2][11+t] = {text: 'Nhận xét', bold:true}
            sheet.mergedCells.push({top: 1, left: 5+t, right: 11+t, bottom: 1})
            t+=7
        }
        for (let i = 0 ; i < students.length ; i++){
            let t = 0
            const student = students[i];
            const keys = Object.keys(student)
            const rowIndex = i + 3
            sheet.cells[rowIndex] =  sheet.cells[rowIndex] ?? {}
            sheet.cells[rowIndex][1] = {text: student.fullname}
            sheet.cells[rowIndex][2] = {text: student.dob}
            sheet.cells[rowIndex][3] = {text: student.email}
            sheet.cells[rowIndex][4] = {text: student.phone}
            for (let k = 0 ; k < sessions.length; k++){
                sheet.cells[rowIndex][5+t] = {text: student.attendance[k]}
                sheet.cells[rowIndex][6+t] = {text: student.score['btvn_max'][k]}
                sheet.cells[rowIndex][7+t] = {text: student.score['btvn_complete'][k]}
                sheet.cells[rowIndex][8+t] = {text: student.score['btvn_score'][k]}
                sheet.cells[rowIndex][9+t] = {text: student.score['score'][k]}
                sheet.cells[rowIndex][10+t] = {text: student.score['max_score'][k]}
                sheet.cells[rowIndex][11+t] = {text: student.score['comment'][k]}     

                t+=7
            }
                    
        }
        
        setSheets([sheet])  
    }
    
    fetchJSON()
  }, [])
  return (
    <SpreadSheet
        className = "sheet"
        sheets={sheets}
        onChange = {setSheets}
    />
  )
}
export default ListScore