/* eslint-disable max-len, no-return-assign */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import FireSubscription from '/imports/ui/pages/FireSubscription/FireSubscription';
import { translate } from 'react-i18next';
import { isAnyMobile } from '/imports/ui/components/Utils/isMobile';

class SubscriptionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: props.center || [null, null],
      zoom: props.zoom || null,
      disableFstBtn: false
    };
  }

  onSubs(value) {
    const { t, history } = this.props;
    const existingSubscription = this.props.doc && this.props.doc._id;
    const methodToCall = existingSubscription ? 'subscriptions.update' : 'subscriptions.insert';
    const doc = {
      location: value.location,
      distance: value.distance
    };

    if (existingSubscription) doc._id = existingSubscription;

    const authenticated = !!Meteor.userId();
    const self = this;

    if (authenticated) {
      self.setState({ disableFstBtn: true });
      Meteor.call(methodToCall, doc, (error, subscriptionId) => {
        if (error) {
          self.setState({ disableFstBtn: false });
          if (error.error && error.error === 'on-already-subscribed') {
            Bert.alert(t(error.error), 'danger');
          } else if (error.reason) {
            Bert.alert(error.reason, 'danger');
          }
        } else {
          self.setState({ disableFstBtn: false });
          const confirmation = existingSubscription ? t('Zona actualizada') : t('Zona añadida');
          Bert.alert(confirmation, 'success');
          // history.push(`/subscriptions/${subscriptionId}`);
          history.push('/subscriptions');
        }
      });
    } else {
      this.props.history.push('/signup', doc);
    }
  }

  render() {
    const { doc, t } = this.props;
    const isEdit = doc && doc._id;
    const focus = typeof this.props.focusInput !== 'undefined' ? this.props.focusInput : !isEdit;
    return (
      <FireSubscription
          center={this.state.center}
          zoom={this.state.zoom}
          distance={doc.distance}
          focusInput={focus}
          disableFstBtn={this.state.disableFstBtn}
          subsBtn={isEdit ? t('Actualizar') : t(isAnyMobile ? 'Suscribirme a este radio' : 'Suscribirme a fuegos en este radio')}
          onSubs={state => this.onSubs(state)}
      />
    );
  }
}
SubscriptionEditor.defaultProps = {
  doc: { location: { lat: null, lot: null }, distance: null }
};

SubscriptionEditor.propTypes = {
  doc: PropTypes.object,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  focusInput: PropTypes.bool
};

export default translate([], { wait: true })(SubscriptionEditor);
