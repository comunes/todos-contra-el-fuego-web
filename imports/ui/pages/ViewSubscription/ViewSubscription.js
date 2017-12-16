import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Subscriptions from '../../../api/Subscriptions/Subscriptions';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (subscriptionId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('subscriptions.remove', subscriptionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Subscription deleted!', 'success');
        history.push('/subscriptions');
      }
    });
  }
};

const renderSubscription = (doc, match, history) => (doc ? (
  <div className="ViewSubscription">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.body }
  </div>
) : <NotFound />);

const ViewSubscription = ({
  loading,
  doc,
  match,
  history
}) => (
  !loading ? renderSubscription(doc, match, history) : <Loading />
);

ViewSubscription.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default createContainer(({ match }) => {
  const subscriptionId = match.params._id;
  const subscription = Meteor.subscribe('subscriptions.view', subscriptionId);

  return {
    loading: !subscription.ready(),
    doc: Subscriptions.findOne(subscriptionId)
  };
}, ViewSubscription);
