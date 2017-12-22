import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const Public = ({
  loggingIn, authenticated, component, location, path, exact, ...rest
}) => (
  <Route
    path={path}
    exact={exact}
    render={props => (
      !authenticated ?
      (React.createElement(component, {
 ...props, ...rest, loggingIn, authenticated
})) :
      (<Redirect to={{ pathname: '/subscriptions', state: location.state }} />)
    )}
  />
);

Public.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
};

export default Public;
