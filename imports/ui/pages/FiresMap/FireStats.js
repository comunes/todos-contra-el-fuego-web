/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import FromNow from '/imports/ui/components/FromNow/FromNow';

class FireStats extends Component {
  render() {
    return (
      <Fragment>
        { this.props.lastCheck && this.props.lastFireDetected ?
          <Trans>Actualizado <FromNow when={this.props.lastCheck} />, último fuego detectado <FromNow when={this.props.lastFireDetected.when} />.</Trans>
          : '' }
      </Fragment>
    );
  }
}

FireStats.propTypes = {
  lastFireDetected: PropTypes.object,
  lastCheck: PropTypes.instanceOf(Date)
};

FireStats.defaultProps = {
};

export default translate([], { wait: true })(FireStats);
