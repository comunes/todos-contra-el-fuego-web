/* global setTimeout */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-absolute-path */
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
import { Button, ButtonGroup } from 'react-bootstrap';
import subsUnion from '/imports/ui/components/Maps/SubsUnion/SubsUnion';
import './SelectionMap.scss';

class SelectionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: props.center,
      marker: props.center,
      zoom: props.zoom,
      distance: props.distance,
      draggable: true
    };

    this.getMap = this.getMap.bind(this);
    this.toggleDraggable = this.toggleDraggable.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.fit = this.fit.bind(this);
    this.addScale = this.addScale.bind(this);
    this.onFstBtn = this.onFstBtn.bind(this);
    this.onViewportChanged = this.onViewportChanged.bind(this);
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
    // this.fit();
  }

  componentDidUpdate() {
    // this.fit();
  }

  onFstBtn() {
    this.props.onFstBtn({
      location: { lat: this.state.center[0], lon: this.state.center[1] },
      distance: this.state.distance
    });
  }

  onSndBtn() {
    this.props.onSndBtn();
  }

  onViewportChanged(viewport) {
    if (this.props.onViewportChanged) {
      this.props.onViewportChanged(viewport);
    }
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
    if (this.props.onSelection) {
      this.props.onSelection({ lat, lng, currentDistance });
    }
    this.fit();
  }

  fit() {
    // console.log("fit!");
    if (this.subsUnionElement) {
      // has autofit
    } else if (this.selectionMap && this.distanceCircle) {
      this.getMap().fitBounds(this.distanceCircle.leafletElement.getBounds(), [70, 70]);
    }
  }

  addScale() {
    if (this.selectionMap) {
      // https://www.npmjs.com/package/leaflet-graphicscale
      const map = this.getMap();
      const options = {
        fill: 'fill',
        showSubunits: true
      };
      // var graphicScale =
      Leaflet.control.graphicScale([options]).addTo(map);
    }
  }

  isValidState() {
    return this.state.center && this.state.center[0];
  }

  handleLeafletLoad(map) {
    if (this.props.readOnly && this.props.currentSubs && map && !this.props.loadingSubs) {
      this.state.union = subsUnion(this.state.union, {
        map,
        show: true,
        fit: true,
        subs: this.props.currentSubs
      });
    }
  }

  render() {
    return (
      <div>
        { this.isValidState() &&
          <div className="leaflet-container">
            <Map
                /* className="sidebar-map" */
                center={this.state.center}
                zoom={this.state.zoom}
                ref={(map) => {
                    this.selectionMap = map;
                    this.handleLeafletLoad(map);
                  }}
                sleep={window.location.pathname === '/'}
                sleepTime={10750}
                wakeTime={750}
                onViewportChanged={this.onViewportChanged}
                sleepNote
                hoverToWake
                wakeMessage={this.props.t('Pulsa para activar')}
                sleepOpacity={0.6}
            >
              <TileLayer
                  attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {!this.props.readOnly &&
              <Marker
                  draggable={this.state.draggable}
                  onDragend={this.updatePosition}
                  position={this.state.marker}
                  icon={positionIcon}
                  title={this.props.t('Arrastrar para seleccionar otro punto')}
                  ref={(ref) => { this.marker = ref; }}
              /> }
              {!this.props.readOnly &&
              <CircleMarker
                  center={this.state.marker}
                  color="red"
                  stroke={false}
                  fillOpacity="1"
                  fill
                  radius={3}
              /> }
              {!this.props.readOnly &&
              <Circle
                  center={this.state.marker}
                  ref={(ref) => { this.distanceCircle = ref; }}
                  color="#145A32"
                  fillColor="green"
                  fillOpacity={0.1}
                  radius={this.state.distance * 1000}
              /> }
              <Control position="topright" >
                <ButtonGroup>
                  { this.props.sndBtn && this.props.onSndBtn &&
                    <Button
                        bsStyle="warning"
                        onClick={event => this.onSndBtn(event)}
                    >
                      {this.props.sndBtn}
                    </Button>
                  }
                    <Button
                        bsStyle="success"
                        onClick={event => this.onFstBtn(event)}
                    >
                      {this.props.fstBtn}
                    </Button>
                </ButtonGroup>
              </Control>
            </Map>
          </div>
        }
      </div>
    );
  }
}

SelectionMap.defaultProps = {
  zoom: 11
};

SelectionMap.propTypes = {
  t: PropTypes.func.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  distance: PropTypes.number,
  onSelection: PropTypes.func,
  onViewportChanged: PropTypes.func,
  fstBtn: PropTypes.string.isRequired,
  onFstBtn: PropTypes.func.isRequired,
  sndBtn: PropTypes.string,
  onSndBtn: PropTypes.func,
  readOnly: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  loadingSubs: PropTypes.bool,
  currentSubs: PropTypes.arrayOf(PropTypes.shape({
    location: PropTypes.shape({ latitude: PropTypes.number, longitude: PropTypes.number }).isRequired,
    distance: PropTypes.number.isRequired
  }))
};

export default translate([], { wait: true })(withTracker(props => ({
  center: props.center[0] !== null ? props.center : geolocation.get(),
  distance: props.distance
}))(SelectionMap));
