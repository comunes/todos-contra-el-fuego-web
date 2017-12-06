import React from 'react';
import { Trans, translate } from 'react-i18next';
import DistanceSlider from '/imports/ui/components/DistanceSlider/DistanceSlider';
import SelectionMap from '/imports/ui/components/SelectionMap/SelectionMap';
import update from 'immutability-helper';
import getGKeys from '/imports/startup/client/gkeys';
import FireSubscription from '/imports/ui/pages/FireSubscription/FireSubscription';

class Sandbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0
    };
  }

  onSliderChange = (value) => {
    this.setState(update(this.state, {$merge: {distance: value}}));
  }

  render() {
    return (
      <div>
        <FireSubscription />

      </div>
    )
  }
}


export default translate([], { wait: true }) (Sandbox);
