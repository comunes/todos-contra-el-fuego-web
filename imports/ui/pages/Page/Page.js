import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import i18n from '/imports/startup/client/i18n';
import PageHeader from '../../components/PageHeader/PageHeader';
import Content from '../../components/Content/Content';
import { Helmet } from 'react-helmet';

import './Page.scss';

const Page = ({ title, subtitle, content }) => (
  <div className="Page">
    <Helmet>
      <meta charSet="utf-8" />
      <title>{i18n.t('AppName')}: {title}</title>
      <meta name="description" content={content.substr(0, 100).lastIndexOf(' ')} />
    </Helmet>
    <PageHeader title={title} subtitle={subtitle} />
    <Content content={content} />
  </div>
);

Page.defaultProps = {
  subtitle: ''
};

Page.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  content: PropTypes.string.isRequired
};

const pageContent = new ReactiveVar('');

export default createContainer(({ content, page }) => {
  window.scrollTo(0, 0); // Force window to top of page.

  Meteor.call('utility.getPage', page, i18n.language, (error, response) => {
    if (error) {
      console.warn(error);
    } else {
      pageContent.set(response);
    }
  });

  return {
    content: content || pageContent.get()
  };
}, Page);
