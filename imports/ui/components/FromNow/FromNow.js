/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Chronos from '/imports/ui/components/Chronos/Chronos';

class FromNow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      when: props.when
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.when !== nextProps.when) {
      // console.log(`Next when ${nextProps.when}`);
      this.setState({
        when: nextProps.when
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextState.when === this.state.when);
  }

  render() {
    console.log(`Render from now ${this.state.when}`);
    return (
      <span>{this.state.when}</span>
    );
  }
}

FromNow.propTypes = {
  when: PropTypes.string
};

FromNow.defaultProps = {
};

const FromNowContainer = withTracker((props) => {
  const whenDate = props.when;
  return {
    when: whenDate ? Chronos.moment(whenDate).fromNow() : null
  };
})(FromNow);

export default FromNowContainer;
