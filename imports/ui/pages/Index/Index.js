/* eslint-disable import/no-absolute-path */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable key-spacing */
/* eslint-env jquery */
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import PropTypes from 'prop-types';
// import { HashLink as Link } from 'react-router-hash-link';
// import { Link } from 'react-router-dom';
// https://www.npmjs.com/package/react-resize-detector
import ReactResizeDetector from 'react-resize-detector';
import _ from 'lodash';
import { ScrollToTopOnMount, SectionsContainer, Section } from 'react-fullpage';
import 'html5-device-mockups/dist/device-mockups.min.css';
import FireSubscription from '/imports/ui/pages/FireSubscription/FireSubscription';
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
    // https://github.com/subtirelumihail/react-fullpage
    const fullPageOptions = {
      activeClass:          'active', // the class that is appended to the sections links
      anchors:              ['home', 'crowdsourcing', 'platforms', 'participe', 'fires'], // the anchors for each sections
      arrowNavigation:      false, // use arrow keys (true after development)
      className:            'section-container', // the class name for the section container
      delay:                1000, // the scroll animation speed
      navigation:           true, // use dots navigation
      scrollBar:            false, // use the browser default scrollbar
      sectionClassName:     'section', // the section class name
      sectionPaddingTop:    '0', // the section top padding
      sectionPaddingBottom: '0', // the section bottom padding
      verticalAlign:        false // align the content of each section vertical
    };

    return (
      <div className="IndexDisabled full-width">
        {/* https://v4-alpha.getbootstrap.com/components/carousel/  */}

        <ScrollToTopOnMount />
        <SectionsContainer className="container" {...fullPageOptions}>
          <Section>
            <header>
              <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
              <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  ref={(ref) => { this.slides = ref; }}
              >
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
                      <h3><i className="fa fa-map-pointer" aria-hidden="true" />Elige un lugar</h3>
                      <p />
                    </div>
                  </div>

                  <div className="carousel-item carousel-item-2">
                    <div className="slide-2-icon" />
                    <div className="carousel-caption">
                      <h3><i className="fa fa-dot-circle-o" aria-hidden="true" />Elige un radio de vigilancia</h3>
                      <p />
                    </div>
                  </div>

                  <div className="carousel-item carousel-item-3">
                    <div className="slide-3-icon" />
                    <div className="carousel-caption">
                      <h3><i className="fa fa-podcast" aria-hidden="true" />Recibe alertas de fuegos en esa zona</h3>
                      <p />
                    </div>
                  </div>

                  <div className="carousel-item carousel-item-4">
                    <div className="slide-4-icon" />
                    <div className="carousel-caption">
                      <h3><i className="fa fa-bell-o" aria-hidden="true" />Alerta cuando hay un fuego</h3>
                      <p />
                    </div>
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true" />
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
                {/* <Link className="participe-btn btn btn-lg btn-warning" role="button" to="/#platforms">{this.props.t('Participa')}</Link> */}
              </div>
            </section>
          </Section>

          <Section className="crowd text-center bg-image-full">
            <div className="container">
              <div className="row">
                <div className="col-md-8 mx-auto">
                  <h2 className="section-heading">Colaboración masiva contra los incendios</h2>
                  <p><Trans>Imágenes capturadas por los satélites de la NASA muestran el humo de grandes incendios que se extienden sobre el Océano Pacífico. La actividad del fuego está delineada en rojo.</Trans></p>
                </div>
              </div>
            </div>
          </Section>
          <Section className="platf">
            <div className="container">
              <div className="section-heading text-center">
                <h2><Trans>Somos muchos ojos</Trans></h2>
                <p className="text-muted"><Trans>Usamos diferentes fuentes de datos para notificarte de fuegos activos en tus zonas de interés</Trans></p>
                <hr />
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
                          <i className="icon-envelope-open text-primary" />
                          <h3><Trans>Correo electronico</Trans></h3>
                          <p className="text-muted"><Trans>Recibe nuestras notificaciones de fuegos por correo</Trans></p>
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
                          <p className="text-muted"><Trans i18nKey="dev-with-us-home">Todo nuestro trabajo es sofware libre. <a href="https://github.com/comunes/todos-contra-el-fuego" rel="noopener noreferrer" target="_blank">Traductoræs y desarrolladoræs siempre bienvenid@s</a>.</Trans></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section className="">
            <div className="container">
              <FireSubscription history={this.props.history} focusInput={false} />
            </div>
            <div className="overlay" />
          </Section>

          <Section className="">
            <div className="container">
              <FiresMap />
            </div>
          </Section>
        </SectionsContainer>
      </div>
    );
  }
}

Index.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default translate([], { wait: true })(Index);
