import React from 'react';
import PropTypes from 'prop-types';
import { Row, Alert, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Col from '../../components/Col/Col';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import { translate } from 'react-i18next';
import { T9n } from 'meteor-accounts-t9n';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        newPassword: {
          required: true,
          minlength: 6,
        },
        repeatNewPassword: {
          required: true,
          minlength: 6,
          equalTo: '[name="newPassword"]',
        },
      },
      messages: {
        newPassword: {
          required: this.t("Introduce una nueva contraseña, por favor."),
          minlength: this.t("Usa al menos seis caracteres."),
        },
        repeatNewPassword: {
          required: this.t("Repite tu nueva contraseña, por favor."),
          equalTo: this.t("Mmmm, tus contraseñas no coinciden. ¿Inténtalo otra vez?"),
          minlength: this.t("Usa al menos seis caracteres."),
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { match, history } = this.props;
    const token = match.params.token;

    Accounts.resetPassword(token, this.newPassword.value, (error) => {
      if (error) {
        Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
      } else {
        history.push('/documents');
      }
    });
  }

  render() {
    return (<div className="ResetPassword">
      <Row className="align-items-center justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <h4 className="page-header">{this.t("Resetea tu contraseña")}</h4>
          <Alert bsStyle="info">
            { this.t("Para resetear tu contraseña, introduce una nueva debajo. Iniciarás la sesión con la nueva contraseña.") }
          </Alert>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            <FormGroup>
              <ControlLabel>{this.t("Nueva contraseña")}</ControlLabel>
              <input
                type="password"
                className="form-control"
                ref={newPassword => (this.newPassword = newPassword)}
                name="newPassword"
                placeholder={this.t("Nueva contraseña")}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{this.t("Repite la nueva contraseña")}</ControlLabel>
              <input
                type="password"
                className="form-control"
                ref={repeatNewPassword => (this.repeatNewPassword = repeatNewPassword)}
                name="repeatNewPassword"
                placeholder={this.t("Repite la nueva contraseña")}
              />
            </FormGroup>
            <Button type="submit" bsStyle="success">{this.t("Resetea la contraseña y entra")}</Button>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default translate([], { wait: true })(ResetPassword);
