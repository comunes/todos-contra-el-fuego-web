import React from 'react';
import { Circle } from 'react-leaflet';
import PropTypes from 'prop-types';
import FirePopup from './FirePopup';

const FireCircleMark = ({
  lat,
  lon,
  nasa,
  scan,
  id,
  when,
  history,
  t
}) => (
  <Circle center={[lat, lon]} color="red" stroke={false} fillOpacity="1" fill radius={scan * 1000}>
    <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
  </Circle>
);

FireCircleMark.propTypes = {
  scan: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  nasa: PropTypes.bool.isRequired,
  id: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date).isRequired,
  t: PropTypes.func.isRequired
};

export default FireCircleMark;
