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

class SubscriptionEditor extends React.Component {
  onSubs(value) {
    const { t, history } = this.props;
    const existingSubscription = this.props.doc && this.props.doc._id;
    const methodToCall = existingSubscription ? 'subscriptions.update' : 'subscriptions.insert';
    const doc = {
      location: value.location,
      distance: value.distance
    };

    if (existingSubscription) doc._id = existingSubscription;

    Meteor.call(methodToCall, doc, (error, subscriptionId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingSubscription ? t('Zona actualizada') : t('Zona añadida');
        Bert.alert(confirmation, 'success');
        // history.push(`/subscriptions/${subscriptionId}`);
        history.push('/subscriptions');
      }
    });
  }

  render() {
    const { doc, t } = this.props;
    const isEdit = doc && doc._id;
    const focus = typeof this.props.focusInput !== 'undefined' ? this.props.focusInput : !isEdit;
    return (
      <FireSubscription
          center={[doc.location.lat, doc.location.lon]}
          distance={doc.distance}
          focusInput={focus}
          subsBtn={isEdit ? t('Actualizar') : t('Subscribirme a fuegos en este rádio')}
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
  focusInput: PropTypes.bool
};

export default translate([], { wait: true })(SubscriptionEditor);
