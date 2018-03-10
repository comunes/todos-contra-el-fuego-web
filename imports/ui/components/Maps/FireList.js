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
    fires, scale, useMarkers, nasa, t, history, falsePositives, industries, neighbour
  } = props;
  const useMarks = useMarkers && scale;
  const usePixel = !nasa || !scale;
  /* console.log(`Using marks: ${useMarks}, using pixels: ${usePixel}`); */
  let items;
  if (useMarks) {
    items = fires.map(({ _id, ...otherProps }) => (<FireIconMark t={t} history={history} id={_id} key={_id} nasa={nasa} neighbour={neighbour} falsePositives={falsePositives} industries={industries} {...otherProps} />));
  } else if (usePixel && !falsePositives && !industries) {
    items = fires.map(({ _id, ...otherProps }) => (<FirePixel t={t} key={_id} id={_id} history={history} nasa={nasa} {...otherProps} />));
  } else if (!falsePositives && !industries) {
    items = fires.map(({ _id, ...otherProps }) => (<FireCircleMark t={t} history={history} id={_id} key={_id} nasa={nasa} {...otherProps} />));
  }
  return (<div style={{ display: 'none' }}>{items}</div>);
}

FireList.propTypes = {
  fires: PropTypes.array.isRequired,
  scale: PropTypes.bool.isRequired,
  useMarkers: PropTypes.bool.isRequired,
  nasa: PropTypes.bool.isRequired,
  falsePositives: PropTypes.bool.isRequired,
  industries: PropTypes.bool.isRequired,
  neighbour: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
