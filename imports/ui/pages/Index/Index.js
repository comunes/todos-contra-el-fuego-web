import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import { translate, Trans } from 'react-i18next';
import {render} from 'react-dom';
import { Link } from 'react-router-dom';
// https://www.npmjs.com/package/react-resize-detector
import ReactResizeDetector from 'react-resize-detector';
import FiresMap from  '../FiresMap/FiresMap';
import FireSubscription from '/imports/ui/pages/FireSubscription/FireSubscription';
import './new-age.js';

import './Index.scss';
import './Index-custom.scss';


class Index extends Component {
  // Debounce by David Walsch
  // https://davidwalsh.name/javascript-debounce-function

  constructor(props) {
    super(props);
  }

  debounce = (func, wait, immediate) => {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  scaleHeader = () => {
    var scalable = document.getElementById('tcefh1');
    var margin = 10;
    var scalableContainer = scalable.parentNode;
    scalable.style.transform = 'scale(1)';
    var scalableContainerWidth = scalableContainer.offsetWidth - margin;
    var scalableWidth = scalable.offsetWidth;
    scalable.style.transform = 'scale(' + scalableContainerWidth / scalableWidth + ')';
    scalableContainer.style.height = scalable.getBoundingClientRect().height + 'px';
  };

  myScaleFunction = this.debounce(() => {
    this.scaleHeader();
  }, 250);

  _onResize = () => {
    this.myScaleFunction();
  };

  render() {
    return (
      <div className="IndexDisabled full-width">
        {/* https://v4-alpha.getbootstrap.com/components/carousel/  */}
        <header>
          <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
          <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
            </ol>
            <div className="carousel-inner" role="listbox">

              <div className="carousel-item carousel-item-1 active">
                <div className="slide-1-icon"></div>
                <div className="carousel-caption">
                  <h3><i className="fa fa-map-pointer" aria-hidden="true"></i>Elige un lugar</h3>
                  <p></p>
                </div>
              </div>

              <div className="carousel-item carousel-item-2">
                <div className="slide-2-icon"></div>
                <div className="carousel-caption">
                  <h3><i className="fa fa-dot-circle-o" aria-hidden="true"></i>Elige un radio de vigilancia</h3>
                  <p></p>
                </div>
              </div>

              <div className="carousel-item carousel-item-3">
                <div className="slide-3-icon"></div>
                <div className="carousel-caption">
                  <h3><i className="fa fa-podcast" aria-hidden="true"></i>Recibe alertas de fuegos en esa zona</h3>
                  <p></p>
                </div>
              </div>

              <div className="carousel-item carousel-item-4">
                <div className="slide-4-icon"></div>
                <div className="carousel-caption">
                  <h3><i className="fa fa-bell-o" aria-hidden="true"></i>Alerta cuando hay un fuego</h3>
                  <p></p>
                </div>
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </header>

        <section className="py-5">
          <div className="container">
            <div className="scale__container--js">
              <h1 id="tcefh1" className="scale--js">{this.props.t('AppName')}</h1>
            </div>
            <p>Siempre alerta a los fuegos en nuestro vecindario</p>
            <Link className="participe-btn btn btn-lg btn-warning" role="button" to="/signup">{this.props.t('Participa')}</Link>
          </div>
        </section>

        <section className="download bg-primary text-center" id="download">
          <div className="container">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <h2 className="section-heading">Discover what all the buzz is about!</h2>
                <p>Our app is available on any mobile device! Download now to get started!</p>
                <div className="badges">
                  <a className="badge-link" href="#"><img src="img/google-play-badge.svg" alt=""/></a>
                  <a className="badge-link" href="#"><img src="img/app-store-badge.svg" alt=""/></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="container">
            <div className="section-heading text-center">
              <h2>Unlimited Features, Unlimited Fun</h2>
              <p className="text-muted">Check out what you can do with this app theme!</p>
              <hr/>
            </div>
            <div className="row">
              <div className="col-lg-4 my-auto">
                <div className="device-container">
                  <div className="device-mockup iphone6_plus portrait white">
                    <div className="device">
                      <div className="screen">
                        {/* Demo image for screen mockup, you can put an image here, some HTML, an animation, video, or anything else! */}
                        <img src="img/demo-screen-1.jpg" className="img-fluid" alt=""/>
                      </div>
                      <div className="button">
                        {/* You can hook the "home button" to some JavaScript events or just remove it  */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 my-auto">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="feature-item">
                        <i className="fa fa-telegram text-primary"></i>
                        <h3>Telegram</h3>
                        <p className="text-muted"><Trans>Usa nuestro bot de Telegram</Trans></p>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="feature-item">
                        <i className="icon-envelope-open text-primary"></i>
                        <h3><Trans>Correo electronico</Trans></h3>
                        <p className="text-muted"><Trans>Recibe nuestras notificaciones de fuegos por correo</Trans></p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="feature-item">
                        <i className="icon-lock-open text-primary"></i>
                        <h3>Open Source</h3>
                        <p className="text-muted">Since this theme is MIT licensed, you can use it commercially!</p>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="feature-item">
                        <i className="icon-screen-smartphone text-primary"></i>
                        <h3>Device Mockups</h3>
                        <p className="text-muted">Ready to use HTML/CSS device mockups, no Photoshop required!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-content">
            <div className="container">
              <h2>Stop waiting.<br/>Start building.</h2>
              <a href="#contact" className="btn btn-outline btn-xl js-scroll-trigger">Let's Get Started!</a>
            </div>
          </div>
          <div className="overlay"></div>
        </section>

        <section className="contact bg-primary" id="contact">
          <div className="container">
            <h2>We
              <i className="fa fa-heart"></i>
              new friends!</h2>
            <ul className="list-inline list-social">
              <li className="list-inline-item social-twitter">
                <a href="#">
                  <i className="fa fa-twitter"></i>
                </a>
              </li>
              {/* <li className="list-inline-item social-facebook">
              <a href="#">
              <i className="fa fa-facebook"></i>
              </a>
              </li>
              <li className="list-inline-item social-google-plus">
              <a href="#">
              <i className="fa fa-google-plus"></i>
              </a>
              </li> */}
            </ul>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <FireSubscription history={this.props.history} />
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <FiresMap />
          </div>
        </section>

      </div>
    );
  };
}

export default translate([], { wait: true })(Index);
