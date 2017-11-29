import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Alert, Button } from 'react-bootstrap';
import { t, Trans, translate, Interpolate } from 'react-i18next';
import { T9n } from 'meteor-accounts-t9n';

const handleResendVerificationEmail = (emailAddress, t) => {
  Meteor.call('users.sendVerificationEmail', (error) => {
    if (error) {
      Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
    } else {
      Bert.alert(t("checkVerificationEmail", {email: emailAddress}), 'success');
    }
  });
};

const ReSendEmail = props => (
  <div>
  {props.userId && !props.emailVerified ? <Alert className="verify-email text-center"><p><Interpolate i18nKey="verifyEmail" email={props.emailAddress}></Interpolate> <Button bsStyle="link" onClick={() => handleResendVerificationEmail(props.emailAddress, props.t)} href="#"><Trans parent="span">Reenviar email de verificación</Trans></Button></p></Alert> : ''}
  </div>
);

ReSendEmail.defaultProps = {
  userId: '',
  emailAddress: '',
};

ReSendEmail.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
};

export default translate([], { wait: true })(ReSendEmail);
