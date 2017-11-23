import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

const PublicNavigation = () => (
  <div className="dropdown-menu dropdown-menu-right">
    <a className="dropdown-item" href="/signup">Sign Up</a>
    <a className="dropdown-item" href="/login">Log In</a>
  </div>
);

export default PublicNavigation;
