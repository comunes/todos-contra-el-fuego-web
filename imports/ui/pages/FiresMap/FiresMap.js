import React, {Component} from 'react';
import { Row, Button, Checkbox } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Trans, Interpolate, translate } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import { Circle, CircleMarker, Map, Marker, Popup, TileLayer, PropTypes as MapPropTypes } from 'react-leaflet'
import ActiveFiresCollection from '../../../api/ActiveFires/ActiveFires';
import { withTracker } from 'meteor/react-meteor-data';
import Loading from '../../components/Loading/Loading';
import './FiresMap.scss';
import Leaflet from 'leaflet'

const fireIcon = new Leaflet.Icon({
  iconUrl: "/fire-marker.png",
  /* shadowUrl: require('../public/marker-shadow.png'), */
  iconSize:     [16, 24], // size of the icon
  /* shadowSize:   [50, 64], // size of the shadow */
  iconAnchor:   [8, 26], // point of the icon which will correspond to marker's location
  /* shadowAnchor: [4, 62],  // the same for the shadow
   * popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor*/
})

// http://leafletjs.com/reference-1.2.0.html#icon
const MyPopupMarker = ({ children, lat, lon}) => (
  <Marker position={[lat, lon]} icon={fireIcon} >
    {/* <Popup>
    <span>{children}</span>
    </Popup> */}
  </Marker>
)

const FireMark = ({ lat, lon, scan }) => (
  <Circle center={[lat, lon]} color="red" stroke={false} fillOpacity="1" fill={true} radius={scan*1000} />
)

/* Less acurate (1 pixel per fire) but faster */
const Fire = ({ lat, lon, scan }) => (
  <CircleMarker center={[lat, lon]} color="red" stroke={false} fillOpacity="1" fill={true} radius={1} />
)

MyPopupMarker.propTypes = {
  children: MapPropTypes.children,
  lat: PropTypes.number.isRequired,
  lon:  PropTypes.number.isRequired,
}

Fire.propTypes = {
  scan: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon:  PropTypes.number.isRequired,
}

FireMark.propTypes = {
  scan: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon:  PropTypes.number.isRequired,
}

const MyMarkersList = ({ markers }) => {
  const items = markers.map(({ key, ...props }) => (
    <MyPopupMarker key={key} {...props} />
  ))
  return <div style={{ display: 'none' }}>{items}</div>
}

const FireList = ({ activefires, scale, useMarkers }) => {
  // console.log("Scaling? :" +  scale);
  const items = activefires.map(({ _id, ...props }) => (
    (useMarkers? <MyPopupMarker key={_id} {...props} />:"") +
    scale? <Fire key={_id} {...props} />:<FireMark key={_id} {...props} />))
  return <div style={{ display: 'none' }}>{items}</div>
}

MyMarkersList.propTypes = {
  markers: PropTypes.array.isRequired,
}

const DEF_LAT = 35.159028;
const DEF_LNG = -46.738057;
const DEFAULT_VIEWPORT = {
  center: [DEF_LAT, DEF_LNG], // a point in the sea
  zoom: 8,
}

class FiresMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: DEFAULT_VIEWPORT,
      modified: false,
      userMarkers: true
    }
  }

  centerOnUserLocation = () => {
    // https://atmospherejs.com/mdg/geolocation
    // only with SSL:
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

    // https://stackoverflow.com/questions/31608579/somethings-wrong-with-my-meteor-geolocation-functions
    var userGeoLocation = new ReactiveVar(null);
    var state = this.state;
    var self = this;
    Tracker.autorun(function (computation) {
      userGeoLocation.set(Geolocation.latLng());
      if (userGeoLocation.get()) {
        //stop the tracker if we got something
        var viewport = {
          center: [userGeoLocation.get().lat, userGeoLocation.get().lng],
          zoom: 11
        }
        self.onViewportChanged(viewport);
        // console.log(userGeoLocation.get());
        computation.stop();
      }
    });
  }

  componentDidMount() {
    height.set(this.divElement.clientHeight);
    width.set(this.divElement.clientWidth);
  }

  onViewportChanged = viewport => {
    // console.log(`Viewport changed: ${JSON.stringify(this.state.viewport)}`);
    zoom.set(viewport.zoom);
    lat.set(viewport.center[0]);
    lng.set(viewport.center[1]);
    this.state.viewport = viewport;
    this.state.modified = true
  }

  onClickReset = () => {
    // console.log("onclick");
    // this.setState({ viewport: DEFAULT_VIEWPORT })
  }

  useMarkers = (use) => {
    this.state.useMarkers = use;
    this.forceUpdate();
  }

  render() {
    this.state.viewport = !this.state.modified && this.props.viewport && Array.isArray(this.props.viewport.center)? this.props.viewport: this.state.viewport;

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
           {this.props.activefires.length === 0?
            <Trans parent="p" i18nKey="noActiveFireInMapCount">No hay fuegos activos en esta zona del mapa. Hay un total de <strong>{{countTotal: this.props.activefirestotal}}</strong> fuegos activos detectados en todo el mundo.</Trans>:
           <Trans parent="p" i18nKey="activeFireInMapCount">En rojo, <strong>{{count: this.props.activefires.length}}</strong> fuegos activos en el mapa. Hay un total de <strong>{{countTotal: this.props.activefirestotal}}</strong> fuegos activos detectados en todo el mundo.</Trans>
           }
           <Checkbox onClick={e => this.useMarkers(e.target.checked)}>
             <Trans parent="span">Resaltar los fuegos con un marcador</Trans></Checkbox>
         </Row>
         <Row>
           <Map
               animate={true}
               preferCanvas={false}
               onClick={this.onClickReset}
               viewport={this.state.viewport}
               onViewportChanged={this.onViewportChanged}
           >
             {/* http://wiki.openstreetmap.org/wiki/Tile_servers */}
             <TileLayer
                 attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                 url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
             />
             <FireList
                 activefires={this.props.activefires}
                 scale={this.state.viewport.zoom > 8}
                 useMarkers={this.state.useMarkers}
             />
           </Map>
         </Row>
         <Row>
           <p>
             <em><Trans parent="span">Fuente NASA y alertas vecinales de nuestr@s usuari@s.</Trans></em>
           </p>
         </Row>
         <Row>
           <Button bsStyle="default" onClick={() => this.centerOnUserLocation()}>
             <i className="location"/>
             <Trans className="location" parent="span">Centrar el mapa en tu ubicación</Trans>
           </Button>
         </Row>
      </div>
    );
  }
}

const geoip = new ReactiveVar('');
const zoom = new ReactiveVar(8);
const lat = new ReactiveVar(DEF_LAT);
const lng = new ReactiveVar(DEF_LNG);
const height = new ReactiveVar(400);
const width = new ReactiveVar(400);

FiresMap.propTypes = {
  loading: PropTypes.bool.isRequired,
  activefires: PropTypes.arrayOf(PropTypes.object).isRequired,
  activefirestotal: PropTypes.number.isRequired,
  viewport: PropTypes.object.isRequired
};

Meteor.call("geo", function (error, response) {
  if (error) {
    console.warn(error);
  } else {
    geoip.set([response.location.latitude, response.location.longitude] );
  }
});

export default translate([], { wait: true }) (withTracker(() => {
  var subscription;
  Meteor.autorun(function() {
    // Subscribe for the current templateId (only if one is selected). Note this
    // will automatically clean up any previously subscribed data and it will
    // also stop all subscriptions when this template is destroyed.
    if (zoom.get())
      // TODO select position
      subscription = Meteor.subscribe('activefiresmyloc', zoom.get(), lat.get(), lng.get(), height.get(), width.get());
  });
  Meteor.subscribe('activefirestotal');
  // const subscription = Meteor.subscribe('activefiresmyloc', zoom.get());

  return {
    loading: !subscription.ready(),
    activefires: ActiveFiresCollection.find().fetch(),
    activefirestotal: Counter.get('countActiveFires'),
    viewport: {
      center: geoip.get(), // a point in the sea
      zoom: zoom.get(),
    }
  };
})(FiresMap));
