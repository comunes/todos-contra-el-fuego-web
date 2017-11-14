import React from 'react';
import { Button } from 'react-bootstrap';
import { translate } from 'react-i18next';

import './Index.scss';
import './Index-custom.scss';

const Index = (props) => {
  const { t } = props;
  return (
    <div className="IndexDisabled">
      {/* https://v4-alpha.getbootstrap.com/components/carousel/  */}
      <header>
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
            <h1 className="scale--js">{props.t('AppName')}</h1>
          </div>
          <p>Siempre alerta a los fuegos en nuestro vecindario</p>
          <button type="button" className="btn btn-raised btn-lg btn-warning">PARTICIPA</button>
        </div>
      </section>
    </div>
  );
};

function scaleHeader() {
  var scalable = document.querySelectorAll('.scale--js');
  var margin = 10;
  for (var i = 0; i < scalable.length; i++) {
    var scalableContainer = scalable[i].parentNode;
    scalable[i].style.transform = 'scale(1)';
    var scalableContainerWidth = scalableContainer.offsetWidth - margin;
    var scalableWidth = scalable[i].offsetWidth;
    scalable[i].style.transform = 'scale(' + scalableContainerWidth / scalableWidth + ')';
    scalableContainer.style.height = scalable[i].getBoundingClientRect().height + 'px';
  }
}


// Debounce by David Walsch
// https://davidwalsh.name/javascript-debounce-function

function debounce(func, wait, immediate) {
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

var myScaleFunction = debounce(function() {
  scaleHeader();
}, 250);

myScaleFunction();

window.addEventListener('resize', myScaleFunction);

export default translate([], { wait: true })(Index);
