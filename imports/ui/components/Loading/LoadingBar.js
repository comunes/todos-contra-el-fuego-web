/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Line } from 'react-progress-bar.js';

import './LoadingBar.scss';

// Check: https://github.com/kimmobrunfeldt/react-progressbar.js/pull/26
const LoadingBar = ({ progress }) => (
  <div className="loading-bar">
    <Line
      progress={Meteor.status().status !== 'connected' ? Meteor.status().retryCount / 10 : progress}
      options={{ strokeWidth: 2, color: '#5A7636' }}
      initialAnimate
    />
  </div>
);

export default LoadingBar;

LoadingBar.propTypes = {
  progress: PropTypes.number.isRequired
};
