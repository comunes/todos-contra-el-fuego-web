/* eslint-disable react/jsx-indent-props */

import React from 'react';
import { CircleMarker } from 'react-leaflet';
import PropTypes from 'prop-types';
import FirePopup from './FirePopup';
import { translate } from 'react-i18next';

/* Less acurate (1 pixel per fire) but faster */
const FirePixel = ({
  lat, lon, nasa, id, when, t, history
}) => (
  <CircleMarker
      center={[lat, lon]}
      color={nasa ? 'red' : '#D35400'}
      stroke={false}
      fillOpacity="1"
      fill
      radius={nasa ? 1 : 2}
  >
    <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
  </CircleMarker>
);


FirePixel.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  id: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date),
  nasa: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(FirePixel);
