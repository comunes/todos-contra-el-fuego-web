/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React from 'react';
import { translate } from 'react-i18next';
import Page from '../Page/Page';

const About = props => (
  <div className="About">
    <Page
        title={props.t('Sobre \'{{appName}}\'', { appName: props.t('AppName') })}
        subtitle={props.t('¿Vecindarios vigilando y combatiendo fuegos? ¿de qué va todo esto?')}
        page="about"
    />
  </div>
);

export default translate([], { wait: true })(About);
