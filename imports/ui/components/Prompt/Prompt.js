/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { confirmable } from 'react-confirm';

// https://github.com/haradakunihiko/react-confirm/blob/master/example/react-bootstrap/src/components/Confirmation.js
class Prompt extends Component {
  render() {
    const {
      show,
      proceed,
      dismiss,
      cancel,
      confirmation,
      okBtn,
      cancelBtn,
      title,
      enableEscape = true
    } = this.props;
    return (
     <div className="static-modal">
        <Modal
            show={show}
            onHide={dismiss}
            style={{ opacity: 1 }}
            aria-labelledby="ModalHeader"
            backdrop={enableEscape ? true : 'static'}
            keyboard={enableEscape}
        >
          {title &&
           <Modal.Header closeButton>
             <Modal.Title id="ModalHeader">{title}</Modal.Title>
           </Modal.Header>
          }
          <Modal.Body>
            <p>{confirmation}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="button-l" bsStyle="primary" onClick={proceed}>{okBtn}</Button>
            <Button onClick={cancel}>{cancelBtn}</Button>
          </Modal.Footer>
        </Modal>
     </div>
    );
  }
}

Prompt.propTypes = {
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func, // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func, // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string, // arguments of your confirm function
  title: PropTypes.string,
  okBtn: PropTypes.string.isRequired,
  cancelBtn: PropTypes.string.isRequired,
  enableEscape: PropTypes.bool
};

Prompt.defaultProps = {
};

export default confirmable(Prompt);
