/* global sitemaps Comments */
/* eslint-disable import/no-absolute-path */

import Fires from '/imports/api/Fires/Fires';
// import Comments from '/imports/api/Comments/Comments';

const firesMapEnabled = false;

sitemaps.add('/sitemap.xml', () => {
  const today = new Date();

  const out = [];
  out.push({ page: '/fires', lastmod: today });
  out.push({ page: '/login', lastmod: today });
  out.push({ page: '/signup', lastmod: today });
  out.push({ page: '/recover-password', lastmod: today });
  out.push({ page: '/credits', lastmod: today });
  out.push({ page: '/terms', lastmod: today });
  out.push({ page: '/license', lastmod: today });
  out.push({ page: '/privacy', lastmod: today });
  out.push({ page: '/about', lastmod: today });

  // When user has public page
  /*  const users = Meteor.users.find().fetch();
     _.each(users, function(user) {
     out.push({
     page: '/persona/' + user.username,
     lastmod: user.updatedAt
     });
     }); */

  if (firesMapEnabled) {
    Fires.find({}, { limit: 100, sort: { createdAt: -1 } }).fetch().forEach((fire) => {
      // Search the last comment of tha fire
      const lastComment = Comments.getCollection().findOne({ referenceId: `fire-${fire._id}` }, { sort: { createdAt: -1 } });
      out.push({
        page: `/fire/archive/${fire._id._str}`,
        lastmod: lastComment ? lastComment.createdAt : fire.updatedAt
      });
    });
  }

  return out;
});
