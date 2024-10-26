import React, { useEffect, useState } from 'react';
import { fetchDoctorAttendance, fetchHospitals } from '../../services/apis'; // Import your API functions
import './DoctorAvailability.css'; // Import your styles

const DoctorAvailability = () => {
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState("none");

    useEffect(() => {
        const loadHospitals = async () => {
            try {
                const hospitalData = await fetchHospitals(); // Fetch hospitals
                console.log(hospitalData)
                setHospitals(hospitalData);
            } catch (error) {
                console.error('Error fetching hospitals:', error);
            }
        };

        loadHospitals();
    }, []);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const attendanceData = await fetchDoctorAttendance(); // Fetch doctor attendance
                setDoctors(attendanceData);
            } catch (error) {
                console.error('Error fetching doctor attendance:', error);
            }
        };

        loadDoctors();
    }, []);

    const handleHospitalChange = (e) => {
        setSelectedHospital(e.target.value);
    };

    const filteredDoctors = selectedHospital
        ? doctors.filter(doctor => doctor.hospitalId === selectedHospital)
        : doctors;

    return (
        <div className="present-doctors">
            <div className="hospital-selection">
                <label htmlFor="hospital">Select Hospital:</label>
                <select className="hospital-filter" id="hospital" value={selectedHospital} onChange={handleHospitalChange}>
                    <option value="none">None</option>
                    {hospitals.map(hospital => (
                        <option key={hospital.HospitalID} value={hospital.HospitalID}>
                            {hospital.Name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="doctor-list">
                {(filteredDoctors.length > 0) ? (
                    filteredDoctors.map(doctor => (
                        <div key={doctor.DoctorID} className="doctor-item">
                            <h3>{doctor.name}</h3>
                            <p><strong>Specialty:</strong> {doctor.specialty}</p>
                            <p><strong>Hospital:</strong> {doctor.hospitalName}</p>
                            <p><strong>Status:</strong> Present</p>
                        </div>
                    ))
                ) : (
                    <div className="doctor-item nil">
                        <p>No present doctors found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAvailability;
