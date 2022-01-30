import React, {useState, useEffect} from 'react';
import axios from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar, Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Grid
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import palette from '../../../../theme/palette';
import {options, lineOptions} from './chart'

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const Analytics = props => {
  const { className,class_id, ...rest } = props;
  const classes = useStyles();
  const [data_1, setData1] = useState({
    labels: ['CS Trung Yên', 'CS Phạm Tuấn Tài', 'CS TDH-DQ', 'Ngoài'],
    datasets: []
  });
  const [data_2, setData2] = useState({
    labels: ['CS Trung Yên', 'CS Phạm Tuấn Tài', 'CS TDH-DQ', 'Ngoài'],
    datasets: []
  });
  const [data_3, setData3] = useState({
    labels: [],
    datasets: []
  });
  useEffect(() => {    
    let d1 = {
        labels: ['CS Trung Yên', 'CS Phạm Tuấn Tài', 'CS TDH-DQ', 'Ngoài'],
        datasets: []
    }
    let d2 = {
        labels: ['CS Trung Yên', 'CS Phạm Tuấn Tài', 'CS TDH-DQ', 'Ngoài'],
        datasets: []
    }
    axios.post('/event-analytics', {class_id: props.class_id})
        .then(response => {
            let data= response.data
            d1.datasets = data.data_1
            setData1(d1)
            d2.datasets = data.data_2
            setData2(d2)
            setData3(data.data_3)
        })
        .catch(err=>{

        })
    // setData(d)
  }, [])
  return (
    <>
    <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
            <Card
                {...rest}
                className={clsx(classes.root, className)}
            >
                <CardHeader
                    title={"Tổng hợp số lượng học sinh"}
                />
                <Divider />
                <CardContent>
                    <div className={classes.chartContainer}>
                    <Bar
                        data={data_1}
                        options={options}
                    />
                    </div>
                </CardContent>
                <Divider />            
            </Card>
  
        </Grid>
        <Grid item md={6} sm={12}>
            <Card
                {...rest}
                className={clsx(classes.root, className)}
            >
                <CardHeader
                    title={"Tổng hợp lượt tham dự"}
                />
                <Divider />
                <CardContent>
                    <div className={classes.chartContainer}>
                    <Bar
                        data={data_2}
                        options={options}
                    />
                    </div>
                </CardContent>
                <Divider />            
            </Card>
        </Grid>

    </Grid>
    <Card
        {...rest}
        className={clsx(classes.root, className)}
    >
        <CardHeader
            title={"Tổng hợp lượt đăng ký theo ngày"}
        />
        <Divider />
        <CardContent>
            <div >
                <Line data={data_3} options={lineOptions} />
            </div>
        </CardContent>
        <Divider />            
    </Card>
    </>
    );
};

Analytics.propTypes = {
  className: PropTypes.string
};

export default Analytics;
