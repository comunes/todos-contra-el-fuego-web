import React from 'react';
import { year } from '@cleverbeagle/dates';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { translate } from 'react-i18next';

import './Footer.scss';

const copyrightYear = () => {
  const currentYear = year();
  return currentYear === '2017' ? '2017' : `2017-${currentYear}`;
};

const Footer = (props) => {
  const { t } = props;
  return (
  <div className="Footer">
    <Grid>
      <p className="pull-left">&copy; Copyleft {copyrightYear()} <a href="https://comunes.org/">{t('OrgNameFull')}</a></p>
      <ul className="pull-right">
        <li><Link to="/terms"> {t('Términos')}<span className="hidden-xs"> {t('de Servicio')}</span></Link></li>
        <li><Link to="/privacy">{t('Política')}<span className="hidden-xs"> {t('de Privacidad')}</span></Link></li>
        <li><Link to="/license">{t('Licencia')}<span className="hidden-xs"></span></Link></li>
      </ul>
    </Grid>
  </div>
  );
};

Footer.propTypes = {};

export default translate([], { wait: true })(Footer);
