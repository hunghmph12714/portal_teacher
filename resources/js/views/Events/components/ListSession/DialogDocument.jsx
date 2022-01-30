import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  }));
const DialogDocument = props => {
    const classes = useStyles();

    const {state, open_dialog, handleCloseDialog, document, exercice, ...rest} = props
    return(
        <Dialog 
            {...rest}
             
            maxWidth='sm'
            scroll='paper'
            className='root-edit-entrance'
            open={open_dialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Tài liệu</h4>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>                    
                    <Typography variant="h5">
                        Công Khai
                    </Typography>
                        <div>
                            <List dense>
                                {(document)? document.split(',').map(doc => {
                                    return(
                                    <ListItem >
                                        <ListItemIcon>
                                            <FolderIcon />
                                        </ListItemIcon>
                                        <a href={doc} download> Tải về </a>
                                    </ListItem>
                                    )
                                }): ''}
                            </List>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Typography variant="h5">
                        Nội bộ
                    </Typography>
                    <div >
                        <List dense>
                            {(exercice) ? exercice.split(',').map(doc => {
                                return(
                                <ListItem >
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <a href={doc} download> Tải về </a>
                                </ListItem>
                                )
                            }): ''}
                        </List>
                    </div>
                    </Grid>
                </Grid>
            </DialogContent>    
            <DialogActions>
                
            </DialogActions>
        </Dialog>
    )

}
export default DialogDocument