import React from 'react';
import Page from '../Page/Page';
import { translate } from 'react-i18next';

const Terms = props => (
  <div className="Terms">
    <Page
        title={props.t("Términos de Servicio")}
        subtitle={props.t("Última actualización 15 de noviembre de 2017")}
        page="terms"
    />
  </div>
);

export default translate([], { wait: true })(Terms);
