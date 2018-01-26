/* eslint-disable react/jsx-indent-props */

import React from 'react';
import { Row, FormGroup, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Col from '../../components/Col/Col';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import Icon from '../../components/Icon/Icon';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';
import './Signup.scss';
import { translate, Trans } from 'react-i18next';
import { T9n } from 'meteor-accounts-t9n';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.handleSubmit = this.handleSubmit.bind(this);
    // console.log(props.location.state);
    this.state = props.location.state ? props.location.state : {};
    this.state.termsAccept = false;
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
    const { history, t, i18n } = this.props;

    Accounts.createUser({
      email: this.emailAddress.value,
      password: this.password.value,
      profile: {
        lang: i18n.language,
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

  setTermsAccept(termsAccept) {
    this.setState({ termsAccept });
  }

  onTelegramAuth() {
    /* dynamic import sample
    // https://github.com/meteor/meteor/issues/9038
    import('crypto-random-hex').then(({ default: randomHex }) => {
      // console.log(randomHex);
      const hex = randomHex(20);
      window.open(`https://t.me/TodosContraElFuego_bot?start=${hex}`);
    }); */
    Meteor.call('auth.getHash', (error, response) => {
      if (error) {
        console.warn(error);
      } else {
        const bot = Meteor.isDevelopment ? 'rednodetest_bot' : 'TodosContraElFuego_bot';
        const url = `https://t.me/${bot}?start=${response}`;
        // console.log(url);
        window.open(url);
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
            { Meteor.settings.public.telegramAuth &&
            <Col xs={12}>
              <button
                  className="btn btn-block btn-raised btn-primary OAuthLoginButtonDis OAuthLoginButton-telegram"
                  type="button"
                  onClick={this.onTelegramAuth}
              >
                <span><Icon icon="telegram" /> {t('Iniciar sesión con Telegram')}</span>
              </button>
            </Col> }
            <Col xs={12}>
              <OAuthLoginButtons
                services={['telegram', 'google']}
                emailMessage={{
                  offset: 97,
                  text: t('o con un correo')
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
            <Checkbox inline={false} defaultChecked={this.state.termsAccept} onClick={e => this.setTermsAccept(e.target.checked)}>
              <Trans className="mark-checkbox" parent="span" i18nKey="termsAccept">Acepto las <a target="_blank" href="/terms">condiciones de servicio</a> de este sitio</Trans>
            </Checkbox>

            <Button type="submit" disabled={!this.state.termsAccept} bsStyle="success">{t('Registrarse')}</Button>
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
