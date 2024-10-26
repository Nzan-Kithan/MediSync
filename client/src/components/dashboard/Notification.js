import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <p>{message}</p>
            <button onClick={onClose}>&times;</button>
        </div>
    );
};

export default Notification;
