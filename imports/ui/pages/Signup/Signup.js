/* eslint-disable react/jsx-indent-props */

import React from 'react';
import { Row, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Col from '../../components/Col/Col';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import randomHex from 'random-hexadecimal';
import Icon from '../../components/Icon/Icon';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';
import './Signup.scss';
import { translate } from 'react-i18next';
import { T9n } from 'meteor-accounts-t9n';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.handleSubmit = this.handleSubmit.bind(this);
    // console.log(props.location.state);
    this.state = props.location.state;
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        emailAddress: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6
        }
      },
      messages: {
        firstName: {
          required: this.t('¿Cuál es tu nombre?')
        },
        lastName: {
          required: this.t('¿Cuál es tu apellido?')
        },
        emailAddress: {
          required: this.t('Necesitamos una contraseña aquí.'),
          email: this.t('¿Es correcto este correo?')
        },
        password: {
          required: this.t('Necesitamos una contraseña aquí.'),
          minlength: this.t('Usa al menos seis caracteres.')
        }
      },
      submitHandler() { component.handleSubmit(); }
    });
  }

  handleSubmit() {
    const { history, t } = this.props;

    Accounts.createUser({
      email: this.emailAddress.value,
      password: this.password.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value
        }
      }
    }, (error) => {
      if (error) {
        Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
      } else {
        Meteor.call('users.sendVerificationEmail');
        Bert.alert(t('Bienvenid@!'), 'success');
        history.push('/subscriptions');

      }
    });
  }

  render() {
    const { t, history } = this.props;
    return (<div className="Signup">
      <Row className="align-items-center justify-content-center">
        <Col xs={12} sm={6} md={5} lg={4}>
          <h4 className="page-header">{t('Registrarse')}</h4>
          <Row>
            <Col xs={12}>
              <button
                  className="btn btn-block btn-raised btn-primary OAuthLoginButtonDis OAuthLoginButton-telegram"
                  type="button"
                  onClick={() => { const hex = randomHex({ max: 20 }); window.open(`https://t.me/TodosContraElFuego_bot?start=${hex}`); }}
              >
                <span><Icon icon="telegram" /> {t('Iniciar sesión con Telegram')}</span>
              </button>
            </Col>
            <Col xs={12}>
              <OAuthLoginButtons
                services={['telegram', 'google']}
                emailMessage={{
                  offset: 97,
                  text: t('o regístrate con un correo')
                }}
              />
            </Col>
          </Row>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <ControlLabel>{t('Nombre')}</ControlLabel>
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
                  <ControlLabel>{t('Apellidos')}</ControlLabel>
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
              <ControlLabel>{t('Correo electrónico')}</ControlLabel>
              <input
                type="email"
                name="emailAddress"
                ref={emailAddress => (this.emailAddress = emailAddress)}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{t('Contraseña')}</ControlLabel>
              <input
                type="password"
                name="password"
                ref={password => (this.password = password)}
                className="form-control"
              />
              <InputHint>{t('Usa al menos seis caracteres.')}</InputHint>
            </FormGroup>
            <Button type="submit" bsStyle="success">{t('Registrarse')}</Button>
            <AccountPageFooter>
              <p>{t('¿Ya tienes un cuenta?')} <Link to={{ pathname: '/login', state: this.state }} >{t('Iniciar sesión')}</Link>.</p>
            </AccountPageFooter>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object
};

export default translate([], { wait: true })(Signup);
