import React from 'react'

if (require('exenv').canUseDOM) require('./Modal.css')

const Modal = ({ children }) => (
  <div className="modal--layer" contentEditable={false}>
    <div className="modal--container">
      {children}
    </div>
  </div>
)

Modal.Header = ({ title = '', closeButtonAction }) => (
  <div className="modal--header">
    {title}
    {closeButtonAction && (
      <button
        className="button--close"
        onClick={closeButtonAction}
        title='Close'
      />
    )}
  </div>
)

export default Modal