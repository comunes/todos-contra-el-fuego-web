/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { T9n } from 'meteor-accounts-t9n';
import { Accounts } from 'meteor/accounts-base';

class Auth extends Component {
  constructor(props) {
    super(props);
    const { token } = props.match.params;
    // console.log(token);
    console.log(Meteor.connection);
    console.log(Accounts.connection);

    Meteor.loginWithToken(token, (error) => {
      // this is going to throw error if we logged out
      if (error) {
        Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
        // props.history.push('/login');
      } else {
        console.log('loginWithToken');
      }
    });
  }

  render() {
    return (
      <div />
    );
  }
}

Auth.propTypes = {
  // t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

Auth.defaultProps = {
};

export default translate([], { wait: true })(Auth);
