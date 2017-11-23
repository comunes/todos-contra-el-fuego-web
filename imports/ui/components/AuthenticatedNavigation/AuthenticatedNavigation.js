import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const AuthenticatedNavigation = ({ name, history }) => (
  <div>
    {/*
    https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Nav.js
    <Nav>
      <LinkContainer to="/documents">
        <NavItem href="/documents">Documents</NavItem>
      </LinkContainer>
</Nav> */}
    <div title={name} className="dropdown-menu dropdown-menu-right">
      <a className="dropdown-item" href="/profile">Profile</a>
      <a className="dropdown-item" onClick={() => history.push('/logout')} >Logout</a>
    </div>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withRouter(AuthenticatedNavigation);
