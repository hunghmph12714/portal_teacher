import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders,
  SessionList
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          lg={12}
          xs={12}
        >
          <SessionList />
        </Grid>
        
      </Grid>
    </div>
  );
};

export default Dashboard;
