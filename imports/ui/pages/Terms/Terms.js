/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React from 'react';
import { translate } from 'react-i18next';
import { dateParseShortFormat } from '/imports/api/Common/dates';
import Page from '../Page/Page';

const Terms = props => (
  <div className="Terms">
    <Page
        title={props.t('Términos de Servicio')}
        subtitle={props.t('Última actualización, {{when}}', { when: dateParseShortFormat('2017-01-19') })}
        page="terms"
    />
  </div>
);

export default translate([], { wait: true })(Terms);
