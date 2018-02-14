/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-absolute-path */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { testId } from '/imports/ui/components/Utils/TestUtils';
import Col from '../../components/Col/Col';
import { withTracker } from 'meteor/react-meteor-data';
import InputHint from '../../components/InputHint/InputHint';
import validate from '../../../modules/validate';
import { translate } from 'react-i18next';
import { T9n } from 'meteor-accounts-t9n';

import './Profile.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.t = this.props.t;
    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOAuthUser = this.renderOAuthUser.bind(this);
    this.renderPasswordUser = this.renderPasswordUser.bind(this);
    this.renderProfileForm = this.renderProfileForm.bind(this);
    this.onLangSelect = this.onLangSelect.bind(this);
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
        currentPassword: {
          required() {
            // Only required if newPassword field has a value.
            return component.newPassword.value.length > 0;
          }
        },
        newPassword: {
          required() {
            // Only required if currentPassword field has a value.
            return component.currentPassword.value.length > 0;
          }
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
        currentPassword: {
          required: this.t('Necesito tu contraseña si la quieres cambiar.')
        },
        newPassword: {
          required: this.t('Necesito tu nueva contraseña si la quieres cambiar.')
        }
      },
      submitHandler() { component.handleSubmit(); }
    });
  }

  onLangSelect(lang) {
    // console.log(lang);
    Meteor.call('users.setLang', lang, (error) => {
      if (error) {
        console.error(error);
      } else {
        this.props.i18n.changeLanguage(lang);
        // Bert.alert(this.t("¡Perfíl actualizado!"), 'success');
      }
    });
  }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === 'password' ? 'password' : 'oauth';
  }

  handleSubmit() {
    const profile = {
      emailAddress: this.emailAddress.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value
        }
      }
    };

    Meteor.call('users.editProfile', profile, (error) => {
      if (error) {
        Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
      } else {
        Bert.alert(this.t('¡Perfíl actualizado!'), 'success');
      }
    });

    if (this.newPassword.value) {
      Accounts.changePassword(this.currentPassword.value, this.newPassword.value, (error) => {
        if (error) {
          Bert.alert(T9n.get(`error.accounts.${error.reason}`), 'danger');
        } else {
          this.currentPassword.value = '';
          this.newPassword.value = '';
        }
      });
    }
  }

  renderOAuthUser(loading, user) {
    return !loading ? (<div className="OAuthProfile">
      {Object.keys(user.services).map(service => (
        <div key={service} className={`LoggedInWith ${service}`}>
          <img src={`/${service}.svg`} alt={service} />
          <p>{this.props.t('Has iniciado sesión con {{service}} usando la dirección de correo {{email}}.', { service: _.capitalize(service), email: user.services[service].email })}</p>
          <Button
            className={`btn btn-${service}`}
            href={{
              facebook: 'https://www.facebook.com/settings',
              google: 'https://myaccount.google.com/privacy#personalinfo',
              github: 'https://github.com/settings/profile'
            }[service]}
            target="_blank"
          >{this.t('Editar perfíl en')} {_.capitalize(service)}
          </Button>
        </div>
      ))}
    </div>) : <div />;
  }

  renderPasswordUser(loading, user) {
    const { t, i18n } = this.props;
    const langName = {
      en: 'English', es: 'Español', gl: 'Galego', ast: 'Asturianu', ca: 'Català'
    };
    return !loading ? (<div>
      <Row>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>{this.t('Nombre')}</ControlLabel>
            <input
              type="text"
              name="firstName"
              defaultValue={user.profile.name.first}
              ref={firstName => (this.firstName = firstName)}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup>
            <ControlLabel>{this.t('Apellidos')}</ControlLabel>
            <input
              type="text"
              name="lastName"
              defaultValue={user.profile.name.last}
              ref={lastName => (this.lastName = lastName)}
              className="form-control"
            />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <ControlLabel>{this.t('Correo electrónico')}</ControlLabel>
        <input
          type="email"
          name="emailAddress"
          defaultValue={user.emails[0].address}
          ref={emailAddress => (this.emailAddress = emailAddress)}
          className="form-control"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{this.t('Idioma')}</ControlLabel>
        <div className="btn-group">
          <button className="btn btn-secondary btn-sm dropdown-toggle lang-selector" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {langName[i18n.language]}
          </button>
          <div className="dropdown-menu">
            {i18n.languages.map(lang => (
              <button
                className="dropdown-item"
                onClick={() => this.onLangSelect(lang)}
                key={lang}
                type="button"
              >
                {langName[lang]}
              </button>
           ))
          }
          </div>
        </div>
        <InputHint><i className="fa fa-language"></i> <a href="https://translate.comunes.org/projects/todos-contra-el-fuego/" rel="noopener noreferrer" target="_blank">{this.t('Puedes participar en las traducciones')}</a></InputHint>
      </FormGroup>
      <FormGroup>
        <ControlLabel>{this.t('Contraseña actual')}</ControlLabel>
        <input
          type="password"
          name="currentPassword"
          ref={currentPassword => (this.currentPassword = currentPassword)}
          className="form-control"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{this.t('Nueva contraseña')}</ControlLabel>
        <input
          type="password"
          name="newPassword"
          ref={newPassword => (this.newPassword = newPassword)}
          className="form-control"
        />
        <InputHint>{this.t('Usa al menos seis caracteres.')}</InputHint>
      </FormGroup>
      <Button id={testId('profileSubmit')} type="submit" bsStyle="success">{this.t('Guardar perfíl')}</Button>
    </div>) : <div />;
  }

  renderProfileForm(loading, user) {
    return !loading ? ({
      password: this.renderPasswordUser,
      oauth: this.renderOAuthUser
    }[this.getUserType(user)])(loading, user) : <div />;
  }

  render() {
    const { loading, user } = this.props;
    return (<div className="Profile">
      <Row className="align-items-center justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <h4 className="page-header">{this.t('Editar perfíl')}</h4>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            {this.renderProfileForm(loading, user)}
          </form>
        </Col>
      </Row>
    </div>);
  }
}

Profile.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired
};

export default translate([], { wait: true })(withTracker(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
    user: Meteor.user()
  };
})(Profile));
