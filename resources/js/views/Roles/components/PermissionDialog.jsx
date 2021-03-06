import React , { useState, useEffect } from 'react';
import {
    Grid,
    Menu,
    MenuItem,
    IconButton,
    Button,
    Dialog,
    GridList,
    DialogTitle,
    GridListTile,
    DialogContent,
    DialogActions,
    FormControlLabel,
    FormControl,
    FormGroup,
    FormHelper,
    Checkbox,
    FormLabel,
    RadioGroup,
    Radio,
    TextField,
    Tooltip,
  } from "@material-ui/core";

const PermissionDialog = props => {
    const {selected_permission, onPermissionChange, permissions, ...rest} = props
    // const [ permissions, setPermissions ] = React.useState([])
    // useEffect(() => {
    //     const fetchdata = async() => {
    //         const r = await axios.get('/permission/get')            
    //         setPermissions(r.data)
    //     }
    //     fetchdata()
    // }, [])
    return (
        <Dialog
            open={props.open_permission}
            onClose={props.handleClosePermission}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle id="form-dialog-title">Sửa Phân quyền</DialogTitle>
            <DialogContent>
                <GridList cellHeight={260} cols={3}>
                    {/* {tileData.map((tile) => (
                        <GridListTile key={tile.img} cols={tile.cols || 1}>
                            <img src={tile.img} alt={tile.title} />
                        </GridListTile>
                        ))
                    } */}
                    {
                        permissions.map((p) => {
                            let e = Object.keys(p)[0]
                            return (
                                <GridListTile key={e} cols={1}>
                                    <FormControl component="fieldset" >
                                        <FormLabel style={{padding: '10px'}} component="legend"><b>{e}</b></FormLabel>
                                        <FormGroup style={{padding: '10px'}}>
                                            {
                                                p[e].map(permission => (
                                                    <FormControlLabel
                                                        control={<Checkbox checked={permission.checked} onChange={() => {onPermissionChange(permission)}} name="gilad" />}
                                                        label={permission.name_vn}
                                                        disabled = {permission.disabled}
                                                    />
                                                ))
                                            }
                                        </FormGroup>
                                    </FormControl>
                                </GridListTile>
                            )
                        })
                    }
                </GridList>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={props.handleClosePermission}
                    color="secondary"
                    className="button-cancel__upload-img"
                >
                    Hủy bỏ
                </Button>
                <Button
                    onClick={props.handleSubmitPermission}
                    className="button-comfirm__upload-img"
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
        
    )
}
export default PermissionDialog;
