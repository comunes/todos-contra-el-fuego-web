import React from 'react';
import { Alert } from 'react-bootstrap';
import { translate, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet';

const NotFound = () => (
  <div className="NotFound">
    <Helmet>
      <title>This page doesn't exist"</title>
    </Helmet>
    <Alert bsStyle="danger">
      <p>
        <Trans i18nKey="not-found">Upppps: Esta página no existe</Trans>
      </p>
    </Alert>
  </div>
);

export default translate([], { wait: true })(NotFound);
