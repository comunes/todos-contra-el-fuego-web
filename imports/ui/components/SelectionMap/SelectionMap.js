import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker, CircleMarker, Circle } from 'react-leaflet';
import Leaflet from 'leaflet';
import { translate } from 'react-i18next';
import geolocation from '/imports/startup/client/geolocation';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import 'leaflet-sleep/Leaflet.Sleep.js';
import Control from 'react-leaflet-control';
import { Button, ButtonToolbar } from 'react-bootstrap';
import './SelectionMap.scss';

const positionIcon = new Leaflet.Icon({
  iconUrl: '/your-position.png',
  /* shadowUrl: require('../public/marker-shadow.png'), */
  iconSize: [50, 77], // size of the icon
  /* shadowSize:   [50, 64], // size of the shadow */
  iconAnchor: [25, 82] // point of the icon which will correspond to marker's location
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor */
});

class SelectionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: geolocation.get(),
      marker: geolocation.get(),
      zoom: 11,
      draggable: true,
      modified: false
    };

    this.getMap = this.getMap.bind(this);
    this.toggleDraggable = this.toggleDraggable.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.fit = this.fit.bind(this);
    this.addScale = this.addScale.bind(this);
    this.doSubs = this.doSubs.bind(this);
  }

  componentDidMount() {
    this.addScale();
  }

  componentDidUpdate() {
    this.fit();
  }

  getMap() {
    return this.selectionMap.leafletElement;
  }

  toggleDraggable() {
    this.setState({ draggable: !this.state.draggable });
  }

  updatePosition() {
    const { lat, lng } = this.marker.leafletElement.getLatLng();
    this.setState({
      marker: [lat, lng],
      modified: true
    });
    this.fit();
  }

  fit() {
    // console.log("fit!");
    this.getMap().fitBounds(this.distanceCircle.leafletElement.getBounds(), [70, 70]);
  }

  addScale() {
    // https://www.npmjs.com/package/leaflet-graphicscale
    const map = this.getMap();
    var options = {
      fill: 'fill',
      showSubunits: true
    };
    var graphicScale = L.control.graphicScale([options]).addTo(map);
  }

  doSubs() { // event param not used
    this.props.history.push(
      '/login',
      { subscription: { center: this.state.center, distance: this.state.distance } }
    );
  }

  render() {
    this.state.center = !this.state.modified && this.props.lat?
                        [this.props.lat, this.props.lng]: this.state.center;
    this.state.marker = !this.state.modified && this.props.lat?
                        [this.props.lat, this.props.lng]: this.state.marker;
    this.state.distance = this.props.distance;
    this.state.modified = false;
    return (
      <div>
      { this.state && this.state.center &&
        <Map center={this.state.center} zoom={this.state.zoom}
        ref={(map) => { this.selectionMap = map; }}
        sleep={true}
        sleepTime={10750}
        wakeTime={750}
        sleepNote={true}
        hoverToWake={true}
        wakeMessage={this.props.t('Pulsa para activar')}
        sleepOpacity={.6}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
            draggable={this.state.draggable}
            onDragend={this.updatePosition}
            position={this.state.marker}
            icon={positionIcon}
            title={this.props.t("Arrastrar para seleccionar otro punto")}
            ref={(ref) => { this.marker = ref; }}>
        </Marker>
        <CircleMarker
            center={this.state.marker} color="red"
            stroke={false}
            fillOpacity="1"
            fill={true}
            radius={3} />
        <Circle center={this.state.marker}
                ref={(ref) => { this.distanceCircle = ref; }}
                color="#145A32"
                fillColor="green"
                fillOpacity={.1}
                radius={this.state.distance * 1000} />
        <Control position="topright" >
          <ButtonToolbar>
            <Button bsStyle="success" onClick={(event) => this.doSubs(event)}>
              {this.props.t("Subscribirme a fuegos en este rádio")}
            </Button>
          </ButtonToolbar>
         </Control>
        </Map> }
      </div>
    );
  }
}

SelectionMap.propTypes = {
  history: PropTypes.object.isRequired,
  lat: PropTypes.number,
  lng: PropTypes.number,
  distance: PropTypes.number
};

export default translate([], { wait: true })(SelectionMap);
