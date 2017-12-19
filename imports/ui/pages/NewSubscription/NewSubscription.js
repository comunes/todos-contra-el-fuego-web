/* eslint-disable react/jsx-indent-props */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import SubscriptionEditor from '../../components/SubscriptionEditor/SubscriptionEditor';

class NewSubscription extends Component {
  constructor(props) {
    super(props);
    const pushState = this.props.location.state;
    this.state = {
      center: pushState ? pushState.center : [null, null],
      zoom: pushState ? pushState.zoom : null
    };
  }

  render() {
    const { history } = this.props;
    return (
      <div className="NewSubscription">
        <h4 className="page-header"><Trans>Nueva zona</Trans></h4>
        <SubscriptionEditor
            history={history}
            center={this.state.center}
            zoom={this.state.zoom}
        />
      </div>
    );
  }
}

NewSubscription.defaultProps = {
};

NewSubscription.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object
};

export default translate([], { wait: true })(NewSubscription);
