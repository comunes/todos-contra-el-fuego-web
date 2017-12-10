import React from 'react';
// import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

class Sandbox extends React.Component {
  constructor(props) {
    super(props);
    /* this.state = {
     *   init: false
     * }; */
  }

  componentDidMount() {
    // this.setState({init: true});
  }

  render() {
    return (
      <div></div>
    );
  }
}

Sandbox.propTypes = {
  // history: PropTypes.object.isRequired
};

export default translate([], { wait: true }) (Sandbox);
