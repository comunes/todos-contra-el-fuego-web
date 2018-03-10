/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { translate, Trans } from 'react-i18next';
import { Row, Col, Alert, FormGroup } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Helmet } from 'react-helmet';
import { Map, Circle } from 'react-leaflet';
import Blaze from 'meteor/gadicc:blaze-react-component';
import DefMapLayers from '/imports/ui/components/Maps/DefMapLayers';
import NotFound from '/imports/ui/pages/NotFound/NotFound';
import FiresCollection from '/imports/api/Fires/Fires';
import FireList from '/imports/ui/components/Maps/FireList';
import FromNow from '/imports/ui/components/FromNow/FromNow';
import { dateLongFormat } from '/imports/api/Common/dates';
import '/imports/startup/client/comments';
import FalsePositiveTypes from '/imports/api/FalsePositives/FalsePositiveTypes';
import FalsePositivesCollection, { falsePositivesRemap } from '/imports/api/FalsePositives/FalsePositives';
import IndustriesCollection, { industriesRemap } from '/imports/api/Industries/Industries';
import ShareIt from '/imports/ui/components/ShareIt/ShareIt';
import FullScreenMap from '/imports/ui/components/Maps/FullScreenMap';
import './Fires.scss';

class Fire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.loading,
      notfound: props.notfound,
      when: props.when
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.when !== nextProps.when || this.props.loading !== nextProps.loading || this.props.notfound !== nextProps.notfound) {
      // console.log(`Next when ${nextProps.when}`);
      if (nextProps.fire && (nextProps.alert || nextProps.active || nextProps.fromHash)) {
        // change url to archive with new _id
        nextProps.history.replace(`/fire/archive/${nextProps.fire._id}`);
      }
      this.setState({
        loading: nextProps.loading,
        notfound: nextProps.notfound,
        when: nextProps.when
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextState.when === this.state.when && nextState.loading === this.state.loading && this.state.notfound === nextState.notfound);
  }

  onTypeSelect(key) {
    // console.log(key);
    Meteor.call('falsePositives.insert', this.props.fire._id, key, (error) => {
      if (error) {
        // console.log(error);
        Bert.alert(this.props.t(error.reason), 'danger');
      } else {
        Bert.alert(this.props.t('Tomamos nota, ¡gracias por colaborar!'), 'success');
      }
    });
  }

  handleLeafletLoad(circle) {
    if (this.fireMap && this.fireMap.leafletElement && circle && circle.leafletElement) {
      this.fireMap.leafletElement.fitBounds(circle.leafletElement.getBounds());
    }
  }

  render() {
    const {
      notfound, loading, fire, t
    } = this.props;
    if (Meteor.isDevelopment) console.log(`False positives total: ${this.props.falsePositives.length}`);
    if (Meteor.isDevelopment) console.log(`Industries total: ${this.props.industries.length}`);
    /* console.log(`loading fire: ${loading}`);
     * console.log(`Not found fire: ${notfound}`); */
    if (fire && fire.when) {
      this.dateLongFormat = dateLongFormat(fire.when);
      this.title = fire.address ?
        t('Información adicional sobre fuego detectado en {{where}} el {{when}}', { where: fire.address, when: this.dateLongFormat }) :
        t('Información adicional sobre fuego detectado el {{when}}', { when: this.dateLongFormat });
    }

    return (fire && !loading ? (
      <div className="ViewFire">
        <Helmet>
          <title>{t('AppName')}: {t('Información adicional sobre fuego')}</title>
          <meta name="description" content={this.title} />
        </Helmet>
        {!loading &&
         <Fragment>
           <h4 className="page-header">{this.title}</h4>
           <Map
               ref={(map) => { this.fireMap = map; }}
               animate
               sleep={false}
               center={[fire.lat, fire.lon]}
               className="fire-leaflet-container"
               zoom={13}
           >
             <Fragment>
               <Circle
                   center={[fire.lat, fire.lon]}
                   color="red"
                   fillColor="red"
                   fillOpacity={0.0}
                   interactive={false}
                   radius={fire.scan ? fire.scan * 500 : 300}
                   ref={(circle) => { this.circle = circle; this.handleLeafletLoad(circle); }}
               />
             </Fragment>
             <FireList
                 t={t}
                 history={this.props.history}
                 fires={this.props.falsePositives}
                 scale
                 useMarkers
                 nasa={false}
                 falsePositives
                 neighbour={false}
                 industries={false}
             />
             <FireList
                 t={t}
                 history={this.props.history}
                 fires={this.props.industries}
                 scale
                 useMarkers
                 nasa={false}
                 falsePositives={false}
                 neighbour={false}
                 industries
             />
             <DefMapLayers satellite />
             <FullScreenMap />
           </Map>
           <p>{t('Coordenadas:')} {fire.lat}, {fire.lon}</p>
           {(fire.type === 'modis' || fire.type === 'viirs') &&
            <p><Trans>Fuego detectado por satélites de la NASA <FromNow {...this.props} /></Trans></p>
           }
            {(fire.type === 'vecinal') &&
             <p><Trans>Fuego notificado por uno de nuestros usuarios/as <FromNow {...this.props} /></Trans></p>
            }

             <ShareIt title={this.title} />

             {(fire.type !== 'vecinal') &&
              <Fragment>
                { (this.props.falsePositives.length > 0 || this.props.industries.length > 0) &&
                  <Row>
                    <Col>
                      <Alert bsStyle="success"><Trans>Parece que este fuego no es un fuego forestal.</Trans></Alert>
                    </Col>
                  </Row> }
                <h5>{t('¿No es un fuego forestal?')}</h5>
                <div>
                  <Trans>Indícanos de que tipo de fuego se trata y ayúdanos así a mejorar nuestras notificaciones:</Trans>
                </div>
                <FormGroup>
                  <div className="btn-group">
                    <button className="btn btn-secondary btn-sm dropdown-toggle lang-selector" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {t('Elige un tipo')}
                    </button>
                    <div className="dropdown-menu">
                      {Object.keys(FalsePositiveTypes).map(key => (
                         <button
                             className="dropdown-item"
                           onClick={() => this.onTypeSelect(key)}
                             key={key}
                             type="button"
                         >
                           <Trans>{FalsePositiveTypes[key]}</Trans>
                         </button>
                       ))
                      }
                    </div>
                  </div>
                </FormGroup>
              </Fragment> }

              <h4>{t('Comentarios')}</h4>
              <div className="comments-info">
                {t('Puedes añadir un comentario si tienes información adicional sobre este fuego.')}
                {' '}
                {t('Por ejemplo:')}
                <ul>
                  <li>{t('si conoces esta zona y cómo acceder al fuego (esto puede de ser de ayuda para apagarlo si sigue activo o para investigarlo en un futuro)')}</li>
                  <li>{t('si conoces el motivo por el que comenzó el fuego')}</li>
                  <li>{t('si quieres denunciar algún tipo de ilegalidad, incluso anónimamente')}</li>
                  <li>{t('o cualquier otra información')}</li>
                </ul>
              </div>
              <div className="comments-section">
                <Blaze template="commentsBox" id={`fire-${fire._id}`} />
              </div>
         </Fragment>
        }
      </div>
    ) : <Fragment>{ notfound && <NotFound /> }</Fragment>);
  }
}

Fire.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  notfound: PropTypes.bool.isRequired,
  falsePositives: PropTypes.arrayOf(PropTypes.object).isRequired,
  industries: PropTypes.arrayOf(PropTypes.object).isRequired,
  fromHash: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  alert: PropTypes.bool.isRequired,
  when: PropTypes.instanceOf(Date),
  fire: PropTypes.object
};

Fire.defaultProps = {
};

// export default translate([], { wait: true })(withTracker((props) => {

const FireContainer = withTracker(({ match }) => {
  const id = match.params.id;
  const fireType = match.params.type;
  let subscription;
  const active = fireType === 'active';
  const archive = fireType === 'archive';
  const alert = fireType === 'alert';
  let fromHash = false;

  if (active) {
    subscription = Meteor.subscribe('fireFromActiveId', id);
  } else if (alert) {
    subscription = Meteor.subscribe('fireFromAlertId', id);
  } else if (archive) {
    subscription = Meteor.subscribe('fireFromId', id);
  } else {
    console.log('Seems a fire from enc hash');
    fromHash = true;
    subscription = Meteor.subscribe('fireFromHash', id);
  }

  // console.log(`Type of '${fireType}' fire, active: ${active}, archive: ${archive}, fromHash: ${fromHash}`);
  // console.log(`Subs ready: ${subscription.ready()}, fire: ${JSON.stringify(FiresCollection.findOne())}`);
  const loading = !subscription.ready();
  const notfound = !loading && FiresCollection.find().count() === 0;
  /* console.log(`loading fire: ${loading}`);
   * console.log(`Not found fire: ${notfound}`); */
  const falsePositives = FalsePositivesCollection.find().fetch().map(falsePositivesRemap);
  const industries = IndustriesCollection.find().fetch().map(industriesRemap);
  return {
    loading,
    active,
    alert,
    fromHash,
    falsePositives,
    industries,
    fire: FiresCollection.findOne(),
    notfound,
    when: subscription.ready() && FiresCollection.findOne() ? FiresCollection.findOne().when : null
  };
})(Fire);

// export default FireContainer;
export default translate([], { wait: true })(FireContainer);
