import React from 'react';
import PropTypes from 'prop-types';
import './StudentSearch.scss';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid , Paper} from '@material-ui/core';

const customChip = (color = '#ccc') => ({
    border: '1px solid ' + color,
    color: color,
    fontSize: '12px',
})
const StudentSearch = props => {
  const { data, eref, innerProps } = props;
  
  return (
    <Card className= "search-card" ref={eref} {...innerProps}>
        <CardContent>
            <Chip style={customChip(data.color)} variant="outlined" color="secondary" label={data.r_name} size="small" />
            <Grid container spacing={2} className="search-grid">
                <Grid item md={6} sm={12}> 
                    <Typography variant="body2" component="p">
                        <b>Học sinh: </b>{data.s_name}
                        <br />
                        Ngày sinh: {data.dob}
                    </Typography>
                </Grid>
                
                <Grid item md={6} sm={12}> 
                    <Typography variant="body2" component="p">
                        <b>Phụ huynh: </b>{data.p_name}
                    <br />
                        Số điện thoại: {data.p_phone}
                    </Typography>
                </Grid>
            </Grid>
            
            
        </CardContent>
    </Card>
  );
};

StudentSearch.propTypes = {
  className: PropTypes.string,
  
};

export default StudentSearch;
