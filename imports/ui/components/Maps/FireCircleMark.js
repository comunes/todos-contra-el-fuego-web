import React, { Component } from 'react';
import { GeoJSON } from 'react-leaflet';
import PropTypes from 'prop-types';
import { rectangleAround } from 'map-common-utils';
import { onMarkClick } from './MarkListeners';
import FirePopup from './FirePopup';

class FireCircleMark extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { history, nasa, id } = this.props;
    onMarkClick(history, nasa, id);
  }

  render() {
    const {
      lat,
      lon,
      scan,
      track,
      nasa,
      id,
      history,
      when,
      t
    } = this.props;
    const rect = rectangleAround({ lat, lon }, track, track);
    return (
      <GeoJSON data={rect} color="red" stroke width="1" opacity=".4" fillOpacity=".3">
        <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
      </GeoJSON>
    );
    /* <Circle center={[lat, lon]} color="red" stroke={false} fillOpacity="1" fill radius={scan * 500} onClick={this.onClick}> */
  }
}

FireCircleMark.propTypes = {
  scan: PropTypes.number.isRequired,
  track: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  nasa: PropTypes.bool.isRequired,
  id: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date).isRequired,
  t: PropTypes.func.isRequired
};

export default FireCircleMark;
