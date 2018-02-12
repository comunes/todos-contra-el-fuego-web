import React from 'react';
import { Meteor } from 'meteor/meteor';
import Icon from '../../components/Icon/Icon';
import { translate, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet';

import './Logout.scss';

class Logout extends React.Component {
  componentDidMount() {
    Meteor.logout();
  }

  render() {
    return (
      <div className="Logout">
        <Helmet>
          <title>{this.props.t('AppName')}: {this.props.t('Cerrar sesión')}</title>
        </Helmet>
        <h1><Trans parent="span">Gracias por Participar</Trans></h1>
        <p><Trans parent="span">También puedes seguirnos en la web</Trans></p>
        <ul className="FollowUsElsewhere">
          <li><a href="https://twitter.com/TsContraElFuego"><Icon icon="twitter" /></a></li>
          <li><a href="https://github.com/comunes/todos-contra-el-fuego"><Icon icon="github" /></a></li>
        </ul>
      </div>
    );
  }
}

Logout.propTypes = {};

export default translate([], { wait: true })(Logout);
