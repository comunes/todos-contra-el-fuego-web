/* eslint-disable react/jsx-indent-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

class SubsAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ''
    };
  }

  onChange(address) { this.setState({ address }); }

  handleSelect(address) {
    const self = this;
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        // console.log('Success Yay', { lat, lng })
        // const newState = update(this.state, {$merge: {lat: lat, lng: lng}});
        // console.log(newState);
        // this.setState(newState);
        self.props.onChange({ lat, lng });
        // console.log(this.state);
      })
      .catch((error) => {
        console.log(error);
        if (error === 'ZERO_RESULTS') {
          console.log('No results');
        }
      });
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
        backgroundImage: "url('https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png')"
      }
    };

    // http://simplelineicons.com/
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="suggestion-item">
        <i className="icons icon-location-pin suggestion-icon" />{' '}
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>);

    return (
      <form>
        <FormGroup>
          <ControlLabel>
            <Trans parent="span">Indícanos la posición de la zona a vigilar (por ej. tu pueblo, una calle, etc):</Trans>
          </ControlLabel>
          <PlacesAutocomplete
              styles={myStyles}
              autocompleteItem={AutocompleteItem}
              classNames={{
                root: 'form-group',
                input: 'form-control',
                autocompleteContainer: 'autocomplete-container'
              }}
              googleLogo={false}
              highlightFirstSuggestion
              onSelect={address => this.handleSelect(address)}
              onEnterKeyDown={address => this.handleSelect(address)}
              options={{
                // location: new google.maps.LatLng(-34, 151),
                // radius: 2000,
                // type: ['address'],
                language: this.props.i18n.language
              }}
              inputProps={
                {
                  value: this.state.address,
                  onChange: address => this.onChange(address),
                  placeholder: this.props.t('Escribe aquí un lugar'),
                  onBlur: () => { /* console.log('Blur event!'); */ },
                  onFocus: () => { /* console.log('Focused!'); */ },
                  autoFocus: this.props.focusInput
                }}
          />
          <HelpBlock><Trans parent="span">También puedes seleccionar la zona en el mapa arrastrando el puntero naranja.</Trans></HelpBlock>
        </FormGroup>
      </form>
    );
  }
}

SubsAutocomplete.propTypes = {
  focusInput: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired
};

export default translate([], { wait: true })(SubsAutocomplete);
