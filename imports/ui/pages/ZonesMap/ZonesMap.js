/* eslint-disable import/no-absolute-path */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import SubscriptionsMap from '/imports/ui/pages/Subscriptions/SubscriptionsMap';

class ZonesMap extends React.Component {
  constructor(props) {
    super(props);
    this.t = props.t;
  }

  render() {
    return (
      <Fragment>
        <SubscriptionsMap {...this.props} />
      </Fragment>
    );
  }
}

ZonesMap.propTypes = {
  history: PropTypes.object.isRequired
};

export default translate([], { wait: true })(ZonesMap);
