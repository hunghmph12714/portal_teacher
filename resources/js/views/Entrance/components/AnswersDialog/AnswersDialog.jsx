import React from 'react';
import './AnswersDialog.scss';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
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
const AnswersDialog = props => {
    const classes = useStyles();

    const {state, open_answers, handleCloseDialog, answers, ...rest} = props
    return(
        <Dialog 
            {...rest}
            fullWidth 
            maxWidth='xl'
            scroll='paper'
            className='root-edit-entrance'
            open={open_answers} onClose={handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                <h4>Bài làm</h4>
            </DialogTitle>
            <DialogContent>
                <div className={classes.root}>
                    <GridList cellHeight={500} className={classes.gridList} cols={2.5}>
                        {answers.map((answer) => (
                            <GridListTile key={answer}>
                                <img src={answer}/>
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </DialogContent>    
            <DialogActions>
                {/* <Button onClick={this.props.handleCloseDialog} color="primary">
                    Hủy bỏ
                </Button>
                <Button onClick={this.handleEditEntrance} color="primary" id="btn-save">
                    Lưu thay đổi
                </Button>                 */}
            </DialogActions>
        </Dialog>
    )

}
export default AnswersDialog