/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { translate } from 'react-i18next';
import { FormGroup, Button, FormControl } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import { isHome } from '/imports/ui/components/Utils/location';
import { testId } from '/imports/ui/components/Utils/TestUtils';
import validate from '/imports/modules/validate';

import './Feedback.scss';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentDidMount() {
    const component = this;
    const { t } = this.props;

    validate(component.form, {
      rules: {
        email: {
          required: true,
          email: true
        },
        feedbackText: {
          required: true
        }
      },
      messages: {
        feedbackText: {
          required: t('Por favor, escribe aquí tu feedback...')
        },
        email: {
          required: t('Tu correo'),
          email: t('¿Es correcto este correo?')
        }
      },
      submitHandler() { component.handleSubmit(); }
    });
  }

  onTabClick() {
    $('#feedback-form').toggle('slide');
  }

  handleSubmit() {
    const email = this.email.value.trim();
    const feedbackText = this.feedbackText.value.trim();

    Meteor.call('send-feedback', email, feedbackText, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        Bert.alert('Feedback recibido, gracias...', 'success');
        this.onTabClick();
      }
    });
  }

  render() {
    // console.log(`Render Feedback because isHome ${this.props.isHome}, email: '${this.props.emailAddress}'`);
    const disabled = this.props.emailVerified && this.props.emailAddress;
    const { t } = this.props;
    return (
      <div>
        { !this.props.isHome &&
          <div id="feedback">
            <div id="feedback-form" ref={formdiv => (this.formdiv = formdiv)} style={{ display: 'none' }} className="card">
              <form
                  ref={form => (this.form = form)}
                  className="form card-body"
                  onSubmit={event => event.preventDefault()}
              >
                <FormGroup controlId="formEmail">
                  <input
                      id={testId('emailInput')}
                      onChange={this.handleChange}
                      name="email"
                      className="form-control"
                      ref={email => (this.email = email)}
                      placeholder={t('Tu correo')}
                      key={disabled ? 'disabledEmail' : 'enabledEmail'}
                      disabled={disabled}
                      defaultValue={disabled ? this.props.emailAddress : ''}
                      type="email"
                  />
                </FormGroup>
                <FormGroup
                    controlId="formFeedback"
                >
                  <textarea
                      id={testId('feedbackTextarea')}
                      className="form-control"
                      name="feedbackText"
                      ref={feedbackText => (this.feedbackText = feedbackText)}
                      placeholder={t('Por favor, escribe aquí tu feedback...')}
                      rows="6"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <Button type="submit" bsStyle="success" className="float-right" id={testId('sendFeedbackBtn')} >
                  {t('Enviar')}
                </Button>
              </form>
            </div>
            <div
                id="feedback-tab"
                onClick={(event) => { this.onTabClick(event); }}
            >
              {t('Feedback')}
            </div>
          </div>
        }
      </div>
    );
  }
}

Feedback.propTypes = {
  t: PropTypes.func.isRequired,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  isHome: PropTypes.bool.isRequired
};

export default translate()(withTracker(props => ({
  emailAddress: props.emailAddress,
  emailVerified: props.emailVerified,
  isHome: isHome()
}))(Feedback));
