import { Meteor } from 'meteor/meteor';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

history.listen((location) => { // , action ) => {
  // console.log(location.pathname);
  // console.log(action); // PUSH, etc
  Meteor.Piwik.trackPage(location.pathname);
});

export default history;
