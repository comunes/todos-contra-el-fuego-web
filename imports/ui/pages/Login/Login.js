import React from 'react';
import { Row, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Col from '../../components/Col/Col';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';
import { translate } from 'react-i18next';

class Login extends React.Component {
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
        password: {
          required: true,
        },
      },
      messages: {
        emailAddress: {
          required: this.t("Necesitamos un correo aquí."),
          email: this.t("¿Es este correo correcto?"),
        },
        password: {
          required: this.t("Necesitamos una contraseña aquí."),
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;

    Meteor.loginWithPassword(this.emailAddress.value, this.password.value, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(this.t('Bienvenid@ de nuevo'), 'success');
      }
    });
  }

  render() {
    return (<div className="Login">
      <Row>
        <Col xs={12} sm={6} md={5} lg={4}>
          <h4 className="page-header">{this.t("Iniciar sesión")}</h4>
          <Row>
            <Col xs={12}>
              <OAuthLoginButtons
                services={['google']}
                emailMessage={{
                  offset: 100,
                  text: this.t('o inicia sesión con un correo'),
                }}
              />
            </Col>
          </Row>
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
            <FormGroup>
              <ControlLabel className="clearfix">
                <span className="pull-left">{this.t("Contraseña")}</span>
                <Link className="pull-right" to="/recover-password">{this.t("¿Olvidaste tu contraseña?")}</Link>
              </ControlLabel>
              <input
                type="password"
                name="password"
                ref={password => (this.password = password)}
                className="form-control"
              />
            </FormGroup>
            <Button type="submit" bsStyle="success">{this.t("Iniciar sesión")}</Button>
            <AccountPageFooter>
              <p>{this.t("¿No tienes una cuenta?")} <Link to="/signup">{this.t("Regístrate")}</Link>.</p>
            </AccountPageFooter>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
};

export default translate([], { wait: true })(Login);
