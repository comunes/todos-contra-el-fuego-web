/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import FireCircleMark from '/imports/ui/components/Maps/FireCircleMark';
import FireIconMark from '/imports/ui/components/Maps/FireIconMark';
import FirePixel from '/imports/ui/components/Maps/FirePixel';

const FireList = ({
  fires,
  scale,
  useMarkers,
  nasa }) => {
    const items = fires.map(({ _id, ...props }) => (
      (useMarkers && scale) ?
        <FireIconMark key={_id} nasa={nasa} {...props} /> :
      (!nasa && !scale) ?
      <FirePixel key={_id} nasa={nasa} {...props} /> :
      <FireCircleMark key={_id} nasa={nasa} {...props} />));
    return <div style={{ display: 'none' }}>{items}</div>;
  };

FireList.propTypes = {
  fires: PropTypes.array.isRequired,
  scale: PropTypes.bool.isRequired,
  useMarkers: PropTypes.bool.isRequired,
  nasa: PropTypes.bool.isRequired
};

export default FireList;
