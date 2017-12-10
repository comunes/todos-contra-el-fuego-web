import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { translate } from 'react-i18next';
import PublicNavigation from '../PublicNavigation/PublicNavigation';
import AuthenticatedNavigation from '../AuthenticatedNavigation/AuthenticatedNavigation';
import NavItem from '../NavItem/NavItem';

import './Navigation.scss';

const Navigation = props => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
    {/* <Navbar bsClass="navbar navbar-dark bg-dark"> */}
    {/* https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Navbar.js */}
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">{props.t('AppNameFull')}</Link>
      </Navbar.Brand>
      {/* <Navbar.Toggle/> */}
      <button className="sr-only navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </Navbar.Header>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    {/* <Navbar.Collapse> */}
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav ml-auto ">
        <LinkContainer className="nav-item" anchorClassName="nav-link" to="/sandbox">
          <NavItem eventKey={1.1} href="/sandbox">Sandbox</NavItem>
        </LinkContainer>
        <LinkContainer className="nav-item" anchorClassName="nav-link" to="/subscriptions">
          <NavItem eventKey={1.2} href="/subscriptions">Mis alertas</NavItem>
        </LinkContainer>
        <LinkContainer className="nav-item" anchorClassName="nav-link" to="/fires">
          <NavItem eventKey={2} href="/fires">{props.t('activeFires')}</NavItem>
        </LinkContainer>
      </ul>
      {!props.authenticated ? <PublicNavigation /> : <AuthenticatedNavigation {...props} />}
      {/* </Navbar.Collapse> */}
    </div>
    </div>
  </nav>
);

Navigation.defaultProps = {
  name: ''
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default translate([], { wait: true })(Navigation);
