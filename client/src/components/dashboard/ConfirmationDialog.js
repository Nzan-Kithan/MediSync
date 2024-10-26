import React from 'react';
import './ConfirmationDialog.css'; // Add styles for the dialog

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-dialog">
            <div className="dialog-content">
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="dialog-actions">
                    <button onClick={onConfirm} className="confirm-button">Confirm</button>
                    <button onClick={onCancel} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;