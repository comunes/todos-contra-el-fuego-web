/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable key-spacing */
/* eslint-env jquery */
import React, { Component, Fragment } from 'react';
import { translate, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
// import { HashLink as Link } from 'react-router-hash-link';
// import { Link } from 'react-router-dom';
// https://www.npmjs.com/package/react-resize-detector
import ReactResizeDetector from 'react-resize-detector';
import _ from 'lodash';
import 'html5-device-mockups/dist/device-mockups.min.css';
import 'bootstrap-carousel-swipe-haven/carousel-swipe';
import { isAnyMobile } from '/imports/ui/components/Utils/isMobile';
import SubscriptionEditor from '/imports/ui/components/SubscriptionEditor/SubscriptionEditor';
import SubscriptionsMap from '/imports/ui/pages/Subscriptions/SubscriptionsMap';
import FiresMap from '../FiresMap/FiresMap';

import './Index.scss';
import './Index-custom.scss';

class Index extends Component {
  // Debounce by David Walsch
  // https://davidwalsh.name/javascript-debounce-function

  constructor(props) {
    super(props);
    const self = this;
    this.myScaleFunction = _.debounce(() => {
      self.scaleHeader();
    }, 250);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    $('.carousel').carousel();
  }

  onResize() {
    this.myScaleFunction();
  }

  getMap(isMobile) {
    if (!isMobile) {
      return (
        <section className="sect5">
          <div className="container">
            <FiresMap />
          </div>
        </section>);
    }
    return (<Fragment />);
  }

  scaleHeader() {
    const scalable = document.getElementById('tcefh1');
    const margin = 10;
    const scalableContainer = scalable.parentNode;
    scalable.style.transform = 'scale(1)';
    const scalableContainerWidth = scalableContainer.offsetWidth - margin;
    const scalableWidth = scalable.offsetWidth;
    scalable.style.transform = `scale(${scalableContainerWidth / scalableWidth})`;
    scalableContainer.style.height = `${scalable.getBoundingClientRect().height}px`;
  }

  handleBtnClick() {
    window.open('https://t.me/TodosContraElFuego_bot', '_blank');
  }

  render() {
    return (
      <div className="IndexDisabled full-width">
        {/* https://v4-alpha.getbootstrap.com/components/carousel/  */}
        <Fragment>
          <section className="sect1">
            <header>
              <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
              <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  ref={(ref) => { this.slides = ref; }}
              >
                {/* for dev: data-interval=false */}
                <ol className="carousel-indicators">
                  <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active" />
                  <li data-target="#carouselExampleIndicators" data-slide-to="1" />
                  <li data-target="#carouselExampleIndicators" data-slide-to="2" />
                  <li data-target="#carouselExampleIndicators" data-slide-to="3" />
                </ol>
                <div className="carousel-inner" role="listbox">

                  <div className="carousel-item carousel-item-1 active">
                    <div className="slide-1-icon" />
                    <div className="carousel-caption">
                      <h3><i className="fa fa-map-pointer" aria-hidden="true" /><Trans>Elige un lugar</Trans></h3>
                      <p />
                    </div>
                  </div>

                  <div className="carousel-item carousel-item-2">
                    <div className="slide-2-icon" />
                    <div className="carousel-caption">
                      <h3><i className="fa fa-dot-circle-o" aria-hidden="true" /><Trans>Elige un radio de vigilancia</Trans></h3>
                      <p />
                    </div>
                  </div>

                  <div className="carousel-item carousel-item-3">
                    <div className="slide-3-icon" />
                    <div className="carousel-caption">
                      <h3><i className="fa fa-podcast" aria-hidden="true" /><Trans>Recibe alertas de fuegos en esa zona</Trans></h3>
                      <p />
                    </div>
                  </div>

                  <div className="carousel-item carousel-item-4">
                    <div className="slide-4-icon" />
                    <div className="carousel-caption">
                      <h3><i className="fa fa-bell-o" aria-hidden="true" /><Trans>Alerta cuando hay un fuego</Trans></h3>
                      <p />
                    </div>
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="sr-only"><Trans>Anterior</Trans></span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="sr-only"><Trans>Siguiente</Trans></span>
                </a>
              </div>
            </header>
            <section className="py-5">
              <div className="container">
                <div className="scale__container--js">
                  <h1 id="tcefh1" className="scale--js">{this.props.t('AppName')}</h1>
                </div>
                <p className="moto"><Trans>Siempre alerta a los fuegos en nuestro vecindario</Trans></p>
                {/* <Link className="participe-btn btn btn-lg btn-warning" role="button" to="/#platforms">{this.props.t('Participa')}</Link> */}
              </div>
            </section>
          </section>

          <section className="crowd text-center bg-image-full sect2">
            <div className="container">
              <div className="row">
                <div className="col-md-8 mx-auto">
                  <h2 className="section-heading"><Trans>Colaboración masiva contra los incendios</Trans></h2>
                  <p><Trans>Usamos diferentes fuentes de datos para notificarte de fuegos activos en tus zonas de interés</Trans></p>
                </div>
              </div>
              <div className="row crowd-footer">
                <p className="text-muted"><Trans>Imágenes capturadas por los satélites de la NASA muestran el humo de grandes incendios que se extienden sobre el Océano Pacífico. La actividad del fuego está delineada en rojo.</Trans></p>
              </div>
            </div>
          </section>

          <section className="sect3">
            <div className="container">
              <SubscriptionsMap />
            </div>
          </section>

          <section className="sect4">
            <div className="container">
              <h4 className="page-header"><Trans parent="span">Suscríbete a alertas de fuegos</Trans></h4>
              <SubscriptionEditor
                  focusInput={false}
                  history={this.props.history}
              />
            </div>
          </section>

          {this.getMap(isAnyMobile)}

          <section className="platf sect6">
            <div className="container">
              <div className="section-heading text-center">
                <h2><Trans>Somos muchos ojos</Trans></h2>
              </div>
              <div className="row">
                <div className="col-lg-4 my-auto">
                  <div className="device-wrapper">
                    <div className="device" data-device="iPhone6" data-orientation="portrait" data-color="white">
                      <div className="screen">
                        {/* Demo image for screen mockup, you can put an image here, some HTML, an animation, video, or anything else! */}
                        <img src="/telegram-screen.png" className="img-fluid" alt="" />
                      </div>
                      <div className="button" tabIndex="-1" onKeyDown={() => {}} role="button" onClick={() => this.handleBtnClick()} />
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 my-auto">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-lg-6">
                        <a className="feature-link" rel="noopener noreferrer" target="_blank" href="https://t.me/TodosContraElFuego_bot">
                          <div className="feature-item">
                            <i className="fa fa-telegram text-primary" />
                            <h3>Telegram</h3>
                            <p className="text-muted"><Trans>Usa nuestro bot de Telegram para estar al tanto de los fuegos en tus área</Trans></p>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-6">
                        <div className="feature-item">
                          <i className="icon-speech text-primary" />
                          <h3><Trans>Notificaciones</Trans></h3>
                          <p className="text-muted"><Trans>Recibe nuestras notificaciones de fuegos por correo o en tu navegador</Trans></p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="feature-item">
                          <i className="icon-screen-smartphone text-primary" />
                          <h3><Trans>Otros dispositivos</Trans></h3>
                          <p className="text-muted"><Trans i18nKey="support-us-home">Estamos desarrollando nuestras herramientas para otros dispositivos. Puedes <a href="https://comunes.org/donate">contribuir a hacerlo posible.</a></Trans></p>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="feature-item">
                          <i className="icon-lock-open text-primary" />
                          <h3><Trans>Software Libre</Trans></h3>
                          <p className="text-muted"><Trans i18nKey="dev-with-us-home">Todo nuestro trabajo es sofware libre. <a href="https://github.com/comunes/todos-contra-el-fuego-web" rel="noopener noreferrer" target="_blank">Traductoræs y desarrolladoræs siempre bienvenid@s</a>.</Trans></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Fragment>
      </div>
    );
  }
}

Index.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(Index);
