import React, { useEffect, useState } from 'react';
import { fetchBills, updateBillStatus } from '../../services/apis'; // Ensure this is imported
import PaymentModal from './PaymentModal'; // Import the PaymentModal component
import './BillChecking.css'; // Import the CSS file

const BillChecking = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const userId = localStorage.getItem('id'); // Get UserID from local storage

    useEffect(() => {
        const loadBills = async () => {
            try {
                const fetchedBills = await fetchBills(userId);
                setBills(fetchedBills);
            } catch (err) {
                setError('Failed to load bills. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadBills();
    }, [userId]);

    const handlePayClick = (billId, amount) => {
        setSelectedBillId(billId);
        setSelectedAmount(amount);
        setIsModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        try {
            await updateBillStatus(selectedBillId);
            setNotification({ message: 'Payment successful!', type: 'success' });
            setError(null);
            const updatedBills = await fetchBills(userId);
            setBills(updatedBills);
        } catch (error) {
            setNotification({ message: 'Failed to update bill status. Please try again.', type: 'error' });
        }
    };

    const handlePaymentFailure = () => {
        setNotification({ message: 'Payment failed. Please try again.', type: 'error' });
    };

    const closeNotification = () => {
        setNotification({ message: '', type: '' }); // Clear the notification
    };

    if (loading) return <p>Loading bills...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bill-checking-container">
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                    <button className="close-notification" onClick={closeNotification}>
                        X {/* Close button without icon */}
                    </button>
                </div>
            )}
            <ul className="bill-list">
                {(bills.length > 0) ? (
                    bills.map(bill => (
                        <li key={bill.BillID} className="bill-item">
                            <div className="bill-header">
                                <p className="amount">
                                    Amount: <span>₹{Number(bill.Amount).toFixed(2)}</span>
                                </p> {/* Amount displayed first */}
                                <h3 className="hospital-name">{bill.HospitalName}</h3> {/* Hospital name displayed next */}
                            </div>
                            <div className="bill-details">
                                <div className="status-due-container">
                                    <p className={`status status-${bill.Status.toLowerCase()}`}>
                                        Status: <span>{bill.Status}</span>
                                    </p>
                                    <p className="due-date">
                                        Due Date: <span>{new Date(bill.DueDate).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                            <p className="description">
                                Description: <span>{bill.Description}</span>
                            </p> {/* Description remains unchanged */}
                            {/* Apply different classes based on the status */}
                            {bill.Status === 'Paid' ? (
                                <button className="paid-button" disabled>Paid</button>
                            ) : (
                                <button className="pay-button" onClick={() => handlePayClick(bill.BillID, bill.Amount)}>Pay</button>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="empty-list">No bill exists</li>
                )}
            </ul>
            <PaymentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                amount={selectedAmount} 
                onPaymentSuccess={handlePaymentSuccess} 
                onPaymentFailure={handlePaymentFailure} 
            />
        </div>
    );
};

export default BillChecking;
