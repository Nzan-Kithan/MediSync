import React from 'react';
import './PaymentModal.css'; // Import the CSS for the modal

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess, onPaymentFailure }) => {
    if (!isOpen) return null;

    const handlePayment = (method) => {
        // Simulate payment processing
        const paymentSuccessful = Math.random() > 0.2; // 80% chance of success

        if (paymentSuccessful) {
            onPaymentSuccess(); // Call the success callback
        } else {
            onPaymentFailure(); // Call the failure callback
        }
        onClose(); // Close the modal after payment
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Select Payment Method</h2>
                <div className="payment-options">
                    <button onClick={() => handlePayment('Credit Card')}>Credit Card</button>
                    <button onClick={() => handlePayment('Debit Card')}>Debit Card</button>
                    <button onClick={() => handlePayment('Net Banking')}>Net Banking</button>
                    <button onClick={() => handlePayment('UPI')}>UPI</button>
                </div>
                <div className="confirm-payment">
                    <p>Pay ₹{amount}</p>
                    <button className="pay-button" onClick={() => handlePayment('Selected Method')}>Pay ₹{amount}</button>
                </div>
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default PaymentModal;
