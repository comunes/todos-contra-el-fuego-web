import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PublicNavigation from '../PublicNavigation/PublicNavigation';
import AuthenticatedNavigation from '../AuthenticatedNavigation/AuthenticatedNavigation';
import { translate } from 'react-i18next';

import './Navigation.scss';

const Navigation = props => (
  <Navbar bsClass="navbar navbar-light">
    {/* https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Navbar.js */}
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">{props.t('Inicio')}</Link>
      </Navbar.Brand>
      {/* <Navbar.Toggle/> */}
      <button className="sr-only navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </Navbar.Header>
    <Navbar.Collapse>
      {!props.authenticated ? <PublicNavigation /> : <AuthenticatedNavigation {...props} />}
    </Navbar.Collapse>
  </Navbar>
);

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

//  export default Navigation;

export default translate([], { wait: true })(Navigation);
