import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { Trans, translate } from 'react-i18next';
import DistanceSlider from '/imports/ui/components/DistanceSlider/DistanceSlider';
import SelectionMap from '/imports/ui/components/SelectionMap/SelectionMap';
import update from 'immutability-helper';
import Gkeys from '/imports/startup/client/Gkeys';
import SubsAutocomplete from './SubsAutocomplete';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition.js';

class FireSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false
    };
    // console.log(this.props.location.state);
  }

  componentDidMount = () => {
    Gkeys.load(function (err, key) {
      this.setState({ init: true });
    }.bind(this));
  }

  centerOnUserLocation(value) {
    this.setState(update(this.state, {$merge: {lat: value.center[0], lng: value.center[1]}}));
  }

  onAutocompleteChange(value) {
    this.setState(update(this.state, {$merge: {lat: value.lat, lng: value.lng}}));
  }

  onSliderChange(value) {
    this.setState(update(this.state, {$merge: {distance: value}}));
  }

  onSelection(value) {
    this.setState(update(this.state, {$merge: {lat: value.lat, lng: value.lng, distance: value.distance}}));
  }

  render() {
    // https://developers.google.com/places/web-service/search
    // https://github.com/kenny-hibino/react-places-autocomplete/blob/master/demo/Demo.js

    if (!this.state.init) {
      return <div/>
    } else {
      return (
        <div>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6} >
              <div>
                <h4 className="page-header"><Trans parent="span">Suscríbete a alertas de fuegos</Trans></h4>
                <SubsAutocomplete
                    focusInput={this.props.focusInput}
                    onChange={ (value) => this.onAutocompleteChange(value) }/>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} >
              <DistanceSlider onChange={(value) => this.onSliderChange(value)} />
              <Row className="align-items-center justify-content-center">
                <CenterInMyPosition onClick={(viewport) => this.centerOnUserLocation(viewport)} />
              </Row>
            </Col>
          </Row>
          <Row className="align-items-center justify-content-center">
            <SelectionMap
                center={[this.state.lat, this.state.lng]}
                distance={this.state.distance}
                history={this.props.history}
                onSelection={(state) => this.onSelection(state)}
            />
          </Row>
        </div>
      );
    }
  }
}

FireSubscription.propTypes = {
  history: PropTypes.object.isRequired,
  focusInput: PropTypes.bool.isRequired
};

export default translate([], { wait: true })(FireSubscription);
