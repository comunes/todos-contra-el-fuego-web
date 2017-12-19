/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Trans, translate } from 'react-i18next';
import { Bert } from 'meteor/themeteorchef:bert';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import SelectionMap from '/imports/ui/components/SelectionMap/SelectionMap';
import Loading from '../../components/Loading/Loading';
import './Subscriptions.scss';

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.state = {
      edit: false
    };
    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.onFstBtn = this.onFstBtn.bind(this);
    this.onSndBtn = this.onSndBtn.bind(this);
  }

  onFstBtn() {
    console.log(this.state);
    this.props.history.push(`${this.props.match.url}/new`, { center: this.state.center, zoom: this.state.zoom });
  }

  onSndBtn() {
    this.state.edit = true;
  }

  onViewportChanged(viewport) {
    this.state.center = viewport.center;
    this.state.zoom = viewport.zoom;
  }

  handleRemove(subscriptionId) {
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('subscriptions.remove', subscriptionId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Subscription deleted!', 'success');
        }
      });
    }
  }

  render() {
    const {
      loading,
      t,
      subscriptions,
      match,
      history
    } = this.props;
    return (!loading ? (
      <div className="Subscriptions">
        <div className="page-header clearfix">
          <h4 className="pull-left"><Trans>Suscripciones a fuegos en zonas de mi interés</Trans></h4>
          <Link className="btn btn-success pull-right" to={`${match.url}/new`}><Trans>Añadir zona</Trans></Link>
        </div>
        <br />
        <SelectionMap
            center={[null, null]}
            zoom={11}
            readOnly
            edit={this.state.edit}
            fstBtn={t('Añadir zona')}
            onFstBtn={state => this.onFstBtn(state)}
            sndBtn={this.props.subscriptions.length > 1 ? t('Editar') : null}
            onSndBtn={() => this.onSndBtn()}
            onViewportChanged={viewport => this.onViewportChanged(viewport)}
            loadingSubs={this.props.loading}
            currentSubs={this.props.subscriptions}
        />
        {subscriptions.length ?
         <Table responsive>
           <thead>
             <tr>
               <th><Trans>Lugar</Trans></th>
               <th><Trans>Actualizado</Trans></th>
               <th><Trans>Creado</Trans>
               </th>
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
                  <td>{timeago(createdAt)}</td>
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
                        onClick={() => this.handleRemove(_id)}
                        block
                    >Delete
                    </Button>
                  </td>
                </tr>
              ))}
           </tbody>
         </Table> :
         <Alert bsStyle="warning"><Trans>No estás suscrito a fuegos en ninguna zona</Trans></Alert>
        }
      </div>
    ) : <Loading />);
  }
}

Subscriptions.propTypes = {
  loading: PropTypes.bool.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
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
