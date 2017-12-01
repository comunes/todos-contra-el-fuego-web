import React, {Component} from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { translate } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import { Circle, CircleMarker, Map, Marker, Popup, TileLayer, PropTypes as MapPropTypes } from 'react-leaflet'
import ActiveFiresCollection from '../../../api/ActiveFires/ActiveFires';
import { withTracker } from 'meteor/react-meteor-data';
import Loading from '../../components/Loading/Loading';

const MyPopupMarker = ({ children, position }) => (
  <Marker position={position}>
    <Popup>
      <span>{children}</span>
    </Popup>
  </Marker>
)

const MyCircle = ({ radius, position }) => (
  <Circle center={position} color="red" stroke={false} fillOpacity="1" fill={true} radius={radius} />
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
  position: MapPropTypes.latlng,
}

MyCircle.propTypes = {
  radius: PropTypes.number.isRequired,
  position: MapPropTypes.latlng,
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

const MyCirclesList = ({ circles }) => {
  const items = circles.map(({ key, ...props }) => (
    <MyCircle key={key} {...props} />
  ))
  return <div style={{ display: 'none' }}>{items}</div>
}

const FireList = ({ activefires, scale }) => {
  // console.log("Scaling? :" +  scale);
  const items = activefires.map(({ _id, ...props }) => (
    scale? <Fire key={_id} {...props} />:
    <FireMark key={_id} {...props} />
  ))
  return <div style={{ display: 'none' }}>{items}</div>
}

MyMarkersList.propTypes = {
  markers: PropTypes.array.isRequired,
}

MyCirclesList.propTypes = {
  circles: PropTypes.array.isRequired,
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
      modified: false
    }
  }

  onViewportChanged = viewport => {
    // console.log(this.state.viewport);
    zoom.set(viewport.zoom);
    lat.set(viewport.center[0]);
    lng.set(viewport.center[1]);
    this.state = { viewport: viewport, modified: true };
  }

  onClickReset = () => {
    // console.log("onclick");
    // this.setState({ viewport: DEFAULT_VIEWPORT })
  }

  render() {
    // const position = [this.default.lat, this.default.lng];
    // const position = this.props.geoip || [this.default.lat, this.default.lng];
    this.state = {
      viewport: !this.state.modified && this.props.viewport && Array.isArray(this.props.viewport.center)? this.props.viewport: this.state.viewport,
      modified: this.state.modified
    }

    return (
      /* !this.props.loading ?*/
      /* Large number of markers:
         https://stackoverflow.com/questions/43015854/large-dataset-of-markers-or-dots-in-leaflet/43019740#43019740 */
      <div>
      <Row>Fires active in this map: {this.props.activefires.length}</Row>
      <Row>Mostrar fábricas</Row>
      <Map
      animate={true}
      preferCanvas={false}
      onClick={this.onClickReset}
      viewport={this.state.viewport}
      onViewportChanged={this.onViewportChanged}
      >
      {/* http://wiki.openstreetmap.org/wiki/Tile_servers */}
      {/* <TileLayer
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          /> */}
      {/* <TileLayer
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png"
          /> */}
      <TileLayer
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
      />
      {/* <TileLayer
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tiles.mapbox.com/v3/americanredcross.hcji22de/{z}/{x}/{y}.png"
          />
          <Circle center={position} color="red" fill={true} radius={scan*1000} />
          <MyCirclesList circles={circles} />*/}

      <FireList activefires={this.props.activefires} scale={this.state.viewport.zoom > 8} />

      {/* <MyMarkersList markers={markers} /> */}
      </Map>
      </div>
      /* : <Loading />*/
    );
  }
}

const geoip = new ReactiveVar('');
const zoom = new ReactiveVar(8);
const lat = new ReactiveVar(DEF_LAT);
const lng = new ReactiveVar(DEF_LNG);

FiresMap.propTypes = {
  loading: PropTypes.bool.isRequired,
  activefires: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withTracker(() => {
  var subscription;
  Meteor.autorun(function() {
    // Subscribe for the current templateId (only if one is selected). Note this
    // will automatically clean up any previously subscribed data and it will
    // also stop all subscriptions when this template is destroyed.
    if (zoom.get())
      // TODO select position
      subscription = Meteor.subscribe('activefiresmyloc', zoom.get(), lat.get(), lng.get());
  });

  // const subscription = Meteor.subscribe('activefiresmyloc', zoom.get());
  Meteor.call("geo", function (error, response) {
    if (error) {
      console.warn(error);
    } else {
      geoip.set([response.location.latitude, response.location.longitude] );
    }
  });

  return {
    loading: !subscription.ready(),
    activefires: ActiveFiresCollection.find().fetch(),
    geoip: geoip.get(),
    zoom: zoom.get(),
    viewport: {
      center: geoip.get(), // a point in the sea
      zoom: zoom.get(),
    }
  };
})(FiresMap);
