import React, { useState, useEffect } from 'react';
import { FaHospital, FaStethoscope, FaCalendarAlt, FaClock, FaPlus, FaTrash, FaInfoCircle, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa';
import './AppointmentScheduling.css';
import Notification from './Notification';
import { fetchAppointments, cancelAppointment, fetchDoctorName, fetchHospitals, fetchDoctors, fetchAvailableTimes, scheduleAppointment } from '../../services/apis';
import CustomDialog from './CustomDialog';

const AppointmentScheduling = () => {
    const [userID, setUserID] = useState('');
    const [userPosition, setUserPosition] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [notification, setNotification] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [showAppointmentList, setShowAppointmentList] = useState(true);

    useEffect(() => {
        const storedId = localStorage.getItem('id');
        const storedPosition = localStorage.getItem('position');
        if (storedId && storedPosition) {
            setUserID(storedId);
            setUserPosition(storedPosition);
            loadAppointments(storedId, storedPosition);
            if (storedPosition === 'patient') {
                fetchHospitalsData();
                fetchAppointmentTypes();
            }
        }
    }, []);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchAvailableTimesData(selectedDoctor, selectedDate);
        } else {
            setAvailableTimes([]);
        }
    }, [selectedDoctor, selectedDate]);

    const loadAppointments = async (id, position) => {
        try {
            console.log('Fetching appointments for userID:', id);
            const response = await fetchAppointments(id, position);
            console.log('Appointments fetched:', response);
            
            const appointmentsWithDetails = await Promise.all(response.map(async (appointment) => {
                const doctorName = await fetchDoctorName(appointment.DoctorID);
                return { ...appointment, DoctorName: doctorName };
            }));
            console.log("Details: " + response)
            setAppointments(appointmentsWithDetails);
        } catch (error) {
            console.error('Error loading appointments:', error);
            setNotification({ message: 'Failed to load appointments. Please try again.', type: 'error' });
        }
    };

    const fetchHospitalsData = async () => {
        try {
            const hospitalsData = await fetchHospitals();
            setHospitals(hospitalsData);
        } catch (error) {
            setNotification({ message: 'Failed to load hospitals. Please try again.', type: 'error' });
        }
    };

    const fetchAppointmentTypes = async () => {
        // This should be replaced with an actual API call to fetch appointment types
        setAppointmentTypes(['General Checkup', 'Specialist Consultation', 'Follow-up', 'Vaccination']);
    };

    const fetchDoctorsData = async (hospitalId) => {
        try {
            const doctorsData = await fetchDoctors(hospitalId);
            setDoctors(doctorsData);
        } catch (error) {
            setDoctors([]);
            setNotification({ message: 'Failed to load doctors. Please try again.', type: 'error' });
        }
    };

    const fetchAvailableTimesData = async (doctorId, date) => {
        try {
            const availableTimesData = await fetchAvailableTimes(doctorId, date);
            setAvailableTimes(availableTimesData);
        } catch (error) {
            setAvailableTimes([]);
            setNotification({ message: 'Failed to load available times. Please try again.', type: 'error' });
        }
    };

    const handleAddAppointment = () => {
        setShowAddForm(true);
        setSelectedAppointment(null);
        setShowAppointmentList(false); // Hide the appointment list
    };

    const handleDeleteClick = (appointmentId) => {
        setAppointmentToDelete(appointmentId);
        setShowDialog(true);
    };


    const handleConfirmDelete = async () => {
        if (appointmentToDelete) {
            try {
                await cancelAppointment(appointmentToDelete);
                setNotification({ message: 'Appointment cancelled successfully', type: 'success' });
                loadAppointments(userID, userPosition); // Reload appointments after cancellation
            } catch (error) {
                console.error('Error cancelling appointment:', error);
                setNotification({ message: 'Failed to cancel appointment. Please try again.', type: 'error' });
            } finally {
                setShowDialog(false);
                setAppointmentToDelete(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDialog(false);
        setAppointmentToDelete(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const [startTime, endTime] = selectedTime.split('-');
            
            const appointmentData = {
                patientID: userID,
                hospitalID: selectedHospital,
                doctorID: selectedDoctor,
                appointmentType: selectedType,
                appointmentDate: selectedDate,
                appointmentStartTime: startTime,
                appointmentEndTime: endTime,
                status: 'Scheduled'
            };

            await scheduleAppointment(appointmentData);
            
            setSelectedHospital('');
            setSelectedDoctor('');
            setSelectedType('');
            setSelectedDate('');
            setSelectedTime('');
            loadAppointments(userID, userPosition);
            setShowAddForm(false);
            setShowAppointmentList(true); // Show the appointment list after scheduling

            setNotification({ message: 'Appointment scheduled successfully!', type: 'success' });
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            setNotification({ message: 'Failed to schedule appointment. Please try again.', type: 'error' });
        }
    };

    const handleHospitalChange = (e) => {
        const hospitalId = e.target.value;
        setSelectedHospital(hospitalId);
        setSelectedDoctor('');
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimes([]);
        if (hospitalId) {
            fetchDoctorsData(hospitalId);
        } else {
            setDoctors([]);
        }
    };

    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
        setSelectedDate('');
        setSelectedTime('');
        setAvailableTimes([]);
    };

    const closeNotification = () => {
        setNotification(null);
    };

    const handleCancelAddAppointment = () => {
        setShowAddForm(false);
        setShowAppointmentList(true); // Show the appointment list again
    };

    return (
        <div className="appointment-scheduling">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
            
            {userPosition === 'patient' && !showAddForm && (
                <button onClick={handleAddAppointment} className="add-btn">
                    <FaPlus /> Schedule New Appointment
                </button>
            )}
            
            {showAddForm ? (
                <div className="new-appointment-form">
                    <h3>Schedule Appointment</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="hospital"><FaHospital /> Hospital</label>
                            <select
                                id="hospital"
                                value={selectedHospital}
                                onChange={handleHospitalChange}
                                required
                            >
                                <option value="">Select a hospital</option>
                                {hospitals.map((hospital) => (
                                    <option key={hospital.HospitalID} value={hospital.HospitalID}>
                                        {hospital.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="appointmentType"><FaStethoscope /> Appointment Type</label>
                            <select
                                id="appointmentType"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                required
                            >
                                <option value="">Select appointment type</option>
                                {appointmentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="doctor"><FaStethoscope /> Doctor</label>
                            <select
                                id="doctor"
                                value={selectedDoctor}
                                onChange={handleDoctorChange}
                                required
                                disabled={!selectedHospital}
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.DoctorID} value={doctor.DoctorID}>
                                        Dr. {doctor.FirstName} {doctor.LastName} - {doctor.Specialty}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date"><FaCalendarAlt /> Date</label>
                            <input
                                type="date"
                                id="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required
                                disabled={!selectedDoctor}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="time"><FaClock /> Time</label>
                            <select
                                id="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required
                                disabled={!selectedDoctor || !selectedDate}
                            >
                                <option value="">Select a time</option>
                                {availableTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-form-btn" onClick={handleCancelAddAppointment}>Cancel</button>
                            <button type="submit" className="submit-btn">Schedule Appointment</button>
                        </div>
                    </form>
                </div>
            ) : showAppointmentList && (
                <>
                    {appointments.filter(appointment => appointment.Status !== 'Cancelled').length > 0 ? (
                        <ul className="appointment-list">
                            {appointments.filter(appointment => appointment.Status !== 'Cancelled').map((appointment) => (
                                <li key={appointment.AppointmentID} className="appointment-item">
                                    <div className="appointment-header">
                                        <h3>{appointment.AppointmentType}</h3>
                                        <div className="appointment-status-actions">
                                            <span className="appointment-status">
                                                <FaCheckCircle />&nbsp; {appointment.Status}
                                            </span>
                                            {userPosition === 'patient' && appointment.Status === 'Scheduled' && (
                                                <button 
                                                    onClick={() => handleDeleteClick(appointment.AppointmentID)} 
                                                    className="cancel-appointment-btn" 
                                                    title="Cancel this appointment"
                                                >
                                                    <FaTrash /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="appointment-grid">
                                        {userPosition !== 'patient' && (
                                            <div className="appointment-category">
                                                <h4><FaUser /> Patient</h4>
                                                <p>{appointment.PatientName}</p>
                                            </div>
                                        )}
                                        {userPosition === 'patient' && (
                                            <div className="appointment-category">
                                                <h4><FaStethoscope /> Doctor</h4>
                                                <p>{appointment.DoctorName}</p>
                                            </div>
                                        )}
                                        <div className="appointment-category">
                                            <h4><FaCalendarAlt /> Date & Time</h4>
                                            <p>{new Date(appointment.AppointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p>{appointment.AppointmentStartTime} - {appointment.AppointmentEndTime}</p>
                                        </div>
                                        <div className="appointment-category">
                                            <h4><FaHospital /> Location</h4>
                                            <p>{appointment.HospitalName}</p>
                                            <p><FaMapMarkerAlt /> {appointment.HospitalAddress}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-appointments">No scheduled appointments.</p>
                    )}
                </>
            )}

            {showDialog && (
                <CustomDialog
                    message="Are you sure you want to cancel this appointment?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};


export default AppointmentScheduling;