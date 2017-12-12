/* global L Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Checkbox } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { withTracker } from 'meteor/react-meteor-data';
import { Trans, translate } from 'react-i18next';
import { Map, TileLayer } from 'react-leaflet';
import LGeo from 'leaflet-geodesy';
import _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import 'leaflet-sleep/Leaflet.Sleep.js';
import geolocation from '/imports/startup/client/geolocation';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition';
import FireList from '/imports/ui/components/Maps/FireList';
import { unify } from '/imports/ui/components/Maps/Utils';
import Loading from '/imports/ui/components/Loading/Loading';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import FireAlertsCollection from '/imports/api/FireAlerts/FireAlerts';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import './FiresMap.scss';

const MAXZOOM = 6;
const DEF_LAT = 35.159028;
const DEF_LNG = -46.738057;
const DEFAULT_VIEWPORT = {
  center: [DEF_LAT, DEF_LNG], // a point in the sea
  zoom: 8
};
const zoom = new ReactiveVar(8);
const lat = new ReactiveVar(DEF_LAT);
const lng = new ReactiveVar(DEF_LNG);
const height = new ReactiveVar(400);
const width = new ReactiveVar(400);

class FiresMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: DEFAULT_VIEWPORT,
      modified: false,
      useMarkers: false,
      showSubsUnion: true
    };
    this.unionGroup = new L.LayerGroup();
    const self = this;
    // viewportchange
    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.debounceView = _.debounce((viewport) => {
      self.handleViewportChange(viewport);
    }, 2000);
    this.onViewportChanged = this.onViewportChanged.bind(this);
  }

  componentDidMount() {
    height.set(this.divElement.clientHeight);
    width.set(this.divElement.clientWidth);
    this.addScale();
  }

  onViewportChanged(viewport) {
    this.debounceView(viewport);
  }

  onClickReset() {
    // console.log("onclick");
    // this.setState({ viewport: DEFAULT_VIEWPORT })
  }

  getMap() {
    return this.fireMap.leafletElement;
  }

  handleViewportChange(viewport) {
    console.log(`Viewport changed: ${JSON.stringify(viewport)}`);
    zoom.set(viewport.zoom);
    lat.set(viewport.center[0]);
    lng.set(viewport.center[1]);
    this.setState({ viewport, modified: true });
    /* this.state.viewport = viewport;
     * this.state.modified = true; */
    if (this.props.subsready && this.fireMap) {
      this.showSubsUnion(this.state.showSubsUnion);
    }
  }

  centerOnUserLocation(viewport) {
    this.handleViewportChange(viewport);
  }

  useMarkers(use) {
    /* this.setState({ userMarkers: use });*/
    this.state.useMarkers = use;
    // this.forceUpdate();
  }

  showSubsUnion(show) {
    // this.setState({ showSubsUnion: show });
    this.state.showSubsUnion = show;
    const map = this.getMap();
    // http://leafletjs.com/reference-1.2.0.html#layergroup
    const self = this;

    if (this.union) {
      map.removeLayer(this.union);
    }

    if (show) {
      // http://leafletjs.com/reference-1.2.0.html#path
      const copts = {
        parts: 144
      };
      UserSubsToFiresCollection.find().forEach((subs) => {
        const circle = LGeo.circle([subs.lat, subs.lon], subs.distance * 1000, copts);
        circle.addTo(self.unionGroup);
      });
      this.union = unify(self.unionGroup.getLayers());
      this.union.setStyle({
        color: '#145A32',
        fillColor: 'green',
        fillOpacity: 0.1
      });
      this.union.addTo(map);
    }
  }

  addScale() {
    // https://www.npmjs.com/package/leaflet-graphicscale
    const map = this.getMap();
    const options = {
      fill: 'fill',
      showSubunits: true
    };
    L.control.graphicScale([options]).addTo(map);
  }

  render() {
    this.state.viewport = !this.state.modified && this.props.viewport && Array.isArray(this.props.viewport.center)? this.props.viewport: this.state.viewport;

    if (this.props.subsready && this.fireMap) {
      // Show union of users
      this.showSubsUnion(this.state.showSubsUnion);
    }

    return (
      /* Large number of markers:
         https://stackoverflow.com/questions/43015854/large-dataset-of-markers-or-dots-in-leaflet/43019740#43019740 */
      <div
          ref={(divElement) => { this.divElement = divElement; }}
      >
        {this.props.loading ?
         <Row className="align-items-center justify-content-center">
           <Loading />
         </Row>
         : ''}
         <h4 className="page-header"><Trans parent="span">Fuegos activos</Trans></h4>
         <Row>
           <Col xs={12} sm={6} md={6} lg={6} >
             <p>
             { this.props.activefires.length === 0 ?
               <Trans parent="span" i18nKey="noActiveFireInMapCount">No hay fuegos activos en esta zona del mapa. Hay un total de <strong>{{ countTotal: this.props.activefirestotal }}</strong> fuegos activos detectados en todo el mundo.</Trans> :
               <Trans parent="span" i18nKey="activeFireInMapCount">En rojo, <strong>{{ count: this.props.activefires.length }}</strong> fuegos activos en el mapa. Hay un total de <strong>{{ countTotal: this.props.activefirestotal }}</strong> fuegos activos detectados en todo el mundo por la NASA.</Trans>
             }
             </p>
             <p><Trans parent="span" i18nKey="activeNeigFireInMapCount">En naranja, los fuegos notificados por nuestros usuarios/as recientemente.</Trans></p>
           </Col>
           <Col xs={12} sm={6} md={6} lg={6}>
             <Checkbox inline={false} defaultChecked={this.state.showSubsUnion} onClick={e => this.showSubsUnion(e.target.checked)}>
               <Trans className="mark-checkbox" parent="span">Resaltar en verde el área vigilada por nuestros usuarios/as</Trans>&nbsp;(*)
             </Checkbox>
             {(this.state.viewport.zoom >= MAXZOOM) &&
              <Checkbox inline={false} onClick={e => this.useMarkers(e.target.checked)}>
               <Trans className="mark-checkbox" parent="span">Resaltar los fuegos con un marcador</Trans>
              </Checkbox>}
              <CenterInMyPosition onClick={viewport => this.centerOnUserLocation(viewport)} />
           </Col>
         </Row>
         <Row>
           {/* https://github.com/CliffCloud/Leaflet.Sleep */}
           <Map
               ref={(map) => { this.fireMap = map; }}
               animate
               minZoom={5}
               preferCanvas
               onClick={this.onClickReset}
               viewport={this.state.viewport}
               onViewportChanged={this.onViewportChanged}
               sleep={window.location.pathname === '/'}
               sleepTime={750}
               wakeTime={750}
               sleepNote
               hoverToWake
               wakeMessage={this.props.t('Pulsa para activar')}
               sleepOpacity={0.6}
           >
             {/* http://wiki.openstreetmap.org/wiki/Tile_servers */}
             <TileLayer
                 attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                 url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
             />
             <FireList
                 fires={this.props.activefires}
                 scale={this.state.viewport.zoom >= MAXZOOM}
                 useMarkers={this.state.useMarkers}
                 nasa
             />
             <FireList
                 fires={this.props.firealerts}
                 scale={false}
                 useMarkers={this.state.useMarkers}
                 nasa={false}
             />
           </Map>
         </Row>
         <Row>
           <p><span style={{ paddingRight: '5px' }}>(*)</span><Trans i18nKey="mapPrivacy" parent="span"><em>Para preservar la privacidad de nuestros usuarios/as, los datos reflejados están aleatoriamente alterados y son solo orientativos.</em></Trans></p>
         </Row>
      </div>
    );
  }
}

FiresMap.propTypes = {
  loading: PropTypes.bool.isRequired,
  subsready: PropTypes.bool.isRequired,
  activefires: PropTypes.arrayOf(PropTypes.object).isRequired,
  firealerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  activefirestotal: PropTypes.number.isRequired,
  viewport: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(withTracker(() => {
  let subscription;
  Meteor.autorun(() => {
    // Subscribe for the current templateId (only if one is selected). Note this
    // will automatically clean up any previously subscribed data and it will
    // also stop all subscriptions when this template is destroyed.
    if (geolocation.get()) {
      lat.set(geolocation.get()[0]);
      lng.set(geolocation.get()[1]);
    }
    if (zoom.get() || lat.get() || lng.get()) {
      subscription = Meteor.subscribe('activefiresmyloc', zoom.get(), lat.get(), lng.get(), height.get(), width.get());
    }
  });

  Meteor.subscribe('activefirestotal');
  // Right now to all neighborhood alerts
  Meteor.subscribe('fireAlerts');
  const userSubs = Meteor.subscribe('userSubsToFires');
  // const subscription = Meteor.subscribe('activefiresmyloc', zoom.get());
  // console.log(`Active fires ${ActiveFiresCollection.find().fetch().length} of ${Counter.get('countActiveFires')}`);
  // console.log(`Active neighborhood fires ${FireAlertsCollection.find().fetch().length} and users subscribed ${UserSubsToFiresCollection.find().fetch().length}`);
  // console.log(UserSubsToFiresCollection.find().fetch());
  return {
    loading: !subscription.ready(),
    subsready: userSubs.ready(),
    activefires: ActiveFiresCollection.find().fetch(),
    activefirestotal: Counter.get('countActiveFires'),
    firealerts: FireAlertsCollection.find().fetch().map(doc => (
      { _id: doc._id, lat: doc.location.lat, lon: doc.location.lon }
    )),
    userSubs: UserSubsToFiresCollection.find().fetch(),
    viewport: {
      center: geolocation.get(),
      zoom: zoom.get()
    }
  };
})(FiresMap));
