import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Subscriptions from '../../../api/Subscriptions/Subscriptions';
import SubscriptionEditor from '../../components/SubscriptionEditor/SubscriptionEditor';
import NotFound from '../NotFound/NotFound';

const EditSubscription = ({ doc, history }) => (doc ? (
  <div className="EditSubscription">
    <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
    <SubscriptionEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

EditSubscription.defaultProps = {
  doc: null
};

EditSubscription.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired
};

export default withTracker(({ match }) => {
  const subscriptionId = match.params._id;
  const subscription = Meteor.subscribe('subscriptions.view', subscriptionId);

  return {
    loading: !subscription.ready(),
    doc: Subscriptions.findOne(new Meteor.Collection.ObjectID(subscriptionId))
  };
})(EditSubscription);
