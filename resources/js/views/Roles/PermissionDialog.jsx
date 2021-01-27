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
    //     const fetchData = async() => {
    //         const r = await axios.get('/permission/get')            
    //         setPermissions(r.data)
    //     }
    //     fetchData()
    // }, [])
    return (
        <Dialog
            open={props.open_permission}
            onClose={props.handleClosePermission}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle id="form-dialog-title">Sửa phân quyền</DialogTitle>
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
                                        <FormLabel component="legend">{e}</FormLabel>
                                        <FormGroup>
                                            {
                                                p[e].map(permission => (
                                                    <FormControlLabel
                                                        control={<Checkbox checked={permission.checked} onChange={() => {onPermissionChange(permission)}} name="gilad" />}
                                                        label={permission.name_vn}
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
                    color="secondary"
                    className="button-cancel__upload-img"
                >
                    Hủy bỏ
                </Button>
                <Button
                    className="button-comfirm__upload-img"
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
        
    )
}
export default PermissionDialog;
