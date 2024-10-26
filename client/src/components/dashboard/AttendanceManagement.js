import React, { useState, useEffect } from 'react';
import { checkInDoctor, checkOutDoctor, fetchDoctorsByHospital, fetchDoctorsByStaffId, fetchDoctorNameById, fetchAttendanceStatus, fetchHospitalIdByStaffId } from '../../services/apis';
import './AttendanceManagement.css';

const AttendanceManagement = () => {
    const [userId, setUserId] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [doctorName, setDoctorName] = useState('No doctor selected');
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem('id');
        setUserId(storedId);
        if (storedId) {
            fetchDoctors(storedId);
        }
    }, []);

    const fetchDoctors = async (staffId) => {
        try {
            const hospitalId = await fetchHospitalIdByStaffId(staffId);
            const doctorsData = await fetchDoctorsByHospital(hospitalId);
            setDoctors(doctorsData);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleDoctorChange = async (e) => {
        const selectedDoctorId = e.target.value;
        setSelectedDoctor(selectedDoctorId);

        try {
            const doctorData = await fetchDoctorNameById(selectedDoctorId);
            if (doctorData && doctorData[0].FirstName && doctorData[0].LastName) {
                setDoctorName(`${doctorData[0].FirstName} ${doctorData[0].LastName}`);
            } else {
                setDoctorName('No doctor found');
            }

            // Fetch the latest attendance status for the selected doctor
            const attendanceStatus = await fetchAttendanceStatus(selectedDoctorId);
            setIsCheckedIn((attendanceStatus.isPresent === 1) ? true : false); // Update check-in status based on attendance

        } catch (error) {
            console.error('Error fetching doctor data:', error);
            setDoctorName('No doctor found');
        }
    };

    const handleCheckIn = async () => {
        try {
            const response = await checkInDoctor(selectedDoctor);
            setMessage(response.message);
            setError('');
            setIsCheckedIn(true);
        } catch (error) {
            setError('Error checking in: ' + error.response.data.message);
            setMessage('');
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await checkOutDoctor(selectedDoctor);
            setMessage(response.message);
            setError('');
            setIsCheckedIn(false);
        } catch (error) {
            setError('Error checking out: ' + error.response.data.message);
            setMessage('');
        }
    };

    return (
        <div className="attendance-management-container">
            <div className="form-group">
                <div className="input-group">
                    <label htmlFor="doctor">Select Doctor:</label>
                    <select id="doctor" value={selectedDoctor} onChange={handleDoctorChange} required>
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.DoctorID} value={doctor.DoctorID}>
                                {doctor.FirstName} {doctor.LastName} (ID: {doctor.DoctorID})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="doctor-name">
                    <label>Doctor Name:</label>
                    <p>{doctorName}</p>
                </div>
            </div>
            <div className="button-group">
                {isCheckedIn ? (
                    <button onClick={handleCheckOut}>Check Out</button>
                ) : (
                    <button onClick={handleCheckIn}>Check In</button>
                )}
            </div>
            {message && <p className="success-message">{message}</p>}
            <p className={`error-message ${!error ? 'hidden' : ''}`}>{error}</p>
        </div>
    );
};

export default AttendanceManagement;
