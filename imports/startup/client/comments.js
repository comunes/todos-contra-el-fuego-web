/* global Comments */
/* eslint-disable import/no-absolute-path */

import i18n from '/imports/startup/client/i18n';
import '/imports/startup/common/comments';

import './comments.scss';

i18n.init((err, t) => {
  Comments.ui.setContent({
    title: ' ', // i18n.t('Comentarios'),
    save: t('Guardar'),
    reply: t('Responder'),
    edit: t('Editar'),
    remove: t('Borrar'),
    'placeholder-textarea': t('Añadir un comentario'),
    'add-button-reply': t('Añadir una respuesta'),
    'add-button': t('Añadir comentario'),
    'you-need-to-login': t('Necesitas iniciar sesión para'),
    'add comments': t('añadir comentarios'),
    'like comments': t('puntuar comentarios'),
    'rate comments': t('puntuar comentarios'),
    'add replies': t('responder'),
    'load-more': t('Más comentarios')
  });

  /* This in client side */
  Comments.ui.config({
    limit: 20, // default 10
    loadMoreCount: 20, // default 20
    /* generateAvatar: function genAvatar(user, isAnonymous) {
      if (isAnonymous) {
        return i18n.t('Anónimo');
      }
      return user.profile && user.profile.name && user.profile.name.first ? user.profile.name.first : null;
    }, */
    template: 'bootstrap', // default 'semantic-ui'
    // default 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'
    defaultAvatar: '/default-avatar.png',
    markdown: true
  });
});
