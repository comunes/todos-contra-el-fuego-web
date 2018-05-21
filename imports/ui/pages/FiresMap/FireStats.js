/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import FromNow from '/imports/ui/components/FromNow/FromNow';

class FireStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastFireDetected: props.lastFireDetected,
      lastCheck: props.lastCheck,
      loadingAll: props.loadingAll
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lastCheck !== nextProps.lastCheck ||
        this.props.lastFireDetected !== nextProps.lastFireDetected ||
        this.props.loadingAll !== nextProps.loadingAll
    ) {
      this.setState({
        lastFireDetected: nextProps.lastFireDetected,
        lastCheck: nextProps.lastCheck,
        loadingAll: nextProps.loadingAll
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextState.lastCheck === this.state.lastCheck &&
             nextState.lastFireDetected === this.state.lastFireDetected &&
             nextState.loadingAll === this.state.loadingAll);
  }

  render() {
    if (this.state.loadingAll) return (<Fragment><br /><em><Trans>Actualizando...</Trans></em></Fragment>);
    if (this.state.lastCheck && !this.state.lastFireDetected) {
      return (<Fragment><br /><Trans>Actualizado <FromNow when={this.state.lastCheck} />.</Trans></Fragment>);
    }
    if (this.state.lastCheck && this.state.lastFireDetected) {
      return (<Fragment><br /><Trans>Actualizado <FromNow when={this.state.lastCheck} />, último fuego detectado <FromNow when={this.state.lastFireDetected.when} />.</Trans></Fragment>);
    }
    return (<Fragment />);
  }
}

FireStats.propTypes = {
  lastFireDetected: PropTypes.object,
  loadingAll: PropTypes.bool.isRequired,
  lastCheck: PropTypes.instanceOf(Date)
};

FireStats.defaultProps = {
};

export default translate([], { wait: true })(FireStats);
