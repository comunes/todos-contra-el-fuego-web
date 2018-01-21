/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React from 'react';
import { translate } from 'react-i18next';
import { dateParseShortFormat } from '/imports/api/Common/dates';
import Page from '../Page/Page';

const Privacy = props => (
  <div className="Privacy">
    <Page
        title={props.t('Política de Privacidad')}
        subtitle={props.t('Última actualización, {{when}}', { when: dateParseShortFormat('2017-01-19') })}
        page="privacy"
    />
  </div>
);

export default translate([], { wait: true })(Privacy);
