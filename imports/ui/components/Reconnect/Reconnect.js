import React from 'react';
import { translate } from 'react-i18next';
import Blaze from 'meteor/gadicc:blaze-react-component';

const Reconnect = props => (
  <Blaze template="meteorStatus" lang={props.i18n.language} />
);

export default translate([], { wait: true })(Reconnect);
