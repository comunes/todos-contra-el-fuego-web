/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { translate } from 'react-i18next';
import DistanceSlider from '/imports/ui/components/DistanceSlider/DistanceSlider';
import SelectionMap, { action } from '/imports/ui/components/SelectionMap/SelectionMap';
import Gkeys from '/imports/startup/client/Gkeys';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition';
import LocationAutocomplete from '/imports/ui/components/LocationAutocomplete/LocationAutocomplete';
import { isNotHomeAndMobile } from '/imports/ui/components/Utils/isMobile';
import { isHome } from '/imports/ui/components/Utils/location';

class FireSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      center: this.props.center,
      zoom: this.props.zoom,
      distance: this.props.distance
    };
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    const self = this;
    Gkeys.load(() => {
      self.setState({ init: true });
    });
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.disableFstBtn !== this.props.disableFstBtn) {
      return true;
    }
    if (this.state.init &&
        nextState.center === this.state.center &&
        nextState.distance === this.state.distance) {
      return false;
    }
    return true;
  }

  onAutocompleteChange(value) {
    this.setState({ center: [value.lat, value.lng] });
  }

  onSliderChange(value) {
    this.setState({ distance: value });
  }

  onSelection(value) {
    this.setState({ center: [value.lat, value.lng], distance: value.distance });
  }

  onSubs(value) {
    this.props.onSubs(value);
  }

  onCancel() {
    this.props.history.push('/subscriptions');
  }

  centerOnUserLocation(value) {
    this.setState({ center: value.center });
  }

  render() {
    // https://developers.google.com/places/web-service/search
    // https://github.com/kenny-hibino/react-places-autocomplete/blob/master/demo/Demo.js
    // console.log(`Focus autocomplete input: ${this.props.focusInput}`);
    if (!this.state.init) {
      return <div />;
    }
    return (
      <div>
        <Row>
          {isNotHomeAndMobile() &&
          <Col xs={12} sm={12} md={6} lg={6} >
            <div>
              <LocationAutocomplete
                  focusInput={this.props.focusInput}
                  label="Indícanos la posición de la zona a vigilar (por ej. tu pueblo, una calle, etc):"
                  placeHolder="Escribe aquí un lugar"
                  helpText="También puedes seleccionar la zona en el mapa arrastrando el puntero naranja."
                  onChange={value => this.onAutocompleteChange(value)}
              />
            </div>
          </Col> }
          <Col xs={12} sm={12} md={6} lg={6} >
            <DistanceSlider onChange={value => this.onSliderChange(value)} />
            {isNotHomeAndMobile() &&
            <Row className="center-in-my-pos">
              <CenterInMyPosition onClick={viewport => this.centerOnUserLocation(viewport)} />
            </Row>
            }
          </Col>
        </Row>
        <SelectionMap
            center={this.state.center}
            zoom={this.state.zoom}
            distance={this.state.distance}
            fstBtn={this.props.subsBtn}
            onFstBtn={state => this.onSubs(state)}
            sndBtn={isHome() ? null : 'fa-times'}
            onSndBtn={this.onCancel}
            sndBtnTitle={this.props.t('Cancelar')}
            onSelection={state => this.onSelection(state)}
            action={action.add}
            disableFstBtn={this.props.disableFstBtn}
        />
      </div>
    );
  }
}

FireSubscription.propTypes = {
  t: PropTypes.func.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  distance: PropTypes.number,
  focusInput: PropTypes.bool.isRequired,
  subsBtn: PropTypes.string.isRequired,
  onSubs: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  disableFstBtn: PropTypes.bool.isRequired
};

export default translate([], { wait: true })(FireSubscription);
