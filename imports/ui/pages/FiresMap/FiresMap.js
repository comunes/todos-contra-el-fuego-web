/* global L Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Row, Col, Checkbox } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { withTracker } from 'meteor/react-meteor-data';
import { Trans, translate } from 'react-i18next';
import { Map } from 'react-leaflet';
import Control from 'react-leaflet-control';
import _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import 'leaflet-sleep/Leaflet.Sleep.js';
import geolocation from '/imports/startup/client/geolocation';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition';
import FireList from '/imports/ui/components/Maps/FireList';
import subsUnion from '/imports/ui/components/Maps/SubsUnion/SubsUnion';
import DefMapLayers from '/imports/ui/components/Maps/DefMapLayers';
import FromNow from '/imports/ui/components/FromNow/FromNow';
import Loading from '/imports/ui/components/Loading/Loading';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import FireAlertsCollection from '/imports/api/FireAlerts/FireAlerts';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import UserSubsToFiresCollection from '/imports/api/Subscriptions/Subscriptions';
import { isNotHomeAndMobile, isChrome } from '/imports/ui/components/Utils/isMobile';

import './FiresMap.scss';

const MAXZOOM = 6;
const MAXZOOMREACTIVE = 6;
const zoom = new ReactiveVar(8);
const center = new ReactiveVar([0, 0]);
const mapSize = new ReactiveVar();

// Remove map in subscription
class FiresMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        center: props.center,
        zoom: props.zoom
      },
      useMarkers: false,
      showSubsUnion: true
    };
    const self = this;
    // viewportchange
    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.debounceView = _.debounce((viewport) => {
      self.handleViewportChange(viewport);
    }, 1500);
    this.onViewportChanged = this.onViewportChanged.bind(this);
  }

  componentDidMount() {
    if (this.fireMap) {
      if (this.getMap().getCenter()) {
        const bounds = this.getMap().getBounds();
        mapSize.set([bounds.getNorthEast(), bounds.getSouthWest()]);
        this.addScale();
      }
    }
  }

  onViewportChanged(viewport) {
    this.debounceView(viewport);
  }

  getMap() {
    return this.fireMap.leafletElement;
  }

  setShowSubsUnion(showSubsUnion) {
    this.setState({ showSubsUnion });
  }

  handleViewportChange(viewport) {
    console.log(`Viewport changed: ${JSON.stringify(viewport)}`);
    const bounds = this.getMap().getBounds();
    // console.log(bounds);
    mapSize.set([bounds.getNorthEast(), bounds.getSouthWest()]);
    /*
    if (viewport.center === this.state.viewport.center &&
        viewport.zoom === this.state.viewport.zoom) {
      // Do nothing, in same point
      return;
    }
    zoom.set(viewport.zoom);
    center.set(viewport.center);
    this.setState({ viewport }); */
  }

  centerOnUserLocation(viewport) {
    this.setState({ viewport });
  }

  useMarkers(use) {
    this.setState({ useMarkers: use });
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

  handleLeafletLoad(map) {
    // console.log('Map loading');
    // console.log(map);
    if (map) {
      this.state.union = subsUnion(this.state.union, {
        map,
        subs: this.props.userSubs,
        show: this.state.showSubsUnion,
        fit: false
      });
    }
  }

  render() {
    console.log(`Rendering ${this.props.loading ? 'loading' : 'LOADED'} map ${this.props.activefires.length + this.props.firealerts.length} of ${this.props.activefirestotal} total. Subs users ready ${this.props.subsready}, reactive ${this.state.viewport.zoom >= MAXZOOMREACTIVE}`);

    return (
      /* Large number of markers:
         https://stackoverflow.com/questions/43015854/large-dataset-of-markers-or-dots-in-leaflet/43019740#43019740 */
      <div
          ref={(divElement) => { this.divElement = divElement; }}
      >
        {this.props.loading || !this.props.subsready ?
         <Row className="align-items-center justify-content-center">
           <Loading />
         </Row>
         : ''}
         <h4 className="page-header"><Trans parent="span">Fuegos activos</Trans></h4>
         <Row>
           <Col xs={12} sm={6} md={6} lg={6} >
             <p className="firesmap-legend">
               { (this.props.activefires.length + this.props.firealerts.length) === 0 ?
                 <Fragment><Trans parent="span" i18nKey="noActiveFireInMapCount">No hay fuegos activos en esta zona del mapa. Hay un total de <strong>{{ countTotal: this.props.activefirestotal }}</strong> fuegos activos detectados en todo el mundo.</Trans> <Trans>Datos actualizados <FromNow when={this.props.lastCheck} />.</Trans></Fragment> :
                 <Fragment><Trans parent="span" i18nKey="activeFireInMapCount">En rojo, <strong>{{ count: this.props.activefires.length + this.props.firealerts.length }}</strong> fuegos activos en el mapa. Hay un total de <strong>{{ countTotal: this.props.activefirestotal }}</strong> fuegos activos detectados en todo el mundo por la NASA.</Trans> <Trans>Datos actualizados <FromNow when={this.props.lastCheck} />.</Trans></Fragment>
               }
             </p>
             {isNotHomeAndMobile &&
              <p className="firesmap-legend"><Trans parent="span" i18nKey="activeNeigFireInMapCount">En naranja, los fuegos notificados por nuestros usuarios/as recientemente.</Trans></p> }
           </Col>
           <Col xs={12} sm={6} md={6} lg={6}>
              {isNotHomeAndMobile &&
             <Fragment>
             <Checkbox inline={false} defaultChecked={this.state.showSubsUnion} onClick={e => this.setShowSubsUnion(e.target.checked)}>
               <Trans className="mark-checkbox" parent="span">Resaltar en verde el área vigilada por nuestros usuarios/as</Trans>&nbsp;(*)
             </Checkbox>
             {(this.state.viewport.zoom >= MAXZOOM) &&
              <Checkbox inline={false} onClick={e => this.useMarkers(e.target.checked)}>
                <Trans className="mark-checkbox" parent="span">Resaltar los fuegos con un marcador</Trans>
              </Checkbox>}
             </Fragment>}
              <p className="firesmap-note">
                <em>{ this.state.viewport.zoom >= MAXZOOMREACTIVE ?
                     <Trans>Los fuegos activos se actualizan en tiempo real.</Trans> :
                     <Trans>Haga zoom en una zona de su interés si quiere que los fuegos se actualicen en tiempo real.</Trans>
                    }
                </em>
              </p>
           </Col>
         </Row>
         {/* https://github.com/CliffCloud/Leaflet.Sleep */}
         <Map
             ref={(map) => {
                 this.fireMap = map;
                 this.handleLeafletLoad(map);
                 }}
             className="firesmap-leaflet-container"
             animate
             minZoom={5}
             center={this.props.center}
             zoom={this.props.zoom}
             preferCanvas
             onClick={this.onClickReset}
             viewport={this.state.viewport}
             onViewportChanged={this.onViewportChanged}
             sleep={window.location.pathname === '/' && !isChrome}
             sleepTime={10750}
             wakeTime={750}
             sleepNote
             hoverToWake={false}
             wakeMessage={this.props.t('Pulsa para activar')}
             wakeMessageTouch={this.props.t('Pulsa para activar')}
             sleepOpacity={0.6}
         >
           {/* http://wiki.openstreetmap.org/wiki/Tile_servers */}
           {!this.props.loading &&
           <Fragment>
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
           </Fragment> }
           <DefMapLayers />
           <Control position="topright" >
             <ButtonGroup>
               <CenterInMyPosition onClick={viewport => this.centerOnUserLocation(viewport)} onlyIcon {... this.props} />
             </ButtonGroup>
           </Control>
         </Map>
         <Row>
           <Col xs={12} sm={12} md={12} lg={12}>
             <p className="firesmap-footnote"><span style={{ paddingRight: '5px' }}>(*)</span><Trans i18nKey="mapPrivacy" parent="span"><em>Para preservar la privacidad de nuestros usuarios/as, los datos reflejados están aleatoriamente alterados y son solo orientativos.</em></Trans></p>
           </Col>
         </Row>
      </div>
    );
  }
}

FiresMap.propTypes = {
  loading: PropTypes.bool.isRequired,
  subsready: PropTypes.bool.isRequired,
  userSubs: PropTypes.arrayOf(PropTypes.object).isRequired,
  activefires: PropTypes.arrayOf(PropTypes.object).isRequired,
  firealerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastCheck: PropTypes.instanceOf(Date),
  activefirestotal: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  t: PropTypes.func.isRequired
};

let init = true;

export default translate([], { wait: true })(withTracker(() => {
  let subscription;
  Meteor.autorun(() => {
    if (geolocation.get() && init) {
      center.set(geolocation.get());
      console.log(`Geolocation ${geolocation.get()}`);
      init = false;
    }
    if (mapSize.get() && mapSize.get()[0].lng && mapSize.get()[1].lat) {
      subscription = Meteor.subscribe(
        'activefiresmyloc',
        mapSize.get()[0].lng,
        mapSize.get()[0].lat,
        mapSize.get()[1].lng,
        mapSize.get()[1].lat
      );
      Meteor.subscribe(
        'fireAlerts',
        mapSize.get()[0].lng,
        mapSize.get()[0].lat,
        mapSize.get()[1].lng,
        mapSize.get()[1].lat
      );
    }
  });

  Meteor.subscribe('activefirestotal');
  Meteor.subscribe('settings');
  const userSubs = Meteor.subscribe('userSubsToFires');
  const lastCheck = SiteSettings.findOne({ name: 'last-fire-check' });
  const fireAlerts = FireAlertsCollection.find().fetch();
  return {
    loading: !subscription ? true : !subscription.ready(),
    userSubs: UserSubsToFiresCollection.find().fetch(),
    subsready: userSubs.ready(),
    // Not reactive query depending on zoom level
    activefires: ActiveFiresCollection.find({}, { reactive: zoom.get() >= MAXZOOMREACTIVE }).fetch(),
    activefirestotal: Counter.get('countActiveFires') + fireAlerts.length,
    firealerts: fireAlerts,
    lastCheck: lastCheck ? lastCheck.value : null,
    center: geolocation.get(),
    zoom: zoom.get()
  };
})(FiresMap));
