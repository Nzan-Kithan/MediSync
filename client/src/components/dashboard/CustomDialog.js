import React from 'react';
import './CustomDialog.css';

const CustomDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="custom-dialog-overlay">
      <div className="custom-dialog">
        <p>{message}</p>
        <div className="custom-dialog-buttons">
          <button onClick={onConfirm} className="confirm-btn">Confirm</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
