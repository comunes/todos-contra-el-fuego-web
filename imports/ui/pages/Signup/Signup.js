import React from 'react';
import { Row, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Col from '../../components/Col/Col';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';
import Icon from '../../components/Icon/Icon';
import './Signup.scss';
import { translate } from 'react-i18next';
import { T9n } from 'meteor-accounts-t9n';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.t = this.props.t;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 6,
        },
      },
      messages: {
        firstName: {
          required: this.t("¿Cuál es tu nombre?"),
        },
        lastName: {
          required: this.t("¿Cuál es tu apellido?"),
        },
        emailAddress: {
          required: this.t("Necesitamos una contraseña aquí."),
          email: this.t("¿Es correcto este correo?"),
        },
        password: {
          required: this.t("Necesitamos una contraseña aquí."),
          minlength: this.t("Usa al menos seis caracteres."),
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;

    Accounts.createUser({
      email: this.emailAddress.value,
      password: this.password.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value,
        },
      },
    }, (error) => {
      if (error) {
        Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
      } else {
        Meteor.call('users.sendVerificationEmail');
        Bert.alert('Welcome!', 'success');
        history.push('/documents');
      }
    });
  }

  render() {
    return (<div className="Signup">
      <Row className="align-items-center justify-content-center">
        <Col xs={12} sm={6} md={5} lg={4}>
          <h4 className="page-header">{this.t("Registrarse")}</h4>
          <Row>
            {/* <Col xs={12}>
            <button
            className={`btn btn-block btn-raised btn-primary OAuthLoginButtonDis OAuthLoginButton-telegram`}
            type="button" onClick={() => handleLogin(service, callback)}>
            <span><Icon icon="telegram" /> Usa nuestro bot de Telegram</span>
            </button>
            </Col> */}
            <Col xs={12}>
              <OAuthLoginButtons
                services={['telegram', 'google']}
                emailMessage={{
                  offset: 97,
                  text: this.t('o regístrate con un correo'),
                }}
              />
            </Col>
          </Row>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <ControlLabel>{this.t("Nombre")}</ControlLabel>
                  <input
                    type="text"
                    name="firstName"
                    ref={firstName => (this.firstName = firstName)}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <ControlLabel>{this.t("Apellidos")}</ControlLabel>
                  <input
                    type="text"
                    name="lastName"
                    ref={lastName => (this.lastName = lastName)}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <ControlLabel>{this.t("Correo electrónico")}</ControlLabel>
              <input
                type="email"
                name="emailAddress"
                ref={emailAddress => (this.emailAddress = emailAddress)}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{this.t("Contraseña")}</ControlLabel>
              <input
                type="password"
                name="password"
                ref={password => (this.password = password)}
                className="form-control"
              />
              <InputHint>{this.t("Usa al menos seis caracteres.")}</InputHint>
            </FormGroup>
            <Button type="submit" bsStyle="success">{this.t("Registrarse")}</Button>
            <AccountPageFooter>
              <p>{this.t("¿Ya tienes un cuenta?")} <Link to="/login">{this.t("Iniciar sesión")}</Link>.</p>
            </AccountPageFooter>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default translate([], { wait: true })(Signup)
