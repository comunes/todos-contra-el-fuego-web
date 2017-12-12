import React from 'react';
import { CircleMarker } from 'react-leaflet';
import PropTypes from 'prop-types';

/* Less acurate (1 pixel per fire) but faster */
const FirePixel = ({ lat, lon, nasa }) => (
  <CircleMarker center={[lat, lon]} color={nasa ? 'red' : '#D35400'} stroke={false} fillOpacity="1" fill radius={2} />
);


FirePixel.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  nasa: PropTypes.bool.isRequired
};

export default FirePixel;
