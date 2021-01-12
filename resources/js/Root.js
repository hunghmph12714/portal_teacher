import React, {Component} from "react";
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
// import { Provider as StoreProvider } from 'react-redux';
// import { configureStore } from './store';
import validate from 'validate.js';

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import { SnackbarProvider } from 'notistack';

const browserHistory = createBrowserHistory();
// const store = configureStore();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

export default class Root extends Component {
    constructor(props) {
      super(props);
    }


    render() {
        return (
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={1} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}>
              <Router history={browserHistory}>
                <Routes />
              </Router>
            </SnackbarProvider>
          </ThemeProvider>
        );
      }
}
if (document.getElementById('root')) {
    ReactDOM.render(<Root />
                  , document.getElementById('root'));
  }
