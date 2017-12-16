/* eslint-disable jsx-a11y/no-href */
/* eslint import/no-absolute-path: [2, { esmodule: false, commonjs: false, amd: false }] */

import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { Grid } from 'react-bootstrap';
import { I18nextProvider } from 'react-i18next';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

// https://github.com/gadicc/meteor-blaze-react-component/
import Blaze from 'meteor/gadicc:blaze-react-component';
/* import Reconnect from '../../components/Reconnect/Reconnect'; */
// i18n
import i18n from '/imports/startup/client/i18n';
import '/imports/startup/client/ravenLogger';
import '/imports/startup/client/geolocation';
import '/imports/startup/client/piwik-start.js';
import 'simple-line-icons/css/simple-line-icons.css';
import Navigation from '../../components/Navigation/Navigation';
import Authenticated from '../../components/Authenticated/Authenticated';
import Public from '../../components/Public/Public';
import Index from '../../pages/Index/Index';
import Documents from '../../pages/Documents/Documents';
import NewDocument from '../../pages/NewDocument/NewDocument';
import ViewDocument from '../../pages/ViewDocument/ViewDocument';
import EditDocument from '../../pages/EditDocument/EditDocument';
import Subscriptions from '../../pages/Subscriptions/Subscriptions';
import NewSubscription from '../../pages/NewSubscription/NewSubscription';
import ViewSubscription from '../../pages/ViewSubscription/ViewSubscription';
import EditSubscription from '../../pages/EditSubscription/EditSubscription';
import Signup from '../../pages/Signup/Signup';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
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
import FireSubscription from '../../pages/FireSubscription/FireSubscription';
import ReSendEmail from '../../components/ReSendEmail/ReSendEmail';
import FiresMap from '../../pages/FiresMap/FiresMap';
import Sandbox from '../../pages/Sandbox/Sandbox';
import './App.scss';

const history = createHistory();
history.listen((location) => { // , action ) => {
  // console.log(location.pathname);
  // console.log(action); // PUSH, etc
  Meteor.Piwik.trackPage(location.pathname);
});

const App = props => (
  /* https://react.i18next.com/components/i18nextprovider.html */
  <I18nextProvider i18n={i18n}>
    <Router history={history}>
      { !props.loading ?
        <div className="App">
          <Navigation {...props} />
          <ReSendEmail {...props} />
          <Grid> {/* bsClass="previously-container-but-disabled" > */}
            <Switch>
              <Route exact name="index" path="/" component={Index} />
              <Authenticated exact path="/documents" component={Documents} {...props} />
              <Authenticated exact path="/documents/new" component={NewDocument} {...props} />
              <Authenticated exact path="/documents/:_id" component={ViewDocument} {...props} />
              <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...props} />

              <Authenticated exact path="/subscriptions" component={Subscriptions} {...props} />
              <Authenticated exact path="/subscriptions/new" component={NewSubscription} {...props} />
              <Authenticated exact path="/subscriptions/:_id" component={ViewSubscription} {...props} />
              <Authenticated exact path="/subscriptions/:_id/edit" component={EditSubscription} {...props} />

              <Authenticated exact path="/profile" component={Profile} {...props} />
              <Route path="/fires" component={FiresMap} {...props} />
              <Public path="/signup" component={Signup} {...props} />
              <Public path="/login" component={Login} {...props} />
              <Route path="/logout" component={Logout} {...props} />
              <Route path="/sandbox" component={Sandbox} {...props} />
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
          {/* <Reconnect /> */}
          <Blaze template="cookieConsent" />
          {/* <Blaze template="cookieConsentImply" /> */}
        </div> : ''}
    </Router>
  </I18nextProvider>
);

App.defaultProps = {
  userId: '',
  emailAddress: ''
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
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
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true
  };
})(App);
