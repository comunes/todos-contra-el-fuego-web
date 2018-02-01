/* eslint-disable import/no-absolute-path */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
/* import { Nav, NavDropdown } from 'react-bootstrap'; */
import { translate, Trans } from 'react-i18next';
import { testId } from '/imports/ui/components/Utils/TestUtils';

/*
   FIXME:
   navitem needs a nav-link class but does not works
   https://github.com/react-bootstrap/react-bootstrap/issues/2644
   className="nav-link"
   so we did a custom NavLink
 */
import NavItem from '../NavItem/NavItem';

const AuthenticatedNavigation = ({ name, history, props }) => (
  <ul className="navbar-nav">
    {/* <Nav pullRight> */}
    {/* <LinkContainer className="nav-item" anchorClassName="nav-link" to="/documents">
    <NavItem eventKey={5} href="/documents">Documents</NavItem>
    </LinkContainer> */}
    {/* <LinkContainer className="nav-item" anchorClassName="nav-link" to="/subscriptions">
    <NavItem eventKey={5} href="/subscriptions"><Trans>Mis alertas</Trans></NavItem>
    </LinkContainer> */}
    <LinkContainer id={testId('profile')} className="nav-item" anchorClassName="nav-link" to="/profile">
      <NavItem eventKey={5.1} href="/profile">{name}</NavItem>
    </LinkContainer>
    <LinkContainer id={testId('logout')} className="nav-item" anchorClassName="nav-link" to="/logout">
      <NavItem eventKey={5.2} onClick={() => history.push('/logout')} href="/logout"><Trans i18nKey="Cerrar sesión">Cerrar sesión</Trans></NavItem>
    </LinkContainer>
    {/* </Nav> */}
  </ul>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired
};

export default translate([], { wait: true })(withRouter(AuthenticatedNavigation));
