import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';
import { translate } from 'react-i18next';
/*
   FIXME:
   navitem needs a nav-link class but does not works
   https://github.com/react-bootstrap/react-bootstrap/issues/2644
   className="nav-link"
   so we did a custom NavLink
 */
import NavItem from '../NavItem/NavItem';

const PublicNavigation = (props) => (
  <ul className="navbar-nav ml-auto ">
  {/* <Nav pullRight> */}
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/sandbox">
      <NavItem href="/sandbox">Sandbox</NavItem>
    </LinkContainer>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/fires">
      <NavItem href="/fires">{props.t('activeFires')}</NavItem>
    </LinkContainer>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/signup">
      <NavItem eventKey={1} href="/signup">{props.t('Registrarse')}</NavItem>
    </LinkContainer>
    <LinkContainer className="nav-item" anchorClassName="nav-link" to="/login">
      <NavItem eventKey={2} href="/login">{props.t('Iniciar sesión')}</NavItem>
    </LinkContainer>
  {/* </Nav> */}
  </ul>
);

export default translate([], { wait: true })(PublicNavigation);
