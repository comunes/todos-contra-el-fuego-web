import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { Trans, translate } from 'react-i18next';
import DistanceSlider from '/imports/ui/components/DistanceSlider/DistanceSlider';
import SelectionMap from '/imports/ui/components/SelectionMap/SelectionMap';
import update from 'immutability-helper';
import { withTracker } from 'meteor/react-meteor-data';
import getGKeys from '/imports/startup/client/gkeys';
import SubsAutocomplete from './SubsAutocomplete';

class FireSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false
    };
  }

  componentDidMount = () => {
    getGKeys(function(err, key) {
      this.setState({init: true});
    }.bind(this));
  }

  onAutocompleteChange = (value) => {
    this.setState(update(this.state, {$merge: {lat: value.lat, lng: value.lng}}));
  }

  onSliderChange = (value) => {
    this.setState(update(this.state, {$merge: {distance: value}}));
  }

  render() {
    // https://developers.google.com/places/web-service/search
    // https://github.com/kenny-hibino/react-places-autocomplete/blob/master/demo/Demo.js

    if (!this.state.init) {
      return <div/>
    } else
    return (
      <div>
        <Row>
            <Col xs={12} sm={12} md={6} lg={6} >
              <div>
                <h4 className="page-header"><Trans parent="span">Suscríbete a alertas de fuegos</Trans></h4>
                <SubsAutocomplete onChange={this.onAutocompleteChange}/>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} >
              <DistanceSlider onChange={this.onSliderChange} />
            </Col>
          </Row>
          <Row className="align-items-center justify-content-center">
            <SelectionMap lat={this.state.lat} lng={this.state.lng} distance={this.state.distance || 10} />
          </Row>
      </div>
    )
  }
}

export default translate([], { wait: true }) (FireSubscription);
