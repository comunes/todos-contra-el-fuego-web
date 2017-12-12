import React from 'react';
import { Circle } from 'react-leaflet';
import PropTypes from 'prop-types';

const FireCircleMark = ({
  lat,
  lon,
  scan
}) => (
  <Circle center={[lat, lon]} color="red" stroke={false} fillOpacity="1" fill radius={scan * 1000} />
);

FireCircleMark.propTypes = {
  scan: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired
};

export default FireCircleMark;
