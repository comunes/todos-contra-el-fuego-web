/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-absolute-path */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { confirmable } from 'react-confirm';

class Prompt extends Component {
  // constructor(props) {
  /* super(props);
     * this.state = {
     *   open: true
     * };
       }

       componentDidMount() {
     * console.log(this.prompt);
     * this.setState({ open: true });
       }
     */

  render2() {
    const {
      show,
      proceed,
      dismiss,
      cancel,
      confirmation,
      okBtn,
      cancelBtn
    } = this.props;
    return (
      <div
          className="modal"
tabIndex="-1"
role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">Save changes</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const {
      show,
      proceed,
      dismiss,
      cancel,
      confirmation,
      okBtn,
      cancelBtn,
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
          <Modal.Header closeButton>
            <Modal.Title id="ModalHeader" />
          </Modal.Header>
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
  okBtn: PropTypes.string.isRequired,
  cancelBtn: PropTypes.string.isRequired,
  enableEscape: PropTypes.bool
};

Prompt.defaultProps = {
};

export default confirmable(Prompt);
