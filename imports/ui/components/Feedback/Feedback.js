/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component, Fragment } from 'react';
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
    this.t = props.t;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentDidMount() {
    const component = this;

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
          required: this.t('Por favor, escribe aquí tu feedback...')
        },
        email: {
          required: this.t('Tu correo'),
          email: this.t('¿Es correcto este correo?')
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
    return (
      <Fragment>
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
                      placeholder={this.t('Tu correo')}
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
                      placeholder={this.t('Por favor, escribe aquí tu feedback...')}
                      rows="6"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <Button type="submit" bsStyle="success" className="float-right" id={testId('sendFeedbackBtn')} >
                  {this.t('Enviar')}
                </Button>
              </form>
            </div>
            <div
                id="feedback-tab"
                onClick={(event) => { this.onTabClick(event); }}
            >
              {this.t('Feedback')}
            </div>
          </div>
        }
      </Fragment>
    );
  }
}

Feedback.propTypes = {
  t: PropTypes.func.isRequired,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  isHome: PropTypes.bool.isRequired
};

export default translate([], { wait: true })(withTracker(props => ({
  emailAddress: props.emailAddress,
  emailVerified: props.emailVerified,
  isHome: isHome()
}))(Feedback));
