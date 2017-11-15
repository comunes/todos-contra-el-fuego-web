import React from 'react';
import Page from '../Page/Page';
import { translate } from 'react-i18next';

const License = props => (
    <div className="License">
    <Page
        title={props.t("Licencia")}
        subtitle={props.t("Última actualización 15 de noviembre de 2017")}
        page="license"
    />
    </div>
);

export default translate([], { wait: true })(License);
