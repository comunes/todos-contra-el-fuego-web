/* eslint-disable import/no-absolute-path */
import React, { Component, Fragment } from 'react';
import { CircleMarker, Marker, Tooltip } from 'react-leaflet';
import PropTypes from 'prop-types';
import { fireIconS, fireIconM, fireIconL, nFireIcon, industryIcon, regIndustryIcon } from '/imports/ui/components/Maps/Icons';
import { translate } from 'react-i18next';
import { onMarkClick } from './MarkListeners';
import FirePopup from './FirePopup';

class FireIconMark extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { history, nasa, id } = this.props;
    onMarkClick(history, nasa, id);
  }

  // Some docs:
  // https://earthdata.nasa.gov/what-is-new-collection-6-modis-active-fire-data
  // https://cdn.earthdata.nasa.gov/conduit/upload/3865/MODIS_C6_Fire_User_Guide_A.pdf
  getIcon(scan) {
    if (scan <= 1) return fireIconS;
    if (scan <= 2) return fireIconM;
    return fireIconL;
  }

  render() {
    const {
      lat, lon, scan, track, nasa, id, history, falsePositives, industries, neighbour, when, t
    } = this.props;
    return (
      <div>
        { !falsePositives && !industries &&
          <Marker position={[lat, lon]} icon={nasa ? this.getIcon(scan) : nFireIcon} onClick={this.onClick} >
            <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
          </Marker> }
        { industries && <Marker position={[lat, lon]} icon={regIndustryIcon}>
          <Tooltip><Fragment>{t('Es una industria (fuente: registro oficial)')}</Fragment></Tooltip>
                        </Marker> }
        { /* disabled */ industries && false && <CircleMarker
          center={[lat, lon]}
          color="violet"
          stroke={false}
          fillOpacity="1"
          fill
          radius={1}
        />}
        { falsePositives && !industries &&
        <Marker position={[lat, lon]} icon={industryIcon} onClick={this.onClick}>
          <Tooltip><Fragment>{t('Es una industria (fuente: nuestros usuarios/as)')}</Fragment></Tooltip>
          { /* disabled because was a past fire (and can be marked multiple times) */ false && <FirePopup t={t} history={history} id={id} lat={lat} lon={lon} /> }
        </Marker>
          }
        { !falsePositives && !industries &&
        <CircleMarker center={[lat, lon]} color={nasa ? 'red' : '#D35400'} stroke={false} fillOpacity="1" fill radius={1} onClick={this.onClick}>
          <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
        </CircleMarker> }
      </div>
    );
  }
}

FireIconMark.propTypes = {
  // https://github.com/PaulLeCam/react-leaflet/tree/master/src/propTypes
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  scan: PropTypes.number,
  track: PropTypes.number,
  nasa: PropTypes.bool,
  falsePositives: PropTypes.bool.isRequired,
  industries: PropTypes.bool.isRequired,
  neighbour: PropTypes.bool.isRequired,
  id: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date),
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(FireIconMark);
