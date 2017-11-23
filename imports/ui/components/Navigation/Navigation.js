import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PublicNavigation from '../PublicNavigation/PublicNavigation';
import AuthenticatedNavigation from '../AuthenticatedNavigation/AuthenticatedNavigation';
import { translate } from 'react-i18next';

import './Navigation.scss';

const Navigation = props => (
  <ul className="nav justify-content-end">
    <li className="nav-item">
      <a className="nav-link active" href="/#">{props.t('Inicio')}</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#">{props.t('Mapa actual')}</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#">{props.t('Contacto')}</a>
    </li>
    <li className="nav-item dropdown">
      <a className="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {props.t('Más')}
        <div className="ripple-container"></div>
      </a>
      {!props.authenticated ? <PublicNavigation /> : <AuthenticatedNavigation {...props} />}
    </li>
  </ul>


);

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

//  export default Navigation;

export default translate([], { wait: true })(Navigation);
