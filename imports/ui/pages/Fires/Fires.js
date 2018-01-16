/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { translate } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Map, CircleMarker, Circle } from 'react-leaflet';
import DefMapLayers from '/imports/ui/components/Maps/DefMapLayers';
import moment from 'moment';
import FiresCollection from '/imports/api/Fires/Fires';

class Fire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /* componentDidUpdate() {
   *   const map = this.firemap.leafletElement;
   *   map.invalidateSize();
   * } */

  handleLeafletLoad(map) {
    console.log(map);
    if (map) {
      // map.leafletELement.invalidateSize();
      // map.invalidateSize();
    }
  }

  render() {
    const { loading, fire, t } = this.props;
    return (
      <div className="ViewFire">
        {!loading &&
         <Fragment>
           <h4 className="page-header">
             {t('Información sobre fuego detectado el día {{when}}', { when: moment(fire.when).format('LLLL') })}
           </h4>
           <Row>
             <Col xs={12} sm={6} md={6} lg={6} >
               {(fire.type === 'modis' || fire.type === 'virrs') &&
                <p>{t('Detectado por satélites de la NASA')}
                </p>
               }
                <h5>Comentarios</h5>
                <p>{t('Añade un comentario si tienes información adicional sobre este fuego (por ejemplo, si está aún activo cómo acceder a él, o si conoces el motivo por el que comenzó el fuego, o si quieres denunciar algún tipo de ilegalidad relacionada con el fuego)')}
                </p>
             </Col>
             <Col xs={12} sm={6} md={6} lg={6} >
               <Map
                   ref={(map) => {
                       this.fireMap = map;
                       this.handleLeafletLoad(map);
                     }}
                   animate
                   sleep={false}
                   center={[fire.lat, fire.lon]}
                   zoom={8}
               >
                 <Fragment>
                   <CircleMarker
                       center={[fire.lat, fire.lon]}
                       color="red"
                       stroke={false}
                       fillOpacity="1"
                       fill
                       radius={3}
                   />
                   <Circle
                       center={[fire.lat, fire.lon]}
                       color="red"
                       fillColor="red"
                       fillOpacity={0.1}
                       radius={fire.scan * 1000}
                   />
                 </Fragment>
                 <DefMapLayers />
               </Map>
             </Col>
           </Row>
         </Fragment>
        }
      </div>
    );
  }
}

Fire.propTypes = {
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  fire: PropTypes.object // .isRequired
};

Fire.defaultProps = {
};

// export default translate([], { wait: true })(withTracker((props) => {

const FireContainer = withTracker(({ match }) => {
  const fireEncrypt = match.params.id;
  const subscription = Meteor.subscribe('fireFromHash', fireEncrypt);
  // console.log(`Subs ready: ${subscription.ready()}, fire: ${JSON.stringify(FiresCollection.findOne())}`);
  return {
    loading: !subscription.ready(),
    fire: FiresCollection.findOne()
  };
})(Fire);

// export default FireContainer;
export default translate([], { wait: true })(FireContainer);
