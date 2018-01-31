/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';

class TestError extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.state = {
    };
  }

  render() {
    throw new Error('Just testing');
    return (
      <div />
    );
  }
}

TestError.propTypes = {
  t: PropTypes.func.isRequired
};

TestError.defaultProps = {
};

// export default translate([], { wait: true })(TestError);
export default translate([], { wait: true })(withTracker(props => ({
  // props.something
}))(TestError));
