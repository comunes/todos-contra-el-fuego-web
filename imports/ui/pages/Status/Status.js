/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';
import Blaze from 'meteor/gadicc:blaze-react-component';

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
