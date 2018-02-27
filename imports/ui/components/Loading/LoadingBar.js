/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-progressbar.js';

import './LoadingBar.scss';

// Check: https://github.com/kimmobrunfeldt/react-progressbar.js/pull/26
const LoadingBar = ({ progress }) => (
  <div className="loading-bar">
    <Line
      progress={progress}
      options={{ strokeWidth: 2, color: '#5A7636' }}
      initialAnimate
    />
  </div>
);

export default LoadingBar;

LoadingBar.propTypes = {
  progress: PropTypes.number.isRequired
};
