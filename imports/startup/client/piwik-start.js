Meteor.startup(function() {
  return Tracker.autorun(function() {
    var userId;
    userId = Meteor.userId();
    // console.log(userId);
    Meteor.Piwik.setUserInfo(userId);
  });
});
