import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker, Popup, CircleMarker, Circle} from 'react-leaflet';
import Leaflet from 'leaflet';
import { withTracker } from 'meteor/react-meteor-data';
import { translate, Trans } from 'react-i18next';
import geolocation from '/imports/startup/client/geolocation';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import Control from 'react-leaflet-control';
import { Button, ButtonToolbar } from 'react-bootstrap';
import DistanceSlider from '/imports/ui/components/DistanceSlider/DistanceSlider';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition.js';
import './SelectionMap.scss';

const positionIcon = new Leaflet.Icon({
  iconUrl: "/your-position.png",
  /* shadowUrl: require('../public/marker-shadow.png'), */
  iconSize:     [50, 77], // size of the icon
  /* shadowSize:   [50, 64], // size of the shadow */
  iconAnchor:   [25, 82], // point of the icon which will correspond to marker's location
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor*/
})

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
    // console.log(this.state);
  }

  componentDidUpdate = () => {
    this.fit();
  }

  getMap = () => {
    return this.refs.selectionMap.leafletElement;
  }

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable })
  }

  updatePosition = () => {
    const { lat, lng } = this.refs.marker.leafletElement.getLatLng()
    this.setState({
      marker: [ lat, lng ],
      modified: true
    });
    this.fit();
  }

  fit() {
    // console.log("fit!");
    this.getMap().fitBounds(this.refs.distanceCircle.leafletElement.getBounds(), [70, 70]);
  }

  componentDidMount() {
    this.addScale();
  }

  addScale = () => {
    // https://www.npmjs.com/package/leaflet-graphicscale
    const map = this.getMap();
    var options = {
      fill: 'fill',
      showSubunits: true,
    }
    var graphicScale = L.control.graphicScale([options]).addTo(map);
  }

  doSubs = (event) => {
    console.log(event);
  }

  centerOnUserLocation = (event) => {
    console.log(event);
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
        <Map center={this.state.center} zoom={this.state.zoom} ref="selectionMap">
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
          ref="marker">
        </Marker>
        <CircleMarker
            center={this.state.marker} color="red"
            stroke={false}
            fillOpacity="1"
            fill={true}
            radius={3} />
        <Circle center={this.state.marker}
                ref="distanceCircle"
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
    )
  }
}

SelectionMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  distance: PropTypes.number
};

export default translate([], { wait: true })(SelectionMap);
