/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { GoogleLayer } from 'react-leaflet-google/lib/';
import Gkeys from '/imports/startup/client/Gkeys';
import { TileLayer, LayersControl } from 'react-leaflet';

const { BaseLayer } = LayersControl;

const defOpacity = 0.7;

class DefMapLayers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gkey: null
    };
  }

  componentDidMount() {
    const self = this;
    Gkeys.load((err, key) => {
      self.setState({ gkey: key });
    });
  }

  render() {
    const { t } = this.props;
    const osmgraylayer = (
      <BaseLayer checked={this.props.gray} name={t('Mapa gris de OpenStreetMap')}>
        <TileLayer
            opacity={defOpacity}
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />
      </BaseLayer>);
    const osmlayer = (
      <BaseLayer checked={this.props.osmcolor} name={t('Mapa color de OpenStreetMap')}>
        <TileLayer
            opacity={defOpacity}
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </BaseLayer>);
    return (
      <LayersControl position="topleft">
        {osmlayer}
        {osmgraylayer}
        {/* React.Fragment does not work here */}
        { this.state.gkey &&
        <BaseLayer name={t('Mapa de carreteras de Google')}>
          <GoogleLayer opacity={defOpacity} googlekey={this.state.gkey} maptype="ROADMAP" />
        </BaseLayer> }
        { this.state.gkey &&
        <BaseLayer name={t('Mapa de terreno de Google')}>
          <GoogleLayer opacity={defOpacity} googlekey={this.state.gkey} maptype="TERRAIN" />
        </BaseLayer> }
        { this.state.gkey &&
          <BaseLayer name={t('Mapa de satélite de Google')} checked={this.props.satellite}>
            <GoogleLayer opacity={defOpacity} googlekey={this.state.gkey} maptype="SATELLITE" />
          </BaseLayer> }
      </LayersControl>
    );
  }
}

DefMapLayers.propTypes = {
  t: PropTypes.func.isRequired,
  gray: PropTypes.bool,
  osmcolor: PropTypes.bool,
  satellite: PropTypes.bool

};

DefMapLayers.defaultProps = {
  gray: false,
  osmcolor: false,
  satellite: false
};

export default translate([], { wait: true })(DefMapLayers);
