/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Row } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Trans, translate } from 'react-i18next';
import { Bert } from 'meteor/themeteorchef:bert';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import Loading from '../../components/Loading/Loading';

import './Subscriptions.scss';

const handleRemove = (subscriptionId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('subscriptions.remove', subscriptionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Subscription deleted!', 'success');
      }
    });
  }
};

const Subscriptions = ({
  loading,
  subscriptions,
  match,
  history
}) => (!loading ? (
  <div className="Subscriptions">
    <div className="page-header clearfix">
      <h4 className="pull-left"><Trans>Suscripciones a fuegos en áreas de mi interés</Trans></h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}><Trans>Añadir suscripción</Trans></Link>
    </div>
    <br />
    {subscriptions.length ?
     <Table responsive>
       <thead>
         <tr>
           <th>Location</th>
           <th>Last Updated</th>
           <th>Created</th>
           <th />
           <th />
         </tr>
       </thead>
       <tbody>
         {subscriptions.map(({
            _id,
            location,
            createdAt,
            updatedAt
          }) => (
            <tr key={_id}>
              <td>{location.lat},{location.lon}</td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td>
                <Button
                    bsStyle="primary"
                    onClick={() => history.push(`${match.url}/${_id}`)}
                    block
                >View
                </Button>
              </td>
              <td>
                <Button
                    bsStyle="danger"
                    onClick={() => handleRemove(_id)}
                    block
                >Delete
                </Button>
              </td>
            </tr>
          ))}
       </tbody>
     </Table> :
     <Alert bsStyle="warning"><Trans>Todavía sin suscriptiones</Trans></Alert>
    }
  </div>
) : <Loading />);

Subscriptions.propTypes = {
  loading: PropTypes.bool.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};


export default translate([], { wait: true })(withTracker(() => {
  const subscription = Meteor.subscribe('mysubscriptions');
  // console.log(UserSubsToFiresCollection.find().fetch());
  return {
    loading: !subscription.ready(),
    subscriptions: UserSubsToFiresCollection.find({ owner: Meteor.userId() }).fetch()
  };
})(Subscriptions));
