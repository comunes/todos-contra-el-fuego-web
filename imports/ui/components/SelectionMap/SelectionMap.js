/* global setTimeout */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Map, Marker, CircleMarker, Circle, Tooltip } from 'react-leaflet';
import Leaflet from 'leaflet';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';
import update from 'immutability-helper';
import geolocation from '/imports/startup/client/geolocation';
import { positionIcon, removeIcon } from '/imports/ui/components/Maps/Icons';
import DefMapLayers from '/imports/ui/components/Maps/DefMapLayers';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import 'leaflet-sleep/Leaflet.Sleep.js';
import Control from 'react-leaflet-control';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import subsUnion from '/imports/ui/components/Maps/SubsUnion/SubsUnion';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import { isChrome } from '/imports/ui/components/Utils/isMobile';
import FullScreenMap from '/imports/ui/components/Maps/FullScreenMap';

import './SelectionMap.scss';

export const action = {
  view: 0,
  add: 1,
  edit: 2
};

class SelectionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: props.center,
      marker: props.center,
      zoom: props.zoom || 11,
      distance: props.distance,
      draggable: true,
      subsFit: this.props.action !== action.add
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
    this.fit();
  }

  onFstBtn() {
    this.props.onFstBtn({
      location: { lat: this.state.marker[0], lon: this.state.marker[1] },
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
    this.state.subsFit = false;
    this.state.center = viewport.center;
    this.state.zoom = viewport.zoom;
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
    if (this.props.currentSubs.length > 0 && this.state.subsFit && this.props.action !== action.add) {
      // has autofit, do nothing
    } else if (this.selectionMap && this.distanceCircle) {
      if (!this.getMap().getBounds().contains(this.distanceCircle.leafletElement.getBounds())) {
        // console.log('New area circle not visible');
        this.getMap().fitBounds(this.distanceCircle.leafletElement.getBounds()); // padding , [70, 70]);
      } else {
        // console.log('New area circle visible');
      }
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
    return !this.props.loadingSubs && this.state.center && this.state.center[0];
  }

  handleLeafletLoad(map) {
    if (this.props.currentSubs && map && !this.props.loadingSubs) {
      const subsOpts = {
        map,
        show: true,
        fit: this.state.subsFit,
        subs: this.props.currentSubs
      };
      if (this.props.action === action.add) {
        subsOpts.color = 'gray';
      }
      this.state.union = subsUnion(this.state.union, subsOpts);
    }
  }

  render() {
    const { t, onRemove } = this.props;
    return (
      this.isValidState() ?
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Map
              ref={(map) => {
                  this.selectionMap = map;
                  this.handleLeafletLoad(map);
                }}
              zoom={this.state.zoom}
              center={this.state.center}
              className="selectionmap-leaflet-container"
              onViewportChanged={this.onViewportChanged}
              animate
              sleep={window.location.pathname === '/' && !isChrome}
              sleepTime={10750}
              wakeTime={750}
              sleepNote
              hoverToWake={false}
              wakeMessage={t('Pulsa para activar')}
              wakeMessageTouch={t('Pulsa para activar')}
              sleepOpacity={0.6}
          >
            <DefMapLayers osmcolor />
            {this.props.action === action.edit &&
             this.props.currentSubs.map((subs, index) => (
               <Marker
                   key={subs._id}
                   draggable={false}
                   position={[subs.location.lat, subs.location.lon]}
                   icon={removeIcon}
                   title={t('Pulsa para borrar')}
                   onClick={() => { onRemove(subs._id); }}
               >
                 {index === 0 &&
                  <Tooltip
                      permanent
                      direction="right"
                      /* Use .openTooltip(); in the future */
                      offset={[10, -10]}
                  >
                    <span>{t('Pulsa aquí para borrar la zona')}</span>
                  </Tooltip>
                 }
               </Marker>
             ))
            }
               {this.props.action === action.add &&
                <Fragment>
                  <Marker
                      draggable={this.state.draggable}
                      onDragend={this.updatePosition}
                      position={this.state.marker}
                      icon={positionIcon}
                      title={t('Arrastrar para seleccionar otro punto')}
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
                </Fragment>
               }
                <Control position="topright" >
                  <ButtonGroup>
                    { this.props.sndBtn && this.props.onSndBtn &&
                      <Button
                          bsStyle="warning"
                          onClick={event => this.onSndBtn(event)}
                      >
                        {this.props.sndBtn.match(/^fa-/) ? <i className={`fa ${this.props.sndBtn}`} /> : this.props.sndBtn }
                      </Button>
                    }
                      <Button
                          bsStyle="success"
                          disabled={this.props.disableFstBtn}
                          onClick={event => this.onFstBtn(event)}
                      >
                        {this.props.fstBtn}
                      </Button>
                  </ButtonGroup>
                </Control>
                <FullScreenMap />
          </Map>
        </Col>
      </Row>
        :
      <div />);
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
  onRemove: PropTypes.func,
  action: PropTypes.number.isRequired,
  loadingSubs: PropTypes.bool.isRequired,
  disableFstBtn: PropTypes.bool.isRequired,
  currentSubs: PropTypes.arrayOf(PropTypes.shape({
    location: PropTypes.shape({ latitude: PropTypes.number, longitude: PropTypes.number }).isRequired,
    distance: PropTypes.number.isRequired
  }))
};

export default translate([], { wait: true })(withTracker((props) => {
  const subscription = Meteor.subscribe('mysubscriptions');
  // console.log(props.loadingSubs);
  return {
    center: props.center[0] !== null ? props.center : geolocation.get(),
    distance: props.distance,
    loadingSubs: !subscription.ready(),
    currentSubs: UserSubsToFiresCollection.find({ owner: Meteor.userId() }).fetch() // type: 'web'
  };
})(SelectionMap));
