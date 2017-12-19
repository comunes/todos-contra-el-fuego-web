import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import SubscriptionEditor from '../../components/SubscriptionEditor/SubscriptionEditor';

const NewSubscription = ({ history }) => (
  <div className="NewSubscription">
    <h4 className="page-header"><Trans>Nueva zona</Trans></h4>
    <SubscriptionEditor history={history} />
  </div>
);

NewSubscription.propTypes = {
  history: PropTypes.object.isRequired
};

export default translate([], { wait: true })(NewSubscription);
