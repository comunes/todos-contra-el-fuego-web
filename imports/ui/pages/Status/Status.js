/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Helmet } from 'react-helmet';

/*
   https://github.com/meteor/docs/blob/version-NEXT/long-form/oplog-observe-driver.md
   (...)
   Now look at your app. The facts template will render a variety of metrics; the ones we're looking for are observe-drivers-oplog and observe-drivers-polling in the mongo-livedata section. If observe-drivers-polling is zero or not rendered at all, then all of your observeChanges calls are using OplogObserveDriver!
   (...)
*/

class Status extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.state = {
    };
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{this.t('AppName')}: Status</title>
        </Helmet>
        <h4 className="page-header">Status</h4>
        <Blaze template="serverFacts" />
      </Fragment>
    );
  }
}

Status.propTypes = {
  t: PropTypes.func.isRequired
};

Status.defaultProps = {
};

// export default translate([], { wait: true })(Status);
export default translate([], { wait: true })(withTracker(props => ({
  // props.something
}))(Status));
