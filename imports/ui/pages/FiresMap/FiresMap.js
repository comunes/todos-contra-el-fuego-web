/* global Counter */
/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Row, Col, Checkbox } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { withTracker } from 'meteor/react-meteor-data';
import { Helmet } from 'react-helmet';
import { Trans, translate } from 'react-i18next';
import { Map } from 'react-leaflet';
import Control from 'react-leaflet-control';
import LoadingBar from '/imports/ui/components/Loading/LoadingBar';
import _ from 'lodash';
import store from 'store';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import 'leaflet-sleep/Leaflet.Sleep.js';
import geolocation from '/imports/startup/client/geolocation';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition';
import FireList from '/imports/ui/components/Maps/FireList';
import subsUnion from '/imports/ui/components/Maps/SubsUnion/SubsUnion';
import DefMapLayers from '/imports/ui/components/Maps/DefMapLayers';
import ActiveFiresCollection from '/imports/api/ActiveFires/ActiveFires';
import FireAlertsCollection from '/imports/api/FireAlerts/FireAlerts';
import IndustriesCollection, { industriesRemap } from '/imports/api/Industries/Industries';
import FalsePositivesCollection, { falsePositivesRemap } from '/imports/api/FalsePositives/FalsePositives';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import { isNotHomeAndMobile, isChrome, isAnyMobile } from '/imports/ui/components/Utils/isMobile';
import { isHome } from '/imports/ui/components/Utils/location';
import ShareIt from '/imports/ui/components/ShareIt/ShareIt';
import FullScreenMap from '/imports/ui/components/Maps/FullScreenMap';
import LocationAutocomplete from '/imports/ui/components/LocationAutocomplete/LocationAutocomplete';
import Gkeys from '/imports/startup/client/Gkeys';
import FireStats from './FireStats';
import './FiresMap.scss';

const MAXZOOM = 6;
const MAXZOOMREACTIVE = 6;
const DEFZOOM = 8;
const zoom = new ReactiveVar(DEFZOOM);
// https://en.wikipedia.org/wiki/Geographical_midpoint_of_Europe
const center = new ReactiveVar([53.5775, 3.106111]);
const mapSize = new ReactiveVar();
const marks = new ReactiveVar(true);
const showUnion = new ReactiveVar(true);

// Remove map in subscription
class FiresMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        center: props.center,
        zoom: props.zoom
      },
      init: false,
      useMarkers: props.marks,
      scaleAdded: false,
      moving: false,
      showSubsUnion: props.showUnion
    };
    const self = this;
    // viewportchange
    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.debounceView = _.debounce((viewport) => {
      self.handleViewportChange(viewport);
    }, 1500);
    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.onMoveEnd = this.onMoveEnd.bind(this);
    this.onMoveStart = this.onMoveStart.bind(this);
  }

  componentDidMount() {
    const self = this;
    Gkeys.load(() => {
      self.setState({ init: true });
    });
  }

  /* shouldComponentUpdate(nextProps, nextState) {
   *   const notMoving = !nextState.moving;
   *   const markersChanged = this.state.useMarkers !== nextState.useMarkers;
   *   const unionChanged = this.state.showSubsUnion !== nextState.showSubsUnion;
   *   const otherViewport = this.state.viewport !== nextState.viewport;
   *   // const init = nextState.viewport.center === [0, 0];
   *   // console.log(notMoving ? 'Not moving map' : 'Moving map');
   *   // console.log(otherViewport ? 'Other viewport' : 'Not other viewport');
   *   console.log(`${otherViewport ? 'OTHER' : 'Not other'} viewport ${nextState.viewport.center} zoom: ${nextState.viewport.zoom}`);
   *   return this.state.init || (notMoving && otherViewport && this.state.moved) || unionChanged || markersChanged;
   * }
   */

  shouldComponentUpdate(nextProps, nextState) {
    const notMoving = !nextState.moving;
    return notMoving;
  }

  onMoveStart() {
    // this.setState({ moving: true });
    this.state.moving = true;
  }

  onMoveEnd() {
    // this.setState({ moving: false });
    this.state.moving = false;
  }

  onViewportChanged(viewport) {
    this.debounceView.cancel();
    this.debounceView(viewport);
  }

  onAutocompleteChange(value) {
    this.handleViewportChange({ center: [value.lat, value.lng], zoom: DEFZOOM - 1 });
  }

  getMap() {
    return this.fireMap.leafletElement;
  }

  setShowSubsUnion(showSubsUnion) {
    this.setState({ showSubsUnion });
    store.set('firesmap_showunion', showSubsUnion);
  }

  componentDidUnMount() {
    // this.setState({ init: true });
  }

  handleViewportChange(viewport) {
    console.log(`Viewport changed: ${JSON.stringify(viewport)}`);
    if (this.fireMap) {
      const bounds = this.getMap().getBounds();
      // console.log(bounds);
      mapSize.set([bounds.getNorthEast(), bounds.getSouthWest()]);
      store.set('firesmap_center', viewport.center);
      store.set('firesmap_zoom', viewport.zoom);
      if (viewport.zoom > this.state.viewport.zoom) {
        this.state.viewport = viewport;
        if (Meteor.isDevelopment) console.log('Don\'t query we are in the same point');
        return;
      }
      zoom.set(viewport.zoom);
      center.set(viewport.center);
      this.state.viewport = viewport;
    }
  }

  centerOnUserLocation(viewport) {
    this.setState({ viewport: { center: viewport.center, zoom: 10 } });
  }

  useMarkers(use) {
    this.setState({ useMarkers: use });
    store.set('firesmap_marks', use);
    marks.set(use);
  }

  addScale(map) {
    // https://www.npmjs.com/package/leaflet-graphicscale
    const options = {
      fill: 'fill',
      showSubunits: true
    };
    L.control.graphicScale([options]).addTo(map);
  }

  handleLeafletLoad(map) {
    if (map && map.leafletElement && !this.state.moving) {
      const lmap = map.leafletElement;
      try {
        const bounds = lmap.getBounds();
        mapSize.set([bounds.getNorthEast(), bounds.getSouthWest()]);
        if (!this.state.scaleAdded) {
          this.addScale(lmap);
          this.state.scaleAdded = true;
        }
      } catch (e) {
        console.warn('Failed to set map bounds and scale');
      }
      this.state.union = subsUnion(this.state.union, {
        map,
        subs: this.props.userSubs,
        show: this.state.showSubsUnion,
        bounds: this.props.userSubsBounds,
        fromServer: true,
        fit: false
      });
    }
  }

  render() {
    const { t } = this.props;
    const loading = this.props.loading || !this.props.subsready;
    console.log(`Rendering ${loading ? 'loading' : 'LOADED'}, zoom ${this.state.viewport.zoom}, map ${this.props.activefires.length + this.props.firealerts.length} of ${this.props.activefirestotal} total. False positives: ${this.props.falsePositives.length}. Reactive ${this.state.viewport.zoom >= MAXZOOMREACTIVE}`);
    const title = `${t('AppName')}: ${t('Fuegos activos')}`;

    if (Meteor.isDevelopment && this.props.activefires.length === 1) console.log(`Active fire: ${JSON.stringify(this.props.activefires[0])}`);
    if (Meteor.isDevelopment) console.log(`Active fires total: ${this.props.activefires.length}`);
    if (Meteor.isDevelopment) console.log(`False positives total: ${this.props.falsePositives.length}`);
    if (Meteor.isDevelopment) console.log(`Fire alerts total: ${this.props.firealerts.length}`);
    if (Meteor.isDevelopment) console.log(`Industries total: ${this.props.industries.length}`);

    if (!this.state.init) {
      return <div />;
    }

    return (
      /* Large number of markers:
         https://stackoverflow.com/questions/43015854/large-dataset-of-markers-or-dots-in-leaflet/43019740#43019740 */
      <div
          ref={(divElement) => { this.divElement = divElement; }}
      >
        { !isHome() &&
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={t('Fuegos activos en el mundo actualizados en tiempo real')} />
          </Helmet> }
          <h4 className="page-header"><Trans parent="span">Fuegos activos</Trans></h4>
          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              {isNotHomeAndMobile() &&
               <Fragment>
                 <LocationAutocomplete
                     focusInput={false}
                     label=""
                     placeHolder="Escribe un lugar para centrar el mapa"
                     helpText=""
                     onChange={value => this.onAutocompleteChange(value)}
                 />
                 <Checkbox inline={false} defaultChecked={this.state.showSubsUnion} onClick={e => this.setShowSubsUnion(e.target.checked)}>
                   <Trans className="mark-checkbox" parent="span">Resaltar en verde el área vigilada por nuestros usuarios/as</Trans>&nbsp;(*)
                 </Checkbox>
                 {(this.state.viewport.zoom >= MAXZOOM) &&
                  <Checkbox inline={false} defaultChecked={this.state.useMarkers} onClick={e => this.useMarkers(e.target.checked)}>
                    <Trans className="mark-checkbox" parent="span">Resaltar los fuegos con un marcador</Trans>
                  </Checkbox>}
               </Fragment>}
            </Col>
            <Col xs={12} sm={6} md={6} lg={6} >
              <p className="firesmap-legend">
                { (this.props.activefires.length + this.props.firealerts.length) === 0 ?
                  <Fragment><Trans parent="span" i18nKey="noActiveFireInMapCount">No hay fuegos activos en esta zona del mapa. <strong>{{ countTotal: this.props.activefirestotal }}</strong> fuegos activos en el mundo.</Trans> <FireStats {... this.props} /></Fragment> :
                  <Fragment><Trans parent="span" i18nKey="activeFireInMapCount">En rojo, <strong>{{ count: this.props.activefires.length + this.props.firealerts.length }}</strong> fuegos activos. <strong>{{ countTotal: this.props.activefirestotal }}</strong> fuegos activos en el mundo.</Trans> <FireStats {... this.props} /></Fragment>
                }
              </p>
              {isNotHomeAndMobile() && this.props.firealerts.length > 0 &&
               <p className="firesmap-legend"><Trans parent="span" i18nKey="activeNeigFireInMapCount">En naranja, los fuegos notificados por nuestros usuarios/as recientemente.</Trans></p> }
               { /* disabled */ false && isNotHomeAndMobile() && this.props.firealerts.length === 0 && !isAnyMobile &&
                 <p className="firesmap-legend"><Trans parent="span" i18nKey="noActiveNeigFireInMap">No hay fuegos notificados recientemente por nuestros usuarios/as en esta zona.</Trans></p> }

                 <p className="firesmap-note">
                   <em>{ this.state.viewport.zoom >= MAXZOOMREACTIVE ?
                        <Trans>Los fuegos activos se actualizan en tiempo cuasi real.</Trans> :
                        <Trans>Haga zoom en una zona de su interés si quiere que los fuegos se actualicen en tiempo real.</Trans>
                       }
                   </em>
                 </p>
            </Col>
          </Row>
          {loading ?
           <LoadingBar progress={this.props.loading ? 0.9 : 1} />
           : ''}
           {/* https://github.com/CliffCloud/Leaflet.Sleep */}
           <Map
               ref={(map) => {
                   this.fireMap = map;
                   this.handleLeafletLoad(map);
                   }}
               className="firesmap-leaflet-container"
               animate
               minZoom={5}
               center={this.state.viewport.center}
               zoom={this.state.viewport.zoom}
               preferCanvas
               viewport={this.state.viewport}
               onViewportChanged={this.onViewportChanged}
               sleep={isHome() && !isChrome}
               onMoveend={this.onMoveEnd}
               onMovestart={this.onMoveStart}
               onZoomend={this.onMoveEnd}
               onZoomstart={this.onMoveStart}
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
                   t={t}
                   history={this.props.history}
                   fires={this.props.falsePositives}
                   scale={this.state.viewport.zoom >= MAXZOOM}
                   useMarkers={this.state.useMarkers}
                   nasa={false}
                   falsePositives
                   neighbour={false}
                   industries={false}
               />
               <FireList
                   t={t}
                   history={this.props.history}
                   fires={this.props.industries}
                   scale={this.state.viewport.zoom >= MAXZOOM}
                   useMarkers={this.state.useMarkers}
                   nasa={false}
                   neighbour={false}
                   falsePositives={false}
                   industries
               />
               <FireList
                   t={t}
                   history={this.props.history}
                   fires={this.props.activefires}
                   scale={this.state.viewport.zoom >= MAXZOOM}
                   useMarkers={this.state.useMarkers}
                   nasa
                   neighbour={false}
                   falsePositives={false}
                   industries={false}
               />
               <FireList
                   t={t}
                   history={this.props.history}
                   fires={this.props.firealerts}
                   scale={this.state.viewport.zoom >= MAXZOOM}
                   useMarkers={this.state.useMarkers}
                   nasa={false}
                   neighbour
                   falsePositives={false}
                   industries={false}
               />
             </Fragment> }
             <DefMapLayers gray />
             <Control position="topright" >
               <ButtonGroup>
                 <CenterInMyPosition onClick={viewport => this.centerOnUserLocation(viewport)} onlyIcon {... this.props} />
               </ButtonGroup>
             </Control>
             <FullScreenMap />
           </Map>
           <Row>
             <Col xs={12} sm={12} md={12} lg={12}>
               <p className="firesmap-footnote"><span style={{ paddingRight: '5px' }}>(*)</span><Trans i18nKey="mapPrivacy" parent="span"><em>Para preservar la privacidad de nuestros usuarios/as, los datos reflejados están aleatoriamente alterados y son solo orientativos.</em></Trans></p>
               <p className="firesmap-footnote"><em><Trans>Nota: Las nubes pueden entorpecer la detección de fuegos activos.</Trans></em></p>
             </Col>
           </Row>
           { !isHome() &&
             <ShareIt title={title} />
           }
      </div>
    );
  }
}

FiresMap.propTypes = {
  loading: PropTypes.bool.isRequired,
  subsready: PropTypes.bool.isRequired,
  userSubs: PropTypes.string,
  userSubsBounds: PropTypes.string,
  activefires: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastFireDetected: PropTypes.object,
  firealerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  falsePositives: PropTypes.arrayOf(PropTypes.object).isRequired,
  industries: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastCheck: PropTypes.instanceOf(Date),
  activefirestotal: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  marks: PropTypes.bool.isRequired,
  showUnion: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

let geoInit = true;

export default translate([], { wait: true })(withTracker(() => {
  // const firesType = match.params.type;
  // const withIndustries = firesType === 'with-industries';
  // console.log(`With industries: ${withIndustries}`);

  let subscription;
  let alertSubscription;

  const centerStored = store.get('firesmap_center');
  const zoomStored = store.get('firesmap_zoom');
  const marksStored = store.get('firesmap_marks');
  const showUnionStored = store.get('firesmap_showunion');
  zoom.set(zoomStored || DEFZOOM);
  center.set(centerStored || [0, 0]);
  if (typeof marksStored === 'boolean') {
    marks.set(marksStored);
  }
  if (typeof showUnionStored === 'boolean') {
    showUnion.set(showUnionStored);
  }
  // Disable, because this increase the number of fires by one
  // Meteor.subscribe('lastFireDetected');
  Meteor.autorun(() => {
    if ((centerStored !== [0, 0] || geolocation.get()) && geoInit) {
      center.set(centerStored || geolocation.get());
      // console.log(`Geolocation ${geolocation.get()}`);
      geoInit = false;
    }
    if (mapSize.get() && mapSize.get()[0].lng && mapSize.get()[1].lat) {
      subscription = Meteor.subscribe(
        'activefiresmyloc',
        mapSize.get()[0].lng,
        mapSize.get()[0].lat,
        mapSize.get()[1].lng,
        mapSize.get()[1].lat,
        marks.get() && zoom.get() >= MAXZOOM
      );
      alertSubscription = Meteor.subscribe(
        'fireAlerts',
        mapSize.get()[0].lng,
        mapSize.get()[0].lat,
        mapSize.get()[1].lng,
        mapSize.get()[1].lat
      );
      /* if (withIndustries) {
         Meteor.subscribe(
         'industriesMyloc',
         mapSize.get()[0].lng,
         mapSize.get()[0].lat,
         mapSize.get()[1].lng,
         mapSize.get()[1].lat
         );
         } */
    }
  });

  Meteor.subscribe('activefirestotal');

  const settingsSubs = Meteor.subscribe('settings');
  const lastCheck = SiteSettings.findOne({ name: 'last-fire-check' });
  const userSubs = SiteSettings.findOne({ name: 'subs-public-union' });
  const userSubsBounds = SiteSettings.findOne({ name: 'subs-public-union-bounds' });
  const fireAlerts = FireAlertsCollection.find().fetch();
  const falsePositives = FalsePositivesCollection.find().fetch().map(falsePositivesRemap);
  const industries = IndustriesCollection.find().fetch().map(industriesRemap);
  const lastFireDetected = ActiveFiresCollection.findOne({}, { sort: { when: -1 } });

  return {
    loading: Meteor.status().status !== 'connected' || !subscription ? true : !(subscription.ready() && settingsSubs.ready() && alertSubscription.ready()),
    userSubs: userSubs ? userSubs.value : null,
    userSubsBounds: userSubs ? userSubsBounds.value : null,
    subsready: settingsSubs.ready(),
    // Not reactive query depending on zoom level
    activefires: ActiveFiresCollection.find({}, { reactive: zoom.get() >= MAXZOOMREACTIVE }).fetch(),
    activefirestotal: Counter.get('countActiveFires') + fireAlerts.length,
    firealerts: fireAlerts,
    falsePositives,
    industries,
    lastCheck: lastCheck ? lastCheck.value : null,
    lastFireDetected,
    center: center.get(),
    marks: marks.get(),
    showUnion: showUnion.get(),
    zoom: zoom.get()
  };
})(FiresMap));
