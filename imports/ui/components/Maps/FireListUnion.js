/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import FirePolygonMark from '/imports/ui/components/Maps/FirePolygonMark';

export default function FireListUnion(props) {
  const {
    firesUnion, nasa, t, history
  } = props;
  /* console.log(`Using marks: ${useMarks}, using pixels: ${usePixel}`); */
  const items = firesUnion.map(({ _id, ...otherProps }) => (<FirePolygonMark t={t} history={history} id={_id} key={_id} nasa={nasa} {...otherProps} />));
  return (<div style={{ display: 'none' }}>{items}</div>);
}

FireListUnion.propTypes = {
  firesUnion: PropTypes.array.isRequired,
  nasa: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
