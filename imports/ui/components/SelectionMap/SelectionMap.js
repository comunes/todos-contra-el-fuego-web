/* global setTimeout */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker, CircleMarker, Circle } from 'react-leaflet';
import Leaflet from 'leaflet';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';
import update from 'immutability-helper';
import geolocation from '/imports/startup/client/geolocation';
import { positionIcon } from '/imports/ui/components/Maps/Icons';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import 'leaflet-sleep/Leaflet.Sleep.js';
import Control from 'react-leaflet-control';
import { Button, ButtonToolbar } from 'react-bootstrap';
import './SelectionMap.scss';

class SelectionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: props.center,
      marker: props.center,
      zoom: 11,
      distance: props.distance,
      draggable: true
    };

    this.getMap = this.getMap.bind(this);
    this.toggleDraggable = this.toggleDraggable.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.fit = this.fit.bind(this);
    this.addScale = this.addScale.bind(this);
    this.onSubs = this.onSubs.bind(this);
  }

  componentDidMount() {
    if (this.isValidState()) {
      this.addScale();
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextCenter = nextProps.center[0] ? nextProps.center : this.state.center;
    const nextMarker = nextProps.center[0] ? nextProps.center : this.state.marker;
    this.setState({
      center: nextCenter,
      marker: nextMarker,
      distance: nextProps.distance || this.state.distance
    });
    this.fit();
  }

  componentDidUpdate() {
    this.fit();
  }

  onSubs() {
    this.props.onSubs({
      location: { lat: this.state.center[0], lon: this.state.center[1] },
      distance: this.state.distance
    });
  }

  getMap() {
    return this.selectionMap.leafletElement;
  }

  toggleDraggable() {
    this.setState({ draggable: !this.state.draggable });
  }

  updatePosition() {
    const { lat, lng } = this.marker.leafletElement.getLatLng();
    // console.log(`New marker lat ${lat} and lng ${lng}`);
    const currentDistance = this.state.distance;
    this.setState(update(this.state, { $merge: { marker: [lat, lng] } }));
    this.props.onSelection({ lat, lng, currentDistance });
    this.fit();
  }

  fit() {
    // console.log("fit!");
    if (this.selectionMap && this.distanceCircle) {
      this.getMap().fitBounds(this.distanceCircle.leafletElement.getBounds(), [70, 70]);
    }
  }

  addScale() {
    // https://www.npmjs.com/package/leaflet-graphicscale
    const map = this.getMap();
    const options = {
      fill: 'fill',
      showSubunits: true
    };
    // var graphicScale =
    Leaflet.control.graphicScale([options]).addTo(map);
  }

  isValidState() {
    return this.state.center && this.state.center[0] && this.state.distance;
  }

  render() {
    // console.log('render map called');
    return (
      <div>
        { this.isValidState() &&
          <Map
              center={this.state.center}
              zoom={this.state.zoom}
              ref={(map) => { this.selectionMap = map; }}
              sleep={window.location.pathname === '/'}
              sleepTime={10750}
              wakeTime={750}
              sleepNote
              hoverToWake
              wakeMessage={this.props.t('Pulsa para activar')}
              sleepOpacity={0.6}
          >
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                draggable={this.state.draggable}
                onDragend={this.updatePosition}
                position={this.state.marker}
                icon={positionIcon}
                title={this.props.t('Arrastrar para seleccionar otro punto')}
                ref={(ref) => { this.marker = ref; }}
            />
            <CircleMarker
                center={this.state.marker}
                color="red"
                stroke={false}
                fillOpacity="1"
                fill
                radius={3}
            />
            <Circle
                center={this.state.marker}
                ref={(ref) => { this.distanceCircle = ref; }}
                color="#145A32"
                fillColor="green"
                fillOpacity={0.1}
                radius={this.state.distance * 1000}
            />
            <Control position="topright" >
              <ButtonToolbar>
                <Button
                    bsStyle="success"
                    onClick={event => this.onSubs(event)}
                >
                  {this.props.subsBtn}
                </Button>
              </ButtonToolbar>
            </Control>
          </Map> }
      </div>
    );
  }
}

SelectionMap.propTypes = {
  t: PropTypes.func.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  distance: PropTypes.number,
  onSelection: PropTypes.func.isRequired,
  subsBtn: PropTypes.string.isRequired,
  onSubs: PropTypes.func.isRequired
};

export default translate([], { wait: true })(withTracker(props => ({
  center: props.center[0] ? props.center : geolocation.get(),
  distance: props.distance
}))(SelectionMap));
