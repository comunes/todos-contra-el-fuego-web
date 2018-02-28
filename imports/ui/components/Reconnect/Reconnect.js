/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Blaze from 'meteor/gadicc:blaze-react-component';

class Reconnect extends Component {
  render() {
    const { t, authenticated } = this.props;
    // console.log(`Reconnect ${!authenticated ? 'enabled' : 'disabled'}`);
    return (
      <Fragment>
        { !authenticated &&
        <Blaze
          template="meteorStatus"
          textDisconnect={t('Desconectado del servidor, reconectando en %delay% segundos.')}
          textConnecting={t('Desconectado del servidor, reconectando...')}
          linkText={t('Reintentar ahora')}
        /> }
      </Fragment>
    );
  }
}

Reconnect.propTypes = {
  t: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired
};

Reconnect.defaultProps = {
};

export default translate([], { wait: true })(Reconnect);

if (!Meteor.isProduction) {
  // We clear the console on disconnect during development
  Tracker.autorun(() => {
    if (Meteor.status().status === 'waiting') {
      // console.clear();
    }
  });
}
