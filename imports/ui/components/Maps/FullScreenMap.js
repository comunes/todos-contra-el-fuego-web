/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import FullscreenControl from 'react-leaflet-fullscreen';
import 'react-leaflet-fullscreen/dist/styles.css';

class FullScreenMap extends Component {
  render() {
    const { t } = this.props;
    return (
      <FullscreenControl
          position="topleft"
          title={t('Pantalla completa')}
          titleCancel={t('Salir de pantalla completa')}
      />
    );
  }
}

FullScreenMap.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(FullScreenMap);
