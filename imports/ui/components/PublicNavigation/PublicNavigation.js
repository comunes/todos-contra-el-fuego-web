import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';
/*
   FIXME:
   navitem needs a nav-link class but does not works
   https://github.com/react-bootstrap/react-bootstrap/issues/2644
   className="nav-link"
   so we did a custom NavLink
 */
import NavItem from '../NavItem/NavItem';

const PublicNavigation = () => (
  <Nav pullRight>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/signup">
      <NavItem eventKey={1} href="/signup">Sign Up</NavItem>
    </LinkContainer>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/login">
      <NavItem eventKey={2} href="/login">Log In</NavItem>
    </LinkContainer>
  </Nav>
);

export default PublicNavigation;
