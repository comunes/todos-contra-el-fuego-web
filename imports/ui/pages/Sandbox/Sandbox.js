import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
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

const Sandbox = props => (
  <div style={wrapperStyle}>
    <Slider min={5}
            max={100}
            trackStyle={{ backgroundColor: 'green', height: 8 }}
            railStyle={{ backgroundColor: 'orange', height: 8 }}
            handleStyle={{
              borderColor: 'green',
              height: 20,
              width: 20,
              marginLeft: -14,
              marginTop: -6,
              /* backgroundColor: 'gray', */
            }}
            defaultValue={10}
            step={5}
            handle={handle} />
  </div>
);

Sandbox.defaultProps = {
};

Sandbox.propTypes = {
};

export default translate([], { wait: true })(Sandbox);
