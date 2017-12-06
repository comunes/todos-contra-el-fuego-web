import React from 'react';
import './CenterInMyPosition.scss';
import { Button } from 'react-bootstrap';
import { translate } from 'react-i18next';

class CenterInMyPosition extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick = (event) => {
    console.log("Click?");
    // this.props.onClick(event);
    // https://atmospherejs.com/mdg/geolocation
    // only with SSL:
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

    // https://stackoverflow.com/questions/31608579/somethings-wrong-with-my-meteor-geolocation-functions
    var userGeoLocation = new ReactiveVar(null);
    var self = this;
    Tracker.autorun(function (computation) {
      userGeoLocation.set(Geolocation.latLng());
      if (userGeoLocation.get()) {
        //stop the tracker if we got something
        var viewport = {
          center: [userGeoLocation.get().lat, userGeoLocation.get().lng],
          zoom: 11
        }
        self.props.onClick(viewport);
        // self.onViewportChanged(viewport);
        computation.stop();
      }
    });
  }

  render() {
    return (
      <Button bsStyle="default" onClick={(event) => this.onClick(event)}>
        <i className="location"/>{this.props.t("Centrar el mapa en tu ubicación")}
      </Button>
    )
  }
}

export default translate([], { wait: true }) (CenterInMyPosition);
