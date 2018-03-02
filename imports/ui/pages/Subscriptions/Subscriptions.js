/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Trans, translate } from 'react-i18next';
import { Bert } from 'meteor/themeteorchef:bert';
import { Helmet } from 'react-helmet';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import SelectionMap, { action } from '/imports/ui/components/SelectionMap/SelectionMap';
import confirm from '/imports/ui/components/Prompt/Confirm';
import Loading from '../../components/Loading/Loading';
import './Subscriptions.scss';

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    const received = props.location.state;
    if (received && received.location && received.location.lat && received.location.lon && received.distance) {
      props.history.push(`${this.props.match.url}/new`, {
        location: received.location,
        distance: received.distance,
        center: [received.location.lat, received.location.lon]
      });
    }
    this.state = {};
    this.state.action = action.view;
    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.onFstBtn = this.onFstBtn.bind(this);
    this.onSndBtn = this.onSndBtn.bind(this);
  }

  onFstBtn() {
    // console.log(this.state);
    if (this.state.action === action.view) {
      this.props.history.push(`${this.props.match.url}/new`, { center: this.state.center, zoom: this.state.zoom });
    } else if (this.state.action === action.edit) {
      this.setState({ action: action.view });
    }
  }

  onSndBtn() {
    this.setState({ action: action.edit });
  }

  onViewportChanged(viewport) {
    this.state.center = viewport.center;
    this.state.zoom = viewport.zoom;
  }

  handleRemove(subscriptionId) {
    const { t, subscriptions } = this.props;
    confirm(t('Dejarás de recibir notificaciones de fuegos en esa área ¿Estás seguro/a? '), { okBtn: t('Sí'), cancelBtn: t('No') }).then(
      () => {
        // `proceed` callback
        const num = subscriptions.length;
        Meteor.call('subscriptions.remove', subscriptionId, (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert(t('Desuscrito'), 'success');
            if (num === 1) { // it was 1, now deleted
              this.setState({ action: action.view });
            }
          }
        });
      },
      () => {
        // `cancel` callback
      }
    );
  }

  render() {
    const {
      loading,
      t,
      subscriptions,
      maxDistance
    } = this.props;
    const firstBtnTitle = ['Añadir zona', '', 'Terminar']; // view, add, edit
    return (!loading ? (
      <div className="Subscriptions">
        <Helmet>
          <title>{t('AppName')}: {t('Suscripciones a alertas de fuegos en zonas de mi interés')}</title>
        </Helmet>
        <h4 className="page-header"><Trans>Suscripciones a alertas de fuegos en zonas de mi interés</Trans></h4>
      { subscriptions.length === 0 ?
        <Alert bsStyle="warning"><Trans>No estás suscrito a fuegos en ninguna zona</Trans></Alert> :
        <Alert bsStyle="success"><Trans>En verde, áreas de las que recibirás alertas de fuegos</Trans></Alert>
      }
        { maxDistance && maxDistance.distance > 20 &&
          <Alert bsStyle="warning"><Trans>Estás subscrito a una zona muy grande</Trans></Alert>
        }
        <br />
        <SelectionMap
            center={[null, null]}
            zoom={11}
            action={this.state.action}
            fstBtn={t(firstBtnTitle[this.state.action])}
            onFstBtn={state => this.onFstBtn(state)}
            sndBtn={this.state.action === action.view && this.props.subscriptions.length >= 1 ? t('Editar') : null}
            onSndBtn={() => this.onSndBtn()}
            onViewportChanged={viewport => this.onViewportChanged(viewport)}
            loadingSubs={this.props.loading}
            currentSubs={this.props.subscriptions}
            onRemove={(id) => { this.handleRemove(id); }}
            disableFstBtn={false}
        />
      </div>
    ) : <Loading />);
  }
}

Subscriptions.propTypes = {
  loading: PropTypes.bool.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  maxDistance: PropTypes.object,
  location: PropTypes.object
};

export default translate([], { wait: true })(withTracker(() => {
  const subscription = Meteor.subscribe('mysubscriptions');
  // console.log(UserSubsToFiresCollection.find().fetch());
  return {
    loading: !subscription.ready(),
    subscriptions: UserSubsToFiresCollection.find({ owner: Meteor.userId() }).fetch(),
    maxDistance: UserSubsToFiresCollection.findOne({ owner: Meteor.userId() }, { sort: { distance: -1 } })
  };
})(Subscriptions));
