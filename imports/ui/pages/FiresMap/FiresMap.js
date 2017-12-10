import React, {Component} from 'react';
import { Row, Col, Checkbox } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Trans, translate } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import { Circle, CircleMarker, Map, Marker, Popup, TileLayer, PropTypes as MapPropTypes } from 'react-leaflet';
import ActiveFiresCollection from '../../../api/ActiveFires/ActiveFires';
import FireAlertsCollection from '../../../api/FireAlerts/FireAlerts';
import UserSubsToFiresCollection from '../../../api/Subscriptions/Subscriptions';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition.js';
import { withTracker } from 'meteor/react-meteor-data';
import Loading from '../../components/Loading/Loading';
import './FiresMap.scss';
import Leaflet from 'leaflet';
import LGeo from 'leaflet-geodesy';
import union from '@turf/union';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import _ from 'lodash';

// https://stackoverflow.com/questions/35394577/leaflet-js-union-merge-circles
function unify(polyList) {
  for (var i = 0; i < polyList.length; ++i) {
    if (i == 0) {
      var unionTemp = polyList[i].toGeoJSON();
    } else {
      unionTemp =union(unionTemp, polyList[i].toGeoJSON());
    }
  }
  return L.geoJson(unionTemp);
}

const fireIcon = new Leaflet.Icon({
  iconUrl: "/fire-marker.png",
  /* shadowUrl: require('../public/marker-shadow.png'), */
  iconSize:     [16, 24], // size of the icon
  /* shadowSize:   [50, 64], // size of the shadow */
  iconAnchor:   [8, 26] // point of the icon which will correspond to marker's location
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor*/
});

const nFireIcon = new Leaflet.Icon({
  iconUrl: "/n-fire-marker.png",
  /* shadowUrl: require('../public/marker-shadow.png'), */
  iconSize:     [16, 24], // size of the icon
  /* shadowSize:   [50, 64], // size of the shadow */
  iconAnchor:   [8, 26] // point of the icon which will correspond to marker's location
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor*/
});

// http://leafletjs.com/reference-1.2.0.html#icon
const MyPopupMarker = ({ children, lat, lon, nasa}) => (
  <div><Marker position={[lat, lon]} icon={nasa? fireIcon: nFireIcon} >
    {/* <Popup>
    <span>{children}</span>
    </Popup> */}
  </Marker>
  <CircleMarker center={[lat, lon]} color={nasa? "red": "#D35400"} stroke={false} fillOpacity="1" fill={true} radius={1} />
  </div>
);

const FireMark = ({ lat, lon, scan, nasa }) => (
  <Circle center={[lat, lon]} color="red" stroke={false} fillOpacity="1" fill={true} radius={scan*1000} />
);

/* Less acurate (1 pixel per fire) but faster */
const FirePixel = ({ lat, lon, nasa }) => (
  <CircleMarker center={[lat, lon]} color={nasa? "red": "#D35400"}
                stroke={false} fillOpacity="1" fill={true} radius={2} />
);

MyPopupMarker.propTypes = {
  // https://github.com/PaulLeCam/react-leaflet/tree/master/src/propTypes
  children: MapPropTypes.children,
  lat: PropTypes.number.isRequired,
  lon:  PropTypes.number.isRequired,
  nasa:  PropTypes.bool.isRequired
};

FirePixel.propTypes = {
  lat: PropTypes.number.isRequired,
  lon:  PropTypes.number.isRequired,
  nasa:  PropTypes.bool.isRequired
};

FireMark.propTypes = {
  scan: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon:  PropTypes.number.isRequired,
  nasa:  PropTypes.bool.isRequired
};

// Below this use only pixels
const MAXZOOM = 7;

const MyMarkersList = ({ markers }) => {
  const items = markers.map(({ key, ...props }) => (
    <MyPopupMarker key={key} {...props} />
  ));
  return <div style={{ display: 'none' }}>{items}</div>;
};

const FireList = ({ fires, scale, useMarkers, nasa }) => {
  /* if (nasa) {
   *   console.log(`Scale: ${scale}`);
   *   for (var i = 0; i < fires.length; i ++) {
   *     console.log(fires[i].scan);
   *   }
   * }*/
  const items = fires.map(({ _id, ...props }) => (
    useMarkers && !scale? <MyPopupMarker key={_id} nasa={nasa} {...props} />:
    (!nasa && !scale)? <FirePixel key={_id} nasa={nasa} {...props} />:<FireMark key={_id} nasa={nasa} {...props} />));
  return <div style={{ display: 'none' }}>{items}</div>;
};

MyMarkersList.propTypes = {
  markers: PropTypes.array.isRequired
};

const DEF_LAT = 35.159028;
const DEF_LNG = -46.738057;
const DEFAULT_VIEWPORT = {
  center: [DEF_LAT, DEF_LNG], // a point in the sea
  zoom: 8
};

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
  }

  centerOnUserLocation = (viewport) => {
    this.onViewportChanged(viewport);
  };

  componentDidMount() {
    height.set(this.divElement.clientHeight);
    width.set(this.divElement.clientWidth);
    this.addScale();
    const self = this;
    this.handleViewportChangeDebounced = _.debounce(function (viewport) {
      console.log(`Viewport changed: ${JSON.stringify(this.state.viewport)}`);
      zoom.set(viewport.zoom);
      lat.set(viewport.center[0]);
      lng.set(viewport.center[1]);
      self.state.viewport = viewport;
      self.state.modified = true;
      if (self.props.subsready && self.refs.fireMap) {
        self.showSubsUnion(self.state.showSubsUnion);
      }
    }, 2000);
  }

  // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
  onViewportChanged = (viewport) => {
    this.handleViewportChangeDebounced(viewport);
  };

  onClickReset = () => {
    // console.log("onclick");
    // this.setState({ viewport: DEFAULT_VIEWPORT })
  }

  useMarkers = (use) => {
    this.state.useMarkers = use;
    this.forceUpdate();
  }

  getMap = () => {
    return this.refs['fireMap'].leafletElement;
  }

  showSubsUnion = (show) => {
    this.state.showSubsUnion = show;
    const map = this.getMap();
    // http://leafletjs.com/reference-1.2.0.html#layergroup
    var unionGroup = this.unionGroup;

    if (this.union) {
      map.removeLayer(this.union);
    }

    if (show) {
      // http://leafletjs.com/reference-1.2.0.html#path
      var copts = {
        parts: 144
      };
      UserSubsToFiresCollection.find().forEach( function(subs){
        var circle = LGeo.circle([subs.lat, subs.lon], subs.distance * 1000, copts);
        circle.addTo(unionGroup);
      });
      this.union = unify(unionGroup.getLayers());
      this.union.setStyle({
        color: "#145A32",
        fillColor: "green",
        fillOpacity: .1
      });
      this.union.addTo(map);
    }
  }

  addScale = () => {
    // https://www.npmjs.com/package/leaflet-graphicscale
    const map = this.getMap();
    var options = {
      fill: 'fill',
      showSubunits: true
    };
    var graphicScale = L.control.graphicScale([options]).addTo(map);
  }

  render() {
    this.state.viewport = !this.state.modified && this.props.viewport && Array.isArray(this.props.viewport.center)? this.props.viewport: this.state.viewport;

    if (this.props.subsready && this.refs.fireMap) {
      // Show union of users
      this.showSubsUnion(this.state.showSubsUnion);
    };

    return (
      /* Large number of markers:
         https://stackoverflow.com/questions/43015854/large-dataset-of-markers-or-dots-in-leaflet/43019740#43019740 */
      <div
         ref={ (divElement) => this.divElement = divElement}
      >
        {this.props.loading ?
         <Row className="align-items-center justify-content-center">
           <Loading />
         </Row>
         :""}
         <h4 className="page-header"><Trans parent="span">Fuegos activos</Trans></h4>
         <Row>
           <Col xs={12} sm={6} md={6} lg={6} >
             <p>
             {this.props.activefires.length === 0?
              <Trans parent="span" i18nKey="noActiveFireInMapCount">No hay fuegos activos en esta zona del mapa. Hay un total de <strong>{{countTotal: this.props.activefirestotal}}</strong> fuegos activos detectados en todo el mundo.</Trans>:<Trans parent="span" i18nKey="activeFireInMapCount">En rojo, <strong>{{count: this.props.activefires.length}}</strong> fuegos activos en el mapa. Hay un total de <strong>{{countTotal: this.props.activefirestotal}}</strong> fuegos activos detectados en todo el mundo por la NASA.</Trans>
             }
             </p>
             <p><Trans parent="span" i18nKey="activeNeigFireInMapCount">En naranja, los fuegos notificados por nuestros usuarios/as recientemente.</Trans></p>
           </Col>
           <Col xs={12} sm={6} md={6} lg={6} >
             <Checkbox inline={false} defaultChecked={this.state.showSubsUnion} onClick={e => this.showSubsUnion(e.target.checked)}>
               <Trans className="mark-checkbox" parent="span">Resaltar en verde el área vigilada por nuestros usuarios/as</Trans>&nbsp;(*)
             </Checkbox>
             <Checkbox disabled={this.state.viewport.zoom < MAXZOOM} inline={false} onClick={e => this.useMarkers(e.target.checked)}>
               <Trans className="mark-checkbox" parent="span">Resaltar los fuegos con un marcador</Trans>
             </Checkbox>
             <CenterInMyPosition onClick={(viewport) => this.centerOnUserLocation(viewport)} />
           </Col>
         </Row>
         <Row>
           <Map ref="fireMap"
                animate={true}
                preferCanvas={true}
                onClick={this.onClickReset}
                viewport={this.state.viewport}
                onViewportChanged={this.onViewportChanged}>
             {/* http://wiki.openstreetmap.org/wiki/Tile_servers */}
             <TileLayer
                 attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                 url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
             />
             <FireList
                 fires={this.props.activefires}
                 scale={this.state.viewport.zoom > MAXZOOM}
                 useMarkers={this.state.useMarkers}
                 nasa={true}
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
           <p><span style={{paddingRight: "5px"}}>(*)</span><Trans i18nKey="mapPrivacy" parent="span"><em>Para preservar la privacidad de nuestros usuarios/as, los datos reflejados están aleatoriamente alterados y son solo orientativos.</em></Trans></p>
         </Row>
      </div>
    );
  };
};

const zoom = new ReactiveVar(8);
const lat = new ReactiveVar(DEF_LAT);
const lng = new ReactiveVar(DEF_LNG);
const height = new ReactiveVar(400);
const width = new ReactiveVar(400);

FiresMap.propTypes = {
  loading: PropTypes.bool.isRequired,
  subsready: PropTypes.bool.isRequired,
  activefires: PropTypes.arrayOf(PropTypes.object).isRequired,
  activefirestotal: PropTypes.number.isRequired,
  viewport: PropTypes.object.isRequired
};

Meteor.call("geo", function (error, response) {
  if (error) {
    console.warn(error);
  } else {
    lat.set(response.location.latitude);
    lng.set(response.location.longitude);
  }
});

export default translate([], { wait: true }) (withTracker(() => {
  var subscription;
  Meteor.autorun(function() {
    // Subscribe for the current templateId (only if one is selected). Note this
    // will automatically clean up any previously subscribed data and it will
    // also stop all subscriptions when this template is destroyed.
    if (zoom.get() || lat.get() || lng.get()) {
      subscription = Meteor.subscribe('activefiresmyloc', zoom.get(), lat.get(), lng.get(), height.get(), width.get());
    }
  });

  Meteor.subscribe('activefirestotal');
  // Right now to all neighborhood alerts
  Meteor.subscribe('fireAlerts');
  var userSubs = Meteor.subscribe('userSubsToFires');
  // const subscription = Meteor.subscribe('activefiresmyloc', zoom.get());
  // console.log(`Active fires ${ActiveFiresCollection.find().fetch().length} of ${Counter.get('countActiveFires')}`);
  // console.log(`Active neighborhood fires ${FireAlertsCollection.find().fetch().length} and users subscribed ${UserSubsToFiresCollection.find().fetch().length}`);
  // console.log(UserSubsToFiresCollection.find().fetch());
  return {
    loading: !subscription.ready(),
    subsready: userSubs.ready(),
    activefires: ActiveFiresCollection.find().fetch(),
    activefirestotal: Counter.get('countActiveFires'),
    firealerts: FireAlertsCollection.find().fetch().map(
      doc => ( { _id: doc['_id'], lat: doc['location'].lat, lon: doc['location'].lon })),
    userSubs: UserSubsToFiresCollection.find().fetch(),
    viewport: {
      center: [lat.get(), lng.get()], // a point in the sea
      zoom: zoom.get()
    }
  };
})(FiresMap));
