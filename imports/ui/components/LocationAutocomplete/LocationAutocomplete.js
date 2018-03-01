/* eslint-disable react/jsx-indent-props */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';


// Sample:
// https://github.com/kenny-hibino/react-places-autocomplete/blob/master/demo/components/SearchBar.js
class LocationAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      loading: false // we can use it with a spinner
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {
    if (error === 'ZERO_RESULTS') {
      Bert.alert(this.props.t('Lugar no encontrado'), 'alert');
    }
  }

  handleChange(address) {
    this.setState({ address });
  }

  handleSelect(address) {
    this.setState({
      address,
      loading: true
    });
    const self = this;
    try {
      geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then((result) => {
          if (result && result.lat && result.lng) {
            const { lat, lng } = result;
            self.props.onChange({ lat, lng });
            self.setState({
              loading: false
            });
          }
        })
        .catch((error) => { self.onError(error); });
    } catch (error) {
      self.onError(error);
    }
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

    const {
      t, label, placeHolder, helpText
    } = this.props;

    return (
      <form>
        <FormGroup>
          { label.length > 0 && <ControlLabel>{t(label)}</ControlLabel> }
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
              onChange={this.handleChange}
              onSelect={this.handleSelect}
              onEnterKeyDown={this.handleSelect}
              onError={this.onError}
              options={{
                // location: new google.maps.LatLng(-34, 151),
                // radius: 2000,
                // type: ['address'],
                language: this.props.i18n.language
              }}
              inputProps={
                {
                  value: this.state.address,
                  onChange: this.handleChange,
                  placeholder: t(placeHolder),
                  onBlur: () => { /* console.log('Blur event!'); */ },
                  onFocus: () => { /* console.log('Focused!'); */ },
                  autoFocus: this.props.focusInput
                }}
          />
          { helpText.length > 0 && <HelpBlock>{t(helpText)}</HelpBlock> }
        </FormGroup>
      </form>
    );
  }
}

LocationAutocomplete.propTypes = {
  focusInput: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeHolder: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
};

export default translate([], { wait: true })(LocationAutocomplete);
