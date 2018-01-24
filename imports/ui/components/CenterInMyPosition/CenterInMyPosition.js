/* global Geolocation */
import React from 'react';
import PropTypes from 'prop-types';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import { Button } from 'react-bootstrap';
import { translate } from 'react-i18next';
import './CenterInMyPosition.scss';

class CenterInMyPosition extends React.Component {
  onClick() {
    // this.props.onClick(event);
    // https://atmospherejs.com/mdg/geolocation
    // only with SSL:
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

    console.log('Center');
    // https://stackoverflow.com/questions/31608579/somethings-wrong-with-my-meteor-geolocation-functions
    const userGeoLocation = new ReactiveVar(null);
    const self = this;
    Tracker.autorun((computation) => {
      userGeoLocation.set(Geolocation.latLng());
      if (userGeoLocation.get()) {
        // stop the tracker if we got something
        const viewport = {
          center: [userGeoLocation.get().lat, userGeoLocation.get().lng],
          zoom: 11
        };
        self.props.onClick(viewport);
        // console.log(viewport);
        // self.onViewportChanged(viewport);
        computation.stop();
      }
    });
  }

  render() {
    return (
      <Button bsStyle="default" onClick={() => this.onClick()}>
        <i className="icons icon-target" />{this.props.t('Centrar en tu ubicación')}
      </Button>);
  }
}

CenterInMyPosition.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(CenterInMyPosition);
