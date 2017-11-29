import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { translate } from 'react-i18next';
import { T9n } from 'meteor-accounts-t9n';

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.state = { error: null };
  }

  componentDidMount() {
    const { match, history } = this.props;
    Accounts.verifyEmail(match.params.token, (error) => {
      if (error) {
        Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
        this.setState({ error: error.reason + ". " + this.t("Por favor, inténtalo otra vez.")});
        // this.setState({ error: `${error.reason}. Please try again.` });
      } else {
        setTimeout(() => {
          Bert.alert(this.t("¡Listo, gracias!"), 'success');
          history.push('/documents');
        }, 1500);
      }
    });
  }

  render() {
    return (<div className="VerifyEmail">
      <Alert bsStyle={!this.state.error ? 'info' : 'danger'}>
        {!this.state.error ? this.t('Verificando...') : this.state.error}
      </Alert>
    </div>);
  }
}

VerifyEmail.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default translate([], { wait: true })(VerifyEmail);
