import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import palette from '../../../../theme/palette';
import {options} from './chart'

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

const ScoreChart = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [data, setData] = useState({});
  useEffect(() => {
    const d = {
      labels: props.label,
      datasets: [
        {
          label: 'Phổ điểm môn ' + props.name,
          backgroundColor: palette.primary.main,
          data: props.data
        },
      ]
    }
    setData(d)
  }, [props.openResult])
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title={"Phổ điểm môn " + props.name}
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Bar
            data={data}
            options={options}
          />
        </div>
      </CardContent>
      <Divider />
      
    </Card>
  );
};

ScoreChart.propTypes = {
  className: PropTypes.string
};

export default ScoreChart;
