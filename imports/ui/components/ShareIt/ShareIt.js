/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-absolute-path */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTracker } from 'meteor/react-meteor-data';
import { currentLocationHref } from '/imports/ui/components/Utils/location';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,

  FacebookIcon,
  GooglePlusIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  EmailIcon
} from 'react-share';

import './ShareIt.scss';

class ShareIt extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;
  }

  render() {
    const { title } = this.props;
    const shareUrl = currentLocationHref();

    return (
      <div className="share_it__container">
        <div className="share_it">
          <FacebookShareButton
              url={shareUrl}
              quote={title}
              className="share_it__share-button"
          >
            <FacebookIcon
               size={32}
                round
            />
          </FacebookShareButton>
        </div>

        <div className="share_it">
          <TwitterShareButton
              url={shareUrl}
              title={title}
              className="share_it__share-button"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <div className="share_it__share-count">
            &nbsp;
          </div>
        </div>

        <div className="share_it">
          <TelegramShareButton
              url={shareUrl}
              title={title}
              className="share_it__share-button"
          >
            <TelegramIcon size={32} round />
          </TelegramShareButton>

          <div className="share_it__share-count">
            &nbsp;
          </div>
        </div>

        <div className="share_it">
          <WhatsappShareButton
              url={shareUrl}
              title={title}
              separator=":: "
              className="share_it__share-button"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <div className="share_it__share-count">
            &nbsp;
          </div>
        </div>

        <div className="share_it">
          <GooglePlusShareButton
              url={shareUrl}
              className="share_it__share-button"
          >
            <GooglePlusIcon size={32} round />
          </GooglePlusShareButton>
        </div>

        <div className="share_it">
          <RedditShareButton
              url={shareUrl}
              title={title}
              windowWidth={660}
              windowHeight={460}
              className="share_it__share-button"
          >
            <RedditIcon size={32} round />
          </RedditShareButton>
        </div>

        <div className="share_it">
          <EmailShareButton
              url={shareUrl}
              subject={title}
              body="body"
              className="share_it__share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      </div>
    );
  }
}

ShareIt.propTypes = {
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

ShareIt.defaultProps = {
};

export default translate([], { wait: true })(withTracker((props) => {
  const { title } = props;
  return {
    title
  };
})(ShareIt));
