/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './DistanceSlider.scss';

// https://www.npmjs.com/package/rc-slider
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

const handle = (props) => {
  const {
    value,
    dragging,
    index,
    ...restProps
  } = props;
  return (
    <Tooltip prefixCls="rc-slider-tooltip" overlay={value} visible={dragging} placement="top" key={index} >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

// https://github.com/react-component/slider/tree/master/examples
class DistanceSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    };
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onAfterChange = this.onAfterChange.bind(this);
    this.props.onChange(10);
  }

  onSliderChange(value) {
    // console.log(value);
    this.setState({
      value
    });
    this.props.onChange(value);
  }

  onAfterChange(value) {
    // console.log(`After change: ${value}`); //eslint-disable-line
    this.props.onChange(value);
  }

  render() {
    return (
      <div className="dist-slider">
        <p><Trans parent="span">¿A que distancia a la redonda quieres recibir notificaciones de fuegos?</Trans></p>
        <Slider
            min={1}
            max={105}
            value={this.state.value}
            trackStyle={{ backgroundColor: 'green', height: 8 }}
            railStyle={{ backgroundColor: 'orange', height: 8 }}
            dotStyle={{
              top: 0,
              marginLeft: -1,
              width: 2,
              height: 8
            }}
            marks={{
              1: { label: '1км' },
              10: { label: '10' },
              20: { label: '20' },
              30: { label: '30' },
              40: { label: '40' },
              50: { label: '50' },
              60: { label: '60' },
              70: { label: '70' },
              80: { label: '80' },
              90: { label: '90' },
              100: { label: '100км' }
            }}
            handleStyle={{
              borderColor: 'green',
              height: 20,
              width: 20,
              marginLeft: -10,
              marginTop: -6
              /* backgroundColor: 'gray', */
            }}
            onAfterChange={this.onAfterChange}
            onChange={this.onSliderChange}
            defaultValue={10}
            step={1}
            handle={handle}
        />
      </div>
    );
  }
}

DistanceSlider.defaultProps = {
  onChange: null
};

DistanceSlider.propTypes = {
  onChange: PropTypes.func
};

export default translate([], { wait: true })(DistanceSlider);
