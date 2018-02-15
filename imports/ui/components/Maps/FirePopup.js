/* eslint-disable import/no-absolute-path */
import React, { Fragment } from 'react';
import { Popup, Tooltip } from 'react-leaflet';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';

const FirePopup = ({
  lat,
  lon,
  nasa,
  id,
  history,
  when,
  t
}) => (
  <Fragment>
    <Popup className="fire-popup">
      <Fragment>
        <span>{t('Coordenadas:')} {lat}, {lon}</span><br />
        {nasa && <Fragment><span>{t('Fuente')}: {t(nasa ? 'NASA' : 'nuestros usuarios/as')}</span><br /></Fragment> }
        {when && <Fragment><span>{t('Detectado')}: {moment(when).fromNow()}</span><br /></Fragment> }
        <span>
          { /* if nasa === null means that the is a false positive fire */ }
          <a href="#" onClick={() => history.push(`/fire/${nasa ? 'active' : 'alert'}/${id}`)}>{t('Más información sobre este fuego')}</a>
        </span>
      </Fragment>
    </Popup>
    <Tooltip><Fragment>{t('Pulsa para más información')}</Fragment></Tooltip>
  </Fragment>
);

FirePopup.propTypes = {
  // https://github.com/PaulLeCam/react-leaflet/tree/master/src/propTypes
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  nasa: PropTypes.bool,
  id: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date),
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(FirePopup);
