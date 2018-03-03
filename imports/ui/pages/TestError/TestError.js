/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';

class TestError extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    throw new Error('Just testing');
  }

  render() {
    return (
      <div />
    );
  }
}

TestError.propTypes = {
};

TestError.defaultProps = {
};

export default TestError;
