import React, {useState, useEffect} from 'react'
import { ParentSearch } from '../../../../components'
import { Grid , Paper} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select , { components }  from "react-select";
import chroma from 'chroma-js';

const baseUrl = window.Laravel.baseUrl

const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
});
const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        },
      };
    },
    input: styles => ({ ...styles, ...dot() }),
    placeholder: styles => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };
const RelationshipOptions = React.memo(props => {
    const [relationships, setRelationships] = useState([])
    useEffect(() => {
        const fetchdata = async() => {
            const r = await axios.get(baseUrl + '/relationship/get')
            setRelationships(r.data.map(relationship => {
                    return {label: relationship.name, value: relationship.id, color: (relationship.color)?relationship.color:"#000000"}
                })
            )
        }
        fetchdata()
    }, [])
    
    return( 
        <Select className = "select-box"
            className="relationship-select"
            value = {props.selected_relationship}
            name = "selected_relationship"
            placeholder="Quan hệ khách hàng"
            options={relationships}
            onChange={props.handleChange}
            styles={colourStyles}
        />)
})
const ParentForm = props => {
    const { state, handleParentChange, onChange, handleChange, onChangePhone ,...rest } = props;
    return (

        <Grid container spacing={3} className="container-grid" {...rest}>                
            <Grid item md={12} lg={4} sm={12} xs={12}>
                <TextField  label="Họ tên phụ huynh" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    margin = "dense"
                    name = 'parent_name'
                    value = {state.parent_name}
                    onChange = {onChange}
                /> 
                
                <TextField  label="Tên phụ huynh 2" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    margin = "dense"
                    name = 'parent_alt_name'
                    value = {state.parent_alt_name}
                    onChange = {onChange}
                /> 
                <RelationshipOptions 
                    selected_relationship={state.selected_relationship}
                    handleChange={handleChange}
                />
            </Grid>
            <Grid item md={12} lg={4} sm={12} xs={12}>
                <ParentSearch
                    parent_phone = {state.parent_phone}
                    handleParentChange = {handleParentChange}
                />
                <TextField  label="Số điện thoại 2" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    margin = "dense"
                    name = 'parent_alt_phone'
                    value = {state.parent_alt_phone}
                    onChange = {onChangePhone}
                /> 
                <TextField  label="Ghi chú" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    margin = "dense"
                    name = 'parent_note'
                    value = {state.parent_note}
                    onChange = {onChange}
                />     
            </Grid>
            <Grid item md={12} lg={4} sm={12}  xs={12}>
                <TextField  label="Email(*)" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="email"
                    fullWidth
                    margin = "dense"
                    name = 'parent_email'
                    value = {state.parent_email}
                    onChange = {onChange}
                />    
                <TextField  label="Email 2" 
                    className = "input-text"
                    variant="outlined"
                    size="small"
                    type="email"
                    fullWidth
                    margin = "dense"
                    name = 'parent_alt_email'
                    value = {state.parent_alt_email}
                    onChange = {onChange}
                /> 
            </Grid>
        </Grid>
                        
    )
}
export default ParentForm;