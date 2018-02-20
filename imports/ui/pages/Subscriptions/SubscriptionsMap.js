/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Trans, translate } from 'react-i18next';
import { Map } from 'react-leaflet';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css';
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.js';
import 'leaflet-sleep/Leaflet.Sleep.js';
import Control from 'react-leaflet-control';
import CenterInMyPosition from '/imports/ui/components/CenterInMyPosition/CenterInMyPosition';
import subsUnion from '/imports/ui/components/Maps/SubsUnion/SubsUnion';
import DefMapLayers from '/imports/ui/components/Maps/DefMapLayers';
import Loading from '/imports/ui/components/Loading/Loading';
import SiteSettings from '/imports/api/SiteSettings/SiteSettings';
import { isChrome } from '/imports/ui/components/Utils/isMobile';
import { isHome } from '/imports/ui/components/Utils/location';
import ShareIt from '/imports/ui/components/ShareIt/ShareIt';

import './SubscriptionsMap.scss';

// Remove map in subscription
class SubscriptionsMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        center: [0, 0],
        zoom: 0
      },
      init: true
    };
  }

  componentDidMount() {
    if (this.subscriptionsMap) {
      this.addScale();
    }
  }

  getMap() {
    return this.subscriptionsMap.leafletElement;
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
        bounds: this.props.userSubsBounds,
        fromServer: true,
        show: true,
        fit: this.state.init
      });
    }
  }

  centerOnUserLocation(viewport) {
    console.log(`viewport: ${JSON.stringify(viewport)}`);
    this.setState({ init: false, viewport });
  }

  gotoParticipe() {
    const element = document.querySelector('#participe');
    if (element) {
      element.scrollIntoView();
    } else {
      this.props.history.push('/subscriptions');
    }
  }

  render() {
    const { t } = this.props;
    const title = `${t('AppName')}: ${t('Zonas vigiladas')}`;
    console.log(`Rendering Subs users ready ${this.props.subsready} viewport: ${JSON.stringify(this.state.viewport)}`);
    return (
      <Fragment>
        { !isHome() &&
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={t('Zonas vigiladas por nuestros usuari@s actualmente')} />
          </Helmet> }
        {!this.props.subsready ?
         <Row className="align-items-center justify-content-center">
           <Loading />
         </Row>
         : ''}
         <h4 className="page-header"><Trans parent="span">Zonas vigiladas</Trans></h4>
         <Col xs={12} sm={12} md={12} lg={12}>
           <Row>
             <Trans>En verde, las zonas vigiladas por nuestros usuari@s actualmente</Trans>&nbsp;(*)
           </Row>
         </Col>
         <Map
             ref={(map) => {
                 this.subscriptionsMap = map;
                 this.handleLeafletLoad(map);
               }}
             zoom={this.state.viewport.zoom}
             center={this.state.viewport.center}
             className="subscriptionsmap-leaflet-container"
             animate
             sleep={window.location.pathname === '/' && !isChrome}
             sleepTime={10750}
             wakeTime={750}
             sleepNote
             hoverToWake={false}
             wakeMessage={this.props.t('Pulsa para activar')}
             wakeMessageTouch={this.props.t('Pulsa para activar')}
             sleepOpacity={0.6}
         >
           <DefMapLayers gray />
           <Control position="topright" >
             <ButtonGroup>
               <CenterInMyPosition onClick={viewport => this.centerOnUserLocation(viewport)} onlyIcon {... this.props} />
               <Button
                   bsStyle="success"
                   onClick={() => { this.gotoParticipe(); }}
               >
                 {this.props.t('Participa')}
               </Button>
             </ButtonGroup>
           </Control>
         </Map>
         <Row>
           <Col xs={12} sm={12} md={12} lg={12}>
             <p className="subscriptionsmap-footnote"><span style={{ paddingRight: '5px' }}>(*)</span><Trans i18nKey="mapPrivacy" parent="span"><em>Para preservar la privacidad de nuestros usuarios/as, los datos reflejados están aleatoriamente alterados y son solo orientativos.</em></Trans></p>
           </Col>
         </Row>
         { !isHome() &&
           <ShareIt title={title} />
         }
      </Fragment>
    );
  }
}

SubscriptionsMap.propTypes = {
  userSubs: PropTypes.string,
  userSubsBounds: PropTypes.string,
  subsready: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(withTracker(() => {
  const settingsSubs = Meteor.subscribe('settings');
  const userSubs = SiteSettings.findOne({ name: 'subs-public-union' });
  const userSubsBounds = SiteSettings.findOne({ name: 'subs-public-union-bounds' });
  return {
    userSubs: userSubs ? userSubs.value : null,
    userSubsBounds: userSubsBounds ? userSubsBounds.value : null,
    subsready: settingsSubs.ready()
  };
})(SubscriptionsMap));
