import React, {useState, useEffect} from 'react';
import './AnswersDialog.scss';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useSnackbar } from 'notistack';
import axios from 'axios';
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

    const {state, open_answers, handleCloseDialog, answers, results, selectedEntrance , ...rest} = props
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [test_note, setTestNote] = useState('')
    const [test_score, setTestScore] = useState('');
    useEffect(() => {
        // console.log(selectedEntrance)
        if(selectedEntrance){
            setTestNote(selectedEntrance.test_note)
            setTestScore(selectedEntrance.test_score)
        }
        
        // setTestAnswer(selectedEntrance.test_answers)
        // setTestAnswer(selectedEntrance.test_answers)

    }, [selectedEntrance])    
    function handleNoteChange(value){
        setTestNote(value.target.value)
    }
    
    function handleScoreChange(value){
        setTestScore(value.target.value)
    }
    function handleEditEntrance(){
        let fd = new FormData()
        
        fd.append('id' , selectedEntrance.eid)
        fd.append('count_answers', 0)
        fd.append('count_results', 0)
        fd.append('note', test_note)
        fd.append('score', test_score)
        axios.post('/entrance/appointment/edit', fd)
            .then(response => {
                enqueueSnackbar('Đã cập nhật', {variant: 'success'});
                props.fetchdata();
                props.handleCloseDialog();
            })
            .catch(err => {

            })
    }
    return(
        <Dialog 
            {...rest}
            fullWidth 
            maxWidth='md'
            scroll='paper'
            className='root-edit-entrance'
            open={open_answers} onClose={handleCloseDialog} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item md={6} sm={12}> 
                        <Grid container spacing={3}>
                            <Grid item md={6} sm={12}> 
                                <h4>Bài làm</h4>
                                <ul>
                                    {answers.map((answer) => (
                                        <li>
                                            <a href={answer} target="_blank">Xem/ Tải về</a>
                                        </li>
                                    ))}
                                </ul>
                                
                            </Grid>
                            <Grid item md={6} sm={12}> 
                                <h4>Bài chữa</h4>
                                <ul>
                                    {results.map((r) => (
                                        <li>
                                            <a href={r} target="_blank">Xem/ Tải về</a>
                                        </li>
                                    ))}
                                </ul>
                                
                            </Grid>
                        </Grid>
                    </Grid>
                    {selectedEntrance ? (
                        <Grid item md={6} sm={12}>
                            <TextField  label="Kết quả" 
                                className = "input-text"
                                variant="outlined"
                                size="small"
                                type="text"
                                fullWidth
                                margin = "dense"
                                name = 'test_score'
                                value = {test_score}
                                onChange = {handleScoreChange}
                            /> 
                            <TextField  label="Nhận xét" 
                                className = "input-text"
                                variant="outlined"
                                size="small"
                                type="text"
                                fullWidth
                                margin = "dense"
                                name = 'test_note'
                                value = {test_note}
                                onChange = {handleNoteChange}
                            /> 
                        </Grid>
                    ) : ''}
                    
                </Grid>
                <div className={classes.root}>

                   
                </div>
            </DialogContent>    
            <DialogActions>
                <Button onClick={props.handleCloseDialog} color="primary">
                    Hủy bỏ
                </Button>
                <Button onClick={() => handleEditEntrance()} color="primary" id="btn-save">
                    Lưu thay đổi
                </Button>                
            </DialogActions>
        </Dialog>
    )

}
export default AnswersDialog