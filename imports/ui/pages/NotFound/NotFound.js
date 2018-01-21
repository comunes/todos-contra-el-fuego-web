import React from 'react';
import { Alert } from 'react-bootstrap';
import { translate, Trans } from 'react-i18next';

const NotFound = () => (
  <div className="NotFound">
    <Alert bsStyle="danger">
      <p>
        <Trans i18nKey="not-found">Upppps: Esta página no existe</Trans>
      </p>
    </Alert>
  </div>
);

export default translate([], { wait: true })(NotFound);
