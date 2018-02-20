/* eslint-disable import/no-absolute-path */
import React, { Fragment } from 'react';
import { Tooltip } from 'react-leaflet';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

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
