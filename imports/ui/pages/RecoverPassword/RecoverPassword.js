import React from 'react';
import { Row, Alert, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Col from '../../components/Col/Col';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';
import { translate } from 'react-i18next';

class RecoverPassword extends React.Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        emailAddress: {
          required: true,
          email: true,
        },
      },
      messages: {
        emailAddress: {
          required: 'Need an email address here.',
          email: 'Is this email address correct?',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const email = this.emailAddress.value;
    const t = this.props.t;

    Accounts.forgotPassword({ email, t }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(t("checkResetEmail", {email: email}), 'success');
        history.push('/login');
      }
    });
  }

  render() {
    return (<div className="RecoverPassword">
      <Row>
        <Col xs={12} sm={6} md={5} lg={4}>
          <h4 className="page-header">{this.t("Recupera tu contraseña")}</h4>
          <Alert bsStyle="info">
            {this.t("Introduce tu correo abajo para recibir un enlace para resetear tu contraseña.")}
          </Alert>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            <FormGroup>
              <ControlLabel>{this.t("Correo electrónico")}</ControlLabel>
              <input
                type="email"
                name="emailAddress"
                ref={emailAddress => (this.emailAddress = emailAddress)}
                className="form-control"
              />
            </FormGroup>
            <Button type="submit" bsStyle="success">{this.t("Recupera tu contraseña")}</Button>
            <AccountPageFooter>
              <p>{this.t("¿Recuerdas tu contraseña?")} <Link to="/login">{this.t("Iniciar sesión")}</Link>.</p>
            </AccountPageFooter>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

RecoverPassword.propTypes = {
  history: PropTypes.object.isRequired,
};

export default translate([], { wait: true })(RecoverPassword);
