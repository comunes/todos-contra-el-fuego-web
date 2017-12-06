import React from 'react';
import { Trans, translate } from 'react-i18next';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete'
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';

class SubsAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adddress: '',
    }
    this.onChange = (address) => { this.setState({ address }) }
  }


  handleSelect = (address) => {
    const self = this;
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        // console.log('Success Yay', { lat, lng })
        // const newState = update(this.state, {$merge: {lat: lat, lng: lng}});
        // console.log(newState);
        // this.setState(newState);
        self.props.onChange({lat: lat, lng: lng});
        // console.log(this.state);
      })
      .catch(error => {
        console.log(error);
        if (error === 'ZERO_RESULTS') {
          console.log("No results");
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
        backgroundImage: "url('https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png')",
      },
    }

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="suggestion-item">
        <i className='fa fa-map-marker suggestion-icon'/>{' '}
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>)

    return (
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
                  onBlur:() => { /* console.log('Blur event!'); */ },
                  onFocus:() => { /* console.log('Focused!'); */ },
                  autoFocus:true
                }} />
          <HelpBlock><Trans parent="span">También puedes seleccionar el lugar en el mapa arrastrando el puntero naranja.</Trans></HelpBlock>
        </FormGroup>
      </form>
    )
  }
}


export default translate([], { wait: true }) (SubsAutocomplete);
