import React from 'react';
import { Button } from 'react-bootstrap';
import { translate } from 'react-i18next';

import './Index.scss';

const Index = (props) => {
  const { t } = props;
  return (
  <div className="Index">
    <h1>{props.t('AppName')}</h1>
    <p>A boilerplate for products.</p>
    <div>
      <Button href="http://cleverbeagle.com/pup">Read the Docs</Button>
      <Button href="https://github.com/cleverbeagle/pup"><i className="fa fa-star" /> Star on GitHub</Button>
    </div>
    <footer>
      <p>Need help and want to stay accountable building your product? <a href="http://cleverbeagle.com?utm_source=pupappindex&utm_campaign=oss">Check out Clever Beagle</a>.</p>
    </footer>
  </div>
  );
};

export default translate([], { wait: true })(Index);
