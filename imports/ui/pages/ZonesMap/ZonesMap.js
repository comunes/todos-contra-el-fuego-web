/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import SubscriptionsMap from '/imports/ui/pages/Subscriptions/SubscriptionsMap';

export default class ZonesMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <SubscriptionsMap {...this.props} />
      </div>
    );
  }
}

ZonesMap.propTypes = {
};

ZonesMap.defaultProps = {
};
