/* eslint-disable import/no-absolute-path */
import React from 'react';
// import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

class Sandbox extends React.Component {
  componentDidMount() {
    // this.setState({init: true});
  }

  render() {
    return (
      <div>
        <div />
      </div>
    );
  }
}

Sandbox.propTypes = {
  // history: PropTypes.object.isRequired
};

export default translate([], { wait: true })(Sandbox);
