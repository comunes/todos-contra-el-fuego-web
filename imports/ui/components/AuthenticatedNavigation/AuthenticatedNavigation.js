import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavDropdown } from 'react-bootstrap';
/*
   FIXME:
   navitem needs a nav-link class but does not works
   https://github.com/react-bootstrap/react-bootstrap/issues/2644
   className="nav-link"
   so we did a custom NavLink
 */
import NavItem from '../NavItem/NavItem';

import { Meteor } from 'meteor/meteor';

const AuthenticatedNavigation = ({ name, history }) => (
  <Nav pullRight>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/documents">
      <NavItem eventKey={1} href="/documents">Documents</NavItem>
    </LinkContainer>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/profile">
      <NavItem eventKey={2.1} href="/profile">{name}</NavItem>
    </LinkContainer>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/logout">
      <NavItem eventKey={2.2} onClick={() => history.push('/logout')} href="/logout">Logout</NavItem>
    </LinkContainer>
  </Nav>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withRouter(AuthenticatedNavigation);
