import React from 'react';
import Page from '../Page/Page';
import { translate } from 'react-i18next';

const Credits = props => (
    <div className="Credits">
    <Page
        title={props.t("Créditos")}
        subtitle={props.t("Sobre los datos y imágenes usados")}
        page="credits"
    />
    </div>
);

export default translate([], { wait: true })(Credits);
