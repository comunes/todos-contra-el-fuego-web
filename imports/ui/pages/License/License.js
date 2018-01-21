/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React from 'react';
import { translate } from 'react-i18next';
import { dateParseShortFormat } from '/imports/api/Common/dates';
import Page from '../Page/Page';

const License = props => (
    <div className="License">
    <Page
        title={props.t('Licencia')}
        subtitle={props.t('Última actualización, {{when}}', { when: dateParseShortFormat('2017-01-19') })}
        page="license"
    />
    </div>
);

export default translate([], { wait: true })(License);
