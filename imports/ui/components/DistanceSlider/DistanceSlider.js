import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

// https://www.npmjs.com/package/rc-slider
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const wrapperStyle = { width: 400, margin: 50 };

// https://github.com/react-component/slider/tree/master/examples

class DistanceSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10,
    };
  }

  onSliderChange = (value) => {
    // console.log(value);
    this.setState({
      value,
    });
    this.props.onChange(value);
  }

  onAfterChange = (value) => {
    // console.log(`After change: ${value}`); //eslint-disable-line
    this.props.onChange(value);
  }

  render() {
    return (

      <div style={wrapperStyle}>
        <p><Trans parent="span">¿A que distancia a la redonda quieres recibir notificaciones?</Trans></p>
        <Slider min={5}
                max={105}
                value={this.state.value}
                trackStyle={{ backgroundColor: 'green', height: 8 }}
                railStyle={{ backgroundColor: 'orange', height: 8 }}
                dotStyle={{ top: 0, marginLeft: -1, width: 2, height: 8 }}
                marks={{
                  10:  {style: {}, label: "10км"},
                  20:  {style: {}, label: "20"},
                  30:  {style: {}, label: "30"},
                  40:  {style: {}, label: "40"},
                  50:  {style: {}, label: "50"},
                  60:  {style: {}, label: "60"},
                  70:  {style: {}, label: "70"},
                  80:  {style: {}, label: "80"},
                  90:  {style: {}, label: "90"},
                  100: {style: {}, label: "100км"}
                }}
                handleStyle={{
                  borderColor: 'green',
                  height: 20,
                  width: 20,
                  marginLeft: -10,
                  marginTop: -6,
                  /* backgroundColor: 'gray', */
                }}
                onAfterChange={this.onAfterChange}
                onChange={this.onSliderChange}
                defaultValue={10}
                step={5}
                handle={handle} />
      </div>
    )
  }
}

export default translate([], { wait: true })(DistanceSlider);
