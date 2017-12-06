import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col, HelpBlock } from 'react-bootstrap';
import { Trans, translate } from 'react-i18next';
import DistanceSlider from '/imports/ui/components/DistanceSlider/DistanceSlider';
import SelectionMap from '/imports/ui/components/SelectionMap/SelectionMap';
import getGKeys from '/imports/startup/client/gkeys';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete'
import update from 'immutability-helper';
import { withTracker } from 'meteor/react-meteor-data';

class Sandbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adddress: ''
    };
    self = this;
    // this.handleSelect = this.handleSelect.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }

  onChange = (address) => { this.setState({ address }) }

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        // console.log('Success Yay', { lat, lng })
        const newState = update(this.state, {$merge: {lat: lat, lng: lng}});
        // console.log(newState);
        this.setState(newState);
        // console.log(this.state);
      })
      .catch(error => {
        console.log(error);
        if (error === 'ZERO_RESULTS') {
          console.log("No results");
        }
      });
  }

  onSliderChange = (value) => {
    this.setState(update(this.state, {$merge: {distance: value}}));
  }

  render() {
    // https://www.npmjs.com/package/react-places-autocomplete

    // https://github.com/kenny-hibino/react-places-autocomplete/issues/103
    const myStyles = {
      autocompleteContainer: {
        paddingBottom: '20px',
        backgroundSize: 'auto 12px',
        backgroundPosition: 'bottom left 10px',
        backgroundRepeat: 'no-repeat',
        backgroundImage: "url('https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png')",
      },
    }

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="suggestion-item">
        <i className='fa fa-map-marker suggestion-icon'/>{' '}
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>)

    // https://developers.google.com/places/web-service/search
    // https://github.com/kenny-hibino/react-places-autocomplete/blob/master/demo/Demo.js
    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} >
            { typeof this.props.gkey === 'string' &&
              <div>
                <h4 className="page-header"><Trans parent="span">Suscríbete a alertas de fuegos</Trans></h4>
                <form onSubmit={this.handleSelectEnd}>
                  <FormGroup>
                    <ControlLabel>
                      <Trans parent="span">Indícanos la posición a vigilar (por ej. tu pueblo, una calle, etc):</Trans>
                    </ControlLabel>
                    <PlacesAutocomplete
                        styles={myStyles}
                        classNames={{
                          root: 'form-group',
                          input: 'form-control',
                          autocompleteContainer: 'autocomplete-container'}}
                        googleLogo={false}
                        highlightFirstSuggestion={true}
                        onSelect={this.handleSelect}
                        onEnterKeyDown={this.handleSelect}
                        autocompleteItem={AutocompleteItem}
                        options={{
                          // location: new google.maps.LatLng(-34, 151),
                          // radius: 2000,
                          // type: ['address'],
                          language: this.props.i18n.language
                        }}
                        inputProps={
                          {
                            value: this.state.address,
                            onChange: this.onChange,
                            placeholder: this.props.t("Escribe aquí un lugar "),
                            onBlur:() => { console.log('Blur event!'); },
                            onFocus:() => { console.log('Focused!'); },
                            autoFocus:true
                          }} />
                    <HelpBlock><Trans parent="span">También puedes seleccionar el lugar en el mapa arrastrando el puntero naranja.</Trans></HelpBlock>
                  </FormGroup>
                </form>
              </div>
            }
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} >
            <DistanceSlider onChange={this.onSliderChange} />
            <Button bsStyle="success" type="submit"><Trans parent="span">Subscribir</Trans></Button>
          </Col>
        </Row>
        <Row className="align-items-center justify-content-center">
          <SelectionMap lat={this.state.lat} lng={this.state.lng} distance={this.state.distance || 10} />
        </Row>
      </div>
    )
  }
}

Sandbox.propTypes = {
  gkey: PropTypes.string
}

const gkey = new ReactiveVar();

getGKeys(function(err, key) {
    if (err) {
      console.log(err);
    } else {
      gkey.set(key);
    }
});

export default translate([], { wait: true }) (withTracker(() => {
  return {
    gkey: gkey.get()
  };
})(Sandbox));
