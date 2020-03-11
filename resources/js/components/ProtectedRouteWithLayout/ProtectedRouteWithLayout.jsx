import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../../auth';

const ProtectedRouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  // let auth = false;
  return (
    
    <Route
      {...rest}
      render={matchProps =>(
        auth.isAuthenticated() === true
        ? <Layout>
                <Component {...matchProps} />
            </Layout>
        : <Redirect to='/login' />
      )}
    />
  );
};

ProtectedRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default ProtectedRouteWithLayout;
