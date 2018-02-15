/* global Comments */

// Client and Server
Comments.config({
  rating: 'likes-and-dislikes',
  allowAnonymous: () => true,
  anonymousSalt: 'klasddl3lala0l3lasdlas0ol3lasdlao3lasdoaslaldal3lasdclasdlal3lasdladlaq',
  publishUserFields: {
    profile: 1
  },
  mediaAnalyzers: [
    Comments.analyzers.image,
    Comments.analyzers.youtube
  ],
  generateUsername: function genUser(user) {
    // console.log(JSON.stringify(user));
    // FIXME
    return user.profile && user.profile.name && user.profile.name.first ? user.profile.name.first : '';
  }
});
