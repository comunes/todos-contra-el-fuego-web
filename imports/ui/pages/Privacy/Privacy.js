import React from 'react';
import Page from '../Page/Page';
import { translate } from 'react-i18next';

const Privacy = props => (
  <div className="Privacy">
    <Page
        title={props.t("Política de Privacidad")}
        subtitle={props.t("Última actualización 15 de noviembre de 2017")}
        page="privacy"
    />
  </div>
);

export default translate([], { wait: true })(Privacy);
