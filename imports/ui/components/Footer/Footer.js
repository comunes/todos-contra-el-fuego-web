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
        <p className="pull-left"><span className="reverse">&copy;</span><span className="d-none d-md-inline"> Copyleft</span> {copyrightYear()} <a href="https://comunes.org/"><span className="d-none d-md-inline">{t('OrgNameFull')}</span><span className="d-inline d-md-none">{t('OrgName')}</span></a></p>

        <ul className="pull-right">
          <li><Link to="/terms"> {t('Términos')}<span className="d-none d-md-inline"> {t('de Servicio')}</span></Link></li>
          <li><Link to="/privacy"><span className="d-none d-md-inline">{t('Política de')} </span>{t('Privacidad')}</Link></li>
          <li><span className="d-none d-md-inline"><Link to="/license">{t('Licencia')}</Link></span></li>
        </ul>
      </Grid>
    </div>
  );
};

Footer.propTypes = {};

export default translate([], { wait: true })(Footer)
