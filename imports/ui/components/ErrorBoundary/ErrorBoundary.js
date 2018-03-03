/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import ravenLogger from '/imports/startup/client/ravenLogger';
import './ErrorBoundary.scss';

// https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // console.log(`typeof error ${typeof error}`);
    // console.log(`typeof info ${typeof info}`);
    ravenLogger.log(error, info);
    // ravenLogger.log(info);
  }

  render() {
    const {
      appName, title, subTitle, children
    } = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <Row className="align-items-center justify-content-center">
            <Col xs={12} sm={6} md={5} lg={4}>
              <h1 className="page-header">{appName}</h1>
              <h4 className="page-header">{title}</h4>
              <p>{subTitle}</p>
            </Col>
          </Row>
        </div>
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  appName: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

ErrorBoundary.defaultProps = {
  appName: 'All Against Fire!',
  title: 'Upppps: Something has gone wrong',
  subTitle: 'We are investigating the problem, try again in a while'
};

export default ErrorBoundary;
