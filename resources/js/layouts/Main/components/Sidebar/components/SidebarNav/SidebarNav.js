/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors, Collapse, ListItemIcon, ListItemText  } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// const useStyles = makeStyles(theme => ({
  
// }));
const styles = theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '6px 5px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  expandArrow: {
    marginLeft: 'auto',
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
})
const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

class SidebarNav extends React.Component {

  constructor( props ){
    super(props)
    this.state = {

    }
  }

  handleClick = (item) => {
    this.setState( prevState => {
      return { [item] : !prevState[ item ]}
    })
  }

  handler = children => {
    const { classes } = this.props
    const { state } = this
    return children.map( subOption => {
      if(!subOption.children){
        return (
          <div key = {subOption.title}>
              <ListItem
              className={classes.item}
              disableGutters
              key={subOption.title}
            >
              <Button
                activeClassName={classes.active}
                className={classes.button}
                component={CustomRouterLink}
                to={subOption.href}
              >
                <div className={classes.icon}>{subOption.icon}</div>
                {subOption.title}
              </Button>
            </ListItem>
          </div>
        )
      }
      else{
        return(
          <div key = {subOption.title}>
            <ListItem
              className={classes.item}
              disableGutters
              key={subOption.title}
              onClick = {() => this.handleClick( subOption.title )}
            >
              <Button
                activeClassName={""}
                className={classes.button}
                component={CustomRouterLink}
                to={subOption.href}
              >
                <div className={classes.icon}>{subOption.icon}</div>
                {subOption.title}
                { ! state[ subOption.title ] ? 
                  <ExpandLessIcon className={classes.expandArrow}/> :
                  <ExpandMoreIcon className={classes.expandArrow}/>
                }
              </Button>
            </ListItem>
            <Collapse in={ state[subOption.title] } timeout="auto" unmountOnExit>
              {this.handler( subOption.children )}
            </Collapse>
          </div>
          
        )
      }
    })
  }
  // const classes = useStyles();
  render() {
    const { classes, pages } = this.props
    return (
      <List className = {classes.root}>
        { this.handler( pages ) }
      </List>
    )
  }

};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default withStyles(styles)(SidebarNav);
