import React, {useState, useEffect} from 'react'
import './ClassForm.scss'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
      maxWidth: 300,
      minHeight: 290,
      margin: 10,
      position: 'relative'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    action: {
        position: 'absolute',
        bottom: 0
    }
  });
const ClassForm = (props) => {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [cs, setClasses] = useState([]);
    const { student_id } = props;
    useEffect( () => {
        async function fetchClasses(){
            const response = await axios.post('/student/get-class', {id: student_id})
            response.data.map(d => {
                d.config = JSON.parse(d.config)
            })
            setClasses(response.data)
        }
        fetchClasses() 
        
    }, [])
    return (
        <div className = "class-form-root">
            {cs.map( (c, key) => {
                return(
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                alt={c.name}
                                height="140"
                                image={"/public/images/class/"+key+".jpg"}
                                title={c.name}
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Lớp {c.code}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Giáo viên: {
                                    c.config.map(config => config.teacher.label).toString()
                                }
                                <br/>
                                Ngày học: {
                                    [...new Set(c.config.map(config => config.date.label))].toString()
                                }
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions className={classes.action}>
                            <Button size="small" color="primary">
                                Bảng điểm
                            </Button>
                            <Button size="small" color="primary">
                                Tài liệu
                            </Button>
                        </CardActions>
                    </Card>    
                )
            })}
            
        </div>
    );
}
export default ClassForm;