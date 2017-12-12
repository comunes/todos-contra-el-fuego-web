/* eslint-disable import/no-absolute-path */
import React from 'react';
import { CircleMarker, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';
import { fireIcon, nFireIcon } from '/imports/ui/components/Maps/Icons';

const FireIconMark = ({
  lat,
  lon,
  nasa
}) => (
  <div>
    <Marker position={[lat, lon]} icon={nasa ? fireIcon : nFireIcon} />
    <CircleMarker center={[lat, lon]} color={nasa ? 'red' : '#D35400'} stroke={false} fillOpacity="1" fill radius={1} />
  </div>
);

FireIconMark.propTypes = {
  // https://github.com/PaulLeCam/react-leaflet/tree/master/src/propTypes
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  nasa: PropTypes.bool.isRequired
};

export default FireIconMark;
