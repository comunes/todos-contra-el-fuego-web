import React, { Component } from 'react';
import { GeoJSON } from 'react-leaflet';
import PropTypes from 'prop-types';
import { onMarkClick } from './MarkListeners';
import FirePopup from './FirePopup';

class FirePolygonMark extends Component {
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
      nasa,
      id,
      shape,
      centerid,
      history,
      when,
      t
    } = this.props;
    const lon = centerid.coordinates[0];
    const lat = centerid.coordinates[1];
    return (
      <GeoJSON data={shape} color="orange" stroke width="1" opacity=".2" fillOpacity=".0" />
    );
    /* <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} /> */
  }
}

FirePolygonMark.propTypes = {
  id: PropTypes.object.isRequired,
  nasa: PropTypes.bool.isRequired,
  shape: PropTypes.object.isRequired,
  centerid: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date).isRequired,
  t: PropTypes.func.isRequired
};

export default FirePolygonMark;
