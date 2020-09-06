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
var initialSheet = {}
var attendanceOptions = ['x', '-', 'p','kp','l'];
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
        const resource = await axios.post(baseUrl + '/score/report', {class_id: props.class_id, from: props.from, to: props.to} )
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
                },
                2: {
                    1: {text: 'ID',bold: true},
                    2: {text: 'Tên học sinh',bold: true},
                    3: {text: 'Ngày sinh', bold:true},
                    4: {text: 'Email', bold:true},                           
                    5: {text: 'Điện thoại', bold:true},            
                    6: {text: 'Trạng thái', bold:true},                   
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
                {top: 1, bottom: 2, left: 5, right: 5,},
                {top: 1, bottom: 2, left: 6, right: 6,},
            ]
        }
        let t = 0
        for (let j = 0 ; j < sessions.length ; j++){
            const d = format(new Date(sessions[j].date), 'd/M')
            sheet.cells[1][7+t] = {text:  d + ": " + sessions[j].name, bold:true, locked: true, stroke:'black', horizontalAlign: 'center', verticalAlign: 'middle'}
            sheet.cells[2][7+t] = {text: 'Điểm danh', bold:true, stroke:'black'}
            sheet.cells[2][8+t] = {text: 'BTVN tổng', bold:true, stroke:'black'}
            sheet.cells[2][9+t] = {text: 'BTVN hoàn thành', bold:true, stroke:'black'}
            sheet.cells[2][10+t] = {text: 'BTVN điểm', bold:true, stroke:'black'}
            sheet.cells[2][11+t] = {text: 'Điểm trên lớp', bold:true, stroke:'black'}
            sheet.cells[2][12+t] = {text: 'Điểm trên lớp (tổng) ', bold:true, stroke:'black'}            
            sheet.cells[2][13+t] = {text: 'Nhận xét', bold:true, stroke:'black'}
            sheet.mergedCells.push({top: 1, left: 7+t, right: 13+t, bottom: 1})
            t+=7
        }
        for (let i = 0 ; i < students.length ; i++){
            let t = 0
            const student = students[i];
            const keys = Object.keys(student)
            const rowIndex = i + 3
            sheet.cells[rowIndex] =  sheet.cells[rowIndex] ?? {}
            sheet.cells[rowIndex][1] = {text: student.id, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'', strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][2] = {text: student.fullname, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'', strokeBottomColor: (i == students.length-1) ? 'black': ''  }
            sheet.cells[rowIndex][3] = {text: student.dob, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][4] = {text: student.email, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][5] = {text: student.phone, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            sheet.cells[rowIndex][6] = {text: student.status, strike: student.status == 'droped', fill: (student.status == 'droped')?'#cccccc':'' , strokeBottomColor: (i == students.length-1) ? 'black': '' }
            for (let k = 0 ; k < sessions.length; k++){
                sheet.cells[rowIndex][7+t] = {text: student.attendance[k], 
                    dataValidation: {
                        prompt: "Nhập điểm danh",
                        type: 'list',
                        formulae: ['x', '-', 'p','kp','l']
                    },
                    tooltip: student.fullname, student_id: student.id, session_id: sessions[k].id, col: 'attendance', strokeLeftColor:'black'
                    , strokeBottomColor: (i == students.length-1) ? 'black': '' 
                }
                sheet.cells[rowIndex][8+t] = {text: student.score['btvn_max'][k], student_id: student.id, session_id: sessions[k].id, col: 'btvn_max', strokeLeftColor:'black', strokeBottomColor: (i == students.length-1) ? 'black': '' }
                sheet.cells[rowIndex][9+t] = {text: student.score['btvn_complete'][k], student_id: student.id, session_id: sessions[k].id, col: 'btvn_complete', strokeLeftColor:'black', strokeBottomColor: (i == students.length-1) ? 'black': '' }
                sheet.cells[rowIndex][10+t] = {text: student.score['btvn_score'][k], student_id: student.id, session_id: sessions[k].id, col: 'btvn_score', strokeLeftColor:'black', strokeBottomColor: (i == students.length-1) ? 'black': '' }
                sheet.cells[rowIndex][11+t] = {text: student.score['score'][k], student_id: student.id, session_id: sessions[k].id, col: 'score', strokeLeftColor:'black', strokeBottomColor: (i == students.length-1) ? 'black': '' }
                sheet.cells[rowIndex][12+t] = {text: student.score['max_score'][k], student_id: student.id, session_id: sessions[k].id, col: 'max_score', strokeLeftColor:'black', strokeBottomColor: (i == students.length-1) ? 'black': '' }
                sheet.cells[rowIndex][13+t] = {text: student.score['comment'][k], student_id: student.id, session_id: sessions[k].id, col: 'comment', strokeLeftColor:'black', strokeBottomColor: (i == students.length-1) ? 'black': '' , strokeRightColor:'black'}     
                t+=7
            }    
        }
        setSheets([sheet])  
        initialSheet = sheet
    }    
    fetchJSON()
  }, [props.from, props.to])
  const updateServer = (sheet, value, cell) => {
    var cells = initialSheet.cells
        let student_id = cells[cell.rowIndex][cell.columnIndex].student_id
        let session_id = cells[cell.rowIndex][cell.columnIndex].session_id
        let col = cells[cell.rowIndex][cell.columnIndex].col
        if(cells[cell.rowIndex][cell.columnIndex].student_id && cells[cell.rowIndex][cell.columnIndex].session_id){
            axios.post(baseUrl + '/attendance/cell-edit', {student_id: student_id, session_id: session_id, col: col, value: value})
            .then(response => {

            })
            .catch(err=> {
                
            })
        }
  }
  return (
    <SpreadSheet
        className = "sheet"
        sheets={sheets}
        onChange = {setSheets}
        // onChangeCell={(sheet, value, cell) => updateServer(sheet,value,cell)}
        onChangeCells={(activeSheetId, changes) => {
            // Persist in your data model
            let payload = [];
            for (const [row, rows] of Object.entries(changes)) {
                for (const [col, cell] of Object.entries(rows)) {
                    var cells = initialSheet.cells
                    let student_id = cells[row][col].student_id
                    let session_id = cells[row][col].session_id
                    let type = cells[row][col].col
                    
                    if(cells[row][col].student_id && cells[row][col].session_id){
                        payload.push({student_id: student_id, session_id: session_id, col: type, value: cell.text})                        
                    }
                }
            }
            axios.post(baseUrl + '/attendance/cell-edit', {payload: payload})
                .then(response => {

                })
                .catch(err=> {
                    
                })
        }}
        minHeight={600}
        snap={true}
        selectionMode='row|column|both'
    />
  )
}
export default ListScore