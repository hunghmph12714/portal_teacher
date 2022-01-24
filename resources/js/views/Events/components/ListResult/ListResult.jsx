import React , { useState, useEffect } from 'react'
import './ListResult.scss'
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
var z = {1: 151,6:60}
var pattern = [0,7,9,11,13,15,17,19,21];
// var i = pattern.map(p => {
//     z = {...z, [7+p] :45, [8+p]:50, [9+p]:45, [11+p]: 45}
//     return {[7+p] :45, [8+p]:45, [9+p]:45, [11+p]: 45}
// });
const ListResult = (props) => {
    
    useEffect(() => {
    async function fetchJSON () {
        axios.post('/event/result', {event_id: props.class_id})
    }    
    fetchJSON()
  }, [])
  
  return (
    <>

    </>
  )
}
export default ListResult