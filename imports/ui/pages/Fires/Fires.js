/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { translate } from 'react-i18next';
import { Meteor } from 'meteor/meteor';
import { Map, Circle } from 'react-leaflet';
import moment from 'moment-timezone';
import Blaze from 'meteor/gadicc:blaze-react-component';
import DefMapLayers from '/imports/ui/components/Maps/DefMapLayers';
import FiresCollection from '/imports/api/Fires/Fires';
import '/imports/startup/client/comments';

import './Fires.scss';

class Fire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    // console.log(moment.tz.guess());
  }

  render() {
    const { loading, fire, t } = this.props;
    return (
      <div className="ViewFire">
        {!loading &&
         <Fragment>
           <h4 className="page-header">
             {fire.address ?
              t('Información adicional sobre fuego detectado en {{where}} el {{when}}', { where: fire.address, when: moment(fire.when).tz(moment.tz.guess()).format('LLLL (z)') }) :
              t('Información adicional sobre fuego detectado el {{when}}', { when: moment.utc(fire.when).format('LLLL') })}
           </h4>

            <Map
                ref={(map) => {
                    this.fireMap = map;
                  }}
                animate
                sleep={false}
                center={[fire.lat, fire.lon]}
                className="fire-leaflet-container"
                zoom={8}
            >
              <Fragment>
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
            <p>{t('Coordenadas:')} {fire.lat}, {fire.lon}</p>
            {(fire.type === 'modis' || fire.type === 'virrs') &&
             <p>{t('Fuego detectado por satélites de la NASA {{when}}', { when: moment(fire.when).fromNow() })}</p>
            }
            {/* TODO: marcar tipo de fuego, industria, etc */}
            <h4>{t('Comentarios')}</h4>
            <div className="comments-info">
              {t('Puedes añadir un comentario si tienes información adicional sobre este fuego.')}
              {' '}
              {t('Por ejemplo:')}
              <ul>
                <li>{t('si conoces esta zona y cómo acceder a el fuego (esto puede de ser de ayuda para apagarlo si sigue activo o para investigarlo en un futuro)')}</li>
                <li>{t('si conoces el motivo por el que comenzó el fuego')}</li>
                <li>{t('si quieres denunciar algún tipo de ilegalidad, incluso anónimamente')}</li>
                <li>{t('etc')}</li>
              </ul>
            </div>
            <div className="comments-section">
              <Blaze template="commentsBox" id={`fire-${fire._id}`} />
            </div>
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
