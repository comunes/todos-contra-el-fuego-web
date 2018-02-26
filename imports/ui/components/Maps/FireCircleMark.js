import React, { Component } from 'react';
import { Circle } from 'react-leaflet';
import PropTypes from 'prop-types';
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
      nasa,
      id,
      history,
      when,
      t
    } = this.props;
    return (
      <Circle center={[lat, lon]} color="red" stroke={false} fillOpacity="1" fill radius={scan * 500} onClick={this.onClick}>
        <FirePopup t={t} history={history} id={id} nasa={nasa} lat={lat} lon={lon} when={when} />
      </Circle>
    );
  }
}

FireCircleMark.propTypes = {
  scan: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  nasa: PropTypes.bool.isRequired,
  id: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  when: PropTypes.instanceOf(Date).isRequired,
  t: PropTypes.func.isRequired
};

export default FireCircleMark;
