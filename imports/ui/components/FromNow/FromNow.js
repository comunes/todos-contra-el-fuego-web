/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Chronos from '/imports/ui/components/Chronos/Chronos';
import { translate } from 'react-i18next';
import { dateLongFormat } from '/imports/api/Common/dates';

import './FromNow.scss';

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

  thatIs() {
    return this.props.t('esDecirTalDia', { date: dateLongFormat(this.props.whenDate) });
  }

  render() {
    console.log(`Render from now ${this.state.when}`);
    return (
      <span data-toggle="tooltip" className="from-now" title={this.thatIs()}>{this.state.when}</span>
    );
  }
}

FromNow.propTypes = {
  t: PropTypes.func.isRequired,
  when: PropTypes.string,
  whenDate: PropTypes.instanceOf(Date)
};

FromNow.defaultProps = {
};

/*
 * const FromNowContainer = withTracker((props) => {
 *
 * })(FromNow);
 *
 * export default FromNowContainer;
 * */

export default translate([], { wait: true })(withTracker((props) => {
  const whenDate = props.when;
  return {
    when: whenDate ? Chronos.moment(whenDate).fromNow() : null,
    whenDate
  };
})(FromNow));
