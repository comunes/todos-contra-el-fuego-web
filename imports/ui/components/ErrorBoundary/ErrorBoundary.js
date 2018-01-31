/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import ravenLogger from '/imports/startup/client/ravenLogger';
import './ErrorBoundary.scss';

// https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    ravenLogger.log(error);
    ravenLogger.log(info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <Row className="align-items-center justify-content-center">
            <Col xs={12} sm={6} md={5} lg={4}>
              <h1 className="page-header">{this.t('AppNameFull')}</h1>
              <h4 className="page-header">{this.t('general-error-title')}</h4>
              <Row>
                {this.t('general-error-description')}
              </Row>
            </Col>
          </Row>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  t: PropTypes.func.isRequired
};

ErrorBoundary.defaultProps = {
};

export default translate([], { wait: true })(withTracker(props => ({
  // props.something
}))(ErrorBoundary));
