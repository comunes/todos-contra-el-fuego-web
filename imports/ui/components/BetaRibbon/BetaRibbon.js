/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import './BetaRibbon.scss';

class BetaRibbon extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.state = {
    };
  }

  render() {
    return (
      <div className="ribbon"><span>BETA</span></div>
    );
  }
}

BetaRibbon.propTypes = {
  t: PropTypes.func.isRequired
};

BetaRibbon.defaultProps = {
};

export default translate([], { wait: true })(BetaRibbon);
