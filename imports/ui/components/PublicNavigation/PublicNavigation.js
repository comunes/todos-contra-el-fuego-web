/* eslint-disable import/no-absolute-path */
import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
/* import { Nav } from 'react-bootstrap'; */
import { translate } from 'react-i18next';
import { testId } from '/imports/ui/components/Utils/TestUtils';

/*
   FIXME:
   navitem needs a nav-link class but does not works
   https://github.com/react-bootstrap/react-bootstrap/issues/2644
   className="nav-link"
   so we did a custom NavLink
 */
import NavItem from '../NavItem/NavItem';

const PublicNavigation = props => (
  <ul className="navbar-nav">
    {/* <Nav pullRight> */}
    <LinkContainer id={testId('signup')} className="nav-item" anchorClassName="nav-link" to="/signup">
      <NavItem eventKey={3} href="/signup">{props.t('Registrarse')}</NavItem>
    </LinkContainer>
    <LinkContainer id={testId('login')} className="nav-item" anchorClassName="nav-link" to="/login">
      <NavItem eventKey={4} href="/login">{props.t('Iniciar sesión')}</NavItem>
    </LinkContainer>
    {/* </Nav> */}
  </ul>
);

PublicNavigation.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(PublicNavigation);
