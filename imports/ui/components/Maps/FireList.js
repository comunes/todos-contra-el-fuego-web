/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import FireCircleMark from '/imports/ui/components/Maps/FireCircleMark';
import FireIconMark from '/imports/ui/components/Maps/FireIconMark';
import FirePixel from '/imports/ui/components/Maps/FirePixel';

export default function FireList(props) {
  const {
    fires, scale, useMarkers, nasa
  } = props;
  const useMarks = useMarkers && scale;
  const usePixel = !nasa || !scale;
  /* console.log(`Using marks: ${useMarks}, using pixels: ${usePixel}`); */
  let items;
  if (useMarks) {
    items = fires.map(({ _id, ...otherProps }) => (<FireIconMark key={_id} nasa={nasa} {...otherProps} />));
  } else if (usePixel) {
    items = fires.map(({ _id, ...otherProps }) => (<FirePixel key={_id} nasa={nasa} {...otherProps} />));
  } else {
    items = fires.map(({ _id, ...otherProps }) => (<FireCircleMark key={_id} nasa={nasa} {...otherProps} />));
  }
  return (<div style={{ display: 'none' }}>{items}</div>);
}

FireList.propTypes = {
  fires: PropTypes.array.isRequired,
  scale: PropTypes.bool.isRequired,
  useMarkers: PropTypes.bool.isRequired,
  nasa: PropTypes.bool.isRequired
};
