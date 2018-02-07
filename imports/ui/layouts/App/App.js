/* eslint-disable jsx-a11y/no-href */
/* eslint import/no-absolute-path: [2, { esmodule: false, commonjs: false, amd: false }] */

import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { I18nextProvider } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
// https://github.com/gadicc/meteor-blaze-react-component/
import Blaze from 'meteor/gadicc:blaze-react-component';
// i18n
import i18n, { i18nReady } from '/imports/startup/client/i18n';
import '/imports/startup/client/meta';
import '/imports/startup/client/ravenLogger';
import '/imports/startup/client/geolocation';
import '/imports/startup/client/piwik-start.js';
import 'simple-line-icons/css/simple-line-icons.css';
import Reconnect from '../../components/Reconnect/Reconnect';
import Navigation from '../../components/Navigation/Navigation';
import Authenticated from '../../components/Authenticated/Authenticated';
import Public from '../../components/Public/Public';
import Index from '../../pages/Index/Index';
import Subscriptions from '../../pages/Subscriptions/Subscriptions';
import NewSubscription from '../../pages/NewSubscription/NewSubscription';
import ViewSubscription from '../../pages/ViewSubscription/ViewSubscription';
import EditSubscription from '../../pages/EditSubscription/EditSubscription';
import TestError from '../../pages/TestError/TestError';
import Signup from '../../pages/Signup/Signup';
import Auth from '../../pages/Auth/Auth';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import Status from '../../pages/Status/Status';
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail';
import RecoverPassword from '../../pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import NotFound from '../../pages/NotFound/NotFound';
import Footer from '../../components/Footer/Footer';
import Terms from '../../pages/Terms/Terms';
import Privacy from '../../pages/Privacy/Privacy';
import License from '../../pages/License/License';
import Credits from '../../pages/Credits/Credits';
import ReSendEmail from '../../components/ReSendEmail/ReSendEmail';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import history from '../../components/History/History';
import '../../components/NotificationsObserver/NotificationsObserver';
import FiresMap from '../../pages/FiresMap/FiresMap';
import Fires from '../../pages/Fires/Fires';
import Sandbox from '../../pages/Sandbox/Sandbox';
import './App.scss';

const App = props => (
  /* https://react.i18next.com/components/i18nextprovider.html */
  <I18nextProvider i18n={i18n}>
    <ErrorBoundary>
      <Router history={history}>
        { !props.loading ?
          <div className="App">
            <Helmet>
              <meta charSet="utf-8" />
              <title>{i18n.t('AppName')}</title>
              <meta name="description" content={`${i18n.t('AppDescrip')}: ${i18n.t('AppDescripLong')}`} />
            </Helmet>
            <Navigation {...props} />
            <ReSendEmail {...props} />

            <Grid>
              <Switch>
                <Route exact name="index" path="/" component={Index} />
                {/* <Authenticated exact path="/documents" component={Documents} {...props} />
                <Authenticated exact path="/documents/new" component={NewDocument} {...props} />
                <Authenticated exact path="/documents/:_id" component={ViewDocument} {...props} />
                <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...props} />
                */}
                <Authenticated exact path="/subscriptions" component={Subscriptions} {...props} />
                <Authenticated exact path="/subscriptions/new" component={NewSubscription} {...props} />
                <Authenticated exact path="/subscriptions/:_id" component={ViewSubscription} {...props} />
                <Authenticated exact path="/subscriptions/:_id/edit" component={EditSubscription} {...props} />
                <Authenticated exact path="/profile" component={Profile} {...props} />
                <Authenticated exact path="/status" component={Status} {...props} />
                <Route path="/fires" component={FiresMap} {...props} />
                <Route path="/fire/:id" component={Fires} {...props} />
                <Public path="/auth/:token" component={Auth} {...props} />
                <Public path="/signup" component={Signup} {...props} />
                <Public path="/login" component={Login} {...props} />
                <Route path="/logout" component={Logout} {...props} />
                <Route path="/sandbox" component={Sandbox} {...props} />
                <Route path="/error" component={TestError} {...props} />
                {/* <Route path="/subscriptions" render={props => <FireSubscription focusInput {...props} />} /> */}

                <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
                <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
                <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
                <Route name="terms" path="/terms" component={Terms} />
                <Route name="privacy" path="/privacy" component={Privacy} />
                <Route name="license" path="/license" component={License} />
                <Route name="credits" path="/credits" component={Credits} />

                <Route component={NotFound} />
              </Switch>
            </Grid>
            <Footer />
            <Reconnect />
            {props.i18nReady.get() &&
            <Blaze template="cookieConsent" />
            }
          </div> : ''}
      </Router>
    </ErrorBoundary>
  </I18nextProvider>
);

App.defaultProps = {
  userId: '',
  emailAddress: ''
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  i18nReady: PropTypes.object.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired
};

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`
}[typeof name]);

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready() || !i18nReady.get();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;
  // console.log(`i18n ready?: ${i18nReady.get()}`);
  return {
    loading,
    loggingIn,
    i18nReady,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true
  };
})(App);
