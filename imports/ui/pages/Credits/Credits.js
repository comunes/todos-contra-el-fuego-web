/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

import React from 'react';
import { translate } from 'react-i18next';
import Page from '../Page/Page';

const Credits = props => (
    <div className="Credits">
    <Page
        title={props.t('Créditos')}
        subtitle={props.t('Sobre los datos y imágenes usados')}
        page="credits"
    />
    </div>
);

export default translate([], { wait: true })(Credits);
