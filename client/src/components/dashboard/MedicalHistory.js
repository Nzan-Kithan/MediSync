import React, { useEffect, useState } from 'react';
import { fetchMedicalHistory } from '../../services/apis';
import './MedicalHistory.css'; // Import the CSS file

const MedicalHistory = () => {
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMedicalHistory = async () => {
            const userId = localStorage.getItem('id'); // Get user ID from local storage
            if (!userId) {
                setError('User ID not found in local storage');
                setLoading(false);
                return;
            }

            try {
                const history = await fetchMedicalHistory(userId); // Pass userId to the fetch function
                setMedicalHistory(history);
            } catch (err) {
                setError('Error fetching medical history');
            } finally {
                setLoading(false);
            }
        };

        getMedicalHistory();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="medical-history-container">
            {medicalHistory.length === 0 ? (
                <p>No medical history records found.</p>
            ) : (
                <div className="medical-history-list">
                    {medicalHistory.map((entry) => (
                        <div key={entry.HistoryID} className="medical-history-item">
                            <div className="history-header">
                                <span className="doctor-name">Dr. {entry.DoctorName}</span>
                                <h3>{new Date(entry.VisitDate).toLocaleDateString()}</h3>
                            </div>
                            <p><strong>Condition:</strong> {entry.MedicalCondition}</p>
                            <p><strong>Treatment:</strong> {entry.Treatment}</p>
                            <p><strong>Notes:</strong> {entry.Notes}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;
