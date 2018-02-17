/* eslint-disable import/no-absolute-path */
import React, { Fragment } from 'react';
import { CircleMarker, Marker, Tooltip } from 'react-leaflet';
import PropTypes from 'prop-types';
import { fireIcon, nFireIcon, industryIcon } from '/imports/ui/components/Maps/Icons';
import { translate } from 'react-i18next';
import FirePopup from './FirePopup';

const FireIconMark = ({
  lat,
  lon,
  nasa,
  id,
  history,
  falsePositives,
  when,
  t
}) => (
  <div>
    { !falsePositives &&
      <Marker position={[lat, lon]} icon={nasa ? fireIcon : nFireIcon}>
        <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
      </Marker> }
    { falsePositives &&
      <Marker position={[lat, lon]} icon={industryIcon}>
        <Tooltip><Fragment>{t('Es una industria')}</Fragment></Tooltip>
        { /* disabled because was a past fire (and can be marked multiple times) */ false && <FirePopup t={t} history={history} id={id} lat={lat} lon={lon} /> }
      </Marker>
    }
    { !falsePositives &&
      <CircleMarker center={[lat, lon]} color={nasa ? 'red' : '#D35400'} stroke={false} fillOpacity="1" fill radius={1}>
        <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
      </CircleMarker> }
  </div>
);

FireIconMark.propTypes = {
  // https://github.com/PaulLeCam/react-leaflet/tree/master/src/propTypes
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  nasa: PropTypes.bool,
  falsePositives: PropTypes.bool.isRequired,
  id: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date),
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(FireIconMark);
