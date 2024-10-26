import React, { useState, useEffect } from 'react';
import { fetchStaff, registerStaff, registerDoctor } from '../../services/apis';
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaVenusMars, FaPhone, FaMapMarkerAlt, FaBriefcase, FaHospital, FaCity, FaFlag, FaMapPin, FaUserMd, FaGraduationCap, FaCertificate, FaClock, FaStethoscope, FaPlus } from 'react-icons/fa';
import './StaffManagement.css';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRegisterStaff, setShowRegisterStaff] = useState(false);
    const [userPosition, setUserPosition] = useState('');
    const [userId, setUserId] = useState('');

    const [formData, setFormData] = useState({
        hospitalID: '',
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phoneNumber: '',
        hireDate: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        dateOfBirth: '',
        gender: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [doctorData, setDoctorData] = useState({
        staffID: '',
        specialty: '',
        licenseNumber: '',
        yearsOfExperience: '',
        consultationHours: {
            Sunday: [],
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: []
        },
        education: '',
        certifications: ''
    });

    const [isDoctor, setIsDoctor] = useState(false);
    const [isStaffRegistered, setIsStaffRegistered] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const positions = [
        "Doctor",
        "Nurse",
        "Laboratory Technician",
        "Medical Assistant",
        "Receptionist",
        "Administrative Assistant",
        "IT Specialist",
        "Human Resources Manager",
        "Accountant",
        "Janitor",
        "Security Guard"
    ];

    const doctorSpecialties = [
        "General Practitioner",
        "Surgeon",
        "Anesthesiologist",
        "Radiologist",
        "Pharmacist",
        "Physical Therapist",
        "Occupational Therapist",
        "Dietitian",
        "Nurse Practitioner"
    ];

    useEffect(() => {
        const storedPosition = localStorage.getItem('position');
        const storedId = localStorage.getItem('id');
        
        setUserPosition(storedPosition);
        setUserId(storedId);

        setFormData(prevData => ({
            ...prevData,
            hospitalID: storedId
        }));

        if (storedId) {
            fetchStaffData(storedId);
        }
    }, []);

    const fetchStaffData = async (hospitalId) => {
        try {
            const staffData = await fetchStaff(hospitalId);
            setStaff(staffData);
        } catch (error) {
            console.error('Error fetching staff data:', error);
        }
    };

    const handleAddStaff = () => {
        // Reset all relevant states
        setShowRegisterStaff(true);
        setIsStaffRegistered(false);
        setIsDoctor(false);
        setError('');
        setSuccessMessage('');
        setFormData({
            hospitalID: userId, // Keep the hospital ID
            firstName: '',
            lastName: '',
            position: '',
            email: '',
            phoneNumber: '',
            hireDate: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            dateOfBirth: '',
            gender: '',
            username: '',
            password: '',
            confirmPassword: ''
        });
        setDoctorData({
            staffID: '',
            specialty: '',
            licenseNumber: '',
            yearsOfExperience: '',
            consultationHours: {
                Sunday: [],
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: []
            },
            education: '',
            certifications: ''
        });
    };

    const handleStaffRegistered = () => {
        setShowRegisterStaff(false);
        fetchStaffData(userId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'position') {
            setIsDoctor(value === 'Doctor');
        }
        setError('');
    };

    const handleDoctorChange = (e) => {
        const { name, value } = e.target;
        setDoctorData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setSuccessMessage('');
        try {
            const response = await registerStaff(formData);
            console.log('Staff registration response:', response);
            setSuccessMessage('Staff registered successfully!');
            
            if (formData.position !== "Doctor") {
                // For non-doctor positions, hide the registration form and show the staff list
                setShowRegisterStaff(false);
                fetchStaffData(userId); // Refresh the staff list
            } else {
                // For doctors, keep the current behavior (showing doctor registration form)
                setIsStaffRegistered(true);
                setDoctorData(prevState => ({
                    ...prevState,
                    staffID: response.staffID,
                    hospitalID: formData.hospitalID
                }));
            }

            // Reset form data
            setFormData({
                hospitalID: userId,
                firstName: '',
                lastName: '',
                position: '',
                email: '',
                phoneNumber: '',
                hireDate: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                dateOfBirth: '',
                gender: '',
                username: '',
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            setError('Staff registration failed. Please try again.');
            console.error('Staff registration error:', error);
        }
    };

    const handleConsultationChange = (day, index, type, value) => {
        setDoctorData(prevState => {
            const newHours = [...prevState.consultationHours[day]];
            if (!newHours[index]) {
                newHours[index] = type === 'start' ? `${value}-17:00` : `09:00-${value}`;
            } else {
                const [start, end] = newHours[index].split('-');
                newHours[index] = type === 'start' ? `${value}-${end}` : `${start}-${value}`;
            }
            return {
                ...prevState,
                consultationHours: {
                    ...prevState.consultationHours,
                    [day]: newHours
                }
            };
        });
    };

    const addTimeSlot = (day) => {
        setDoctorData(prevState => ({
            ...prevState,
            consultationHours: {
                ...prevState.consultationHours,
                [day]: [...prevState.consultationHours[day], '09:00-17:00']
            }
        }));
    };

    const removeTimeSlot = (day, index) => {
        setDoctorData(prevState => ({
            ...prevState,
            consultationHours: {
                ...prevState.consultationHours,
                [day]: prevState.consultationHours[day].filter((_, i) => i !== index)
            }
        }));
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedConsultationHours = Object.fromEntries(
                Object.entries(doctorData.consultationHours)
                    .map(([day, slots]) => [day, slots.filter(slot => slot && slot !== ':-')])
                    .filter(([_, slots]) => slots.length > 0)
            );
            const doctorDataToSubmit = {
                ...doctorData,
                consultationHours: JSON.stringify(formattedConsultationHours)
            };
            const doctorResponse = await registerDoctor(doctorDataToSubmit);
            console.log('Doctor registration response:', doctorResponse);
            handleStaffRegistered();
        } catch (error) {
            setError('Doctor registration failed. Please try again.');
            console.error('Doctor registration error:', error);
        }
    };

    const filteredStaff = staff.filter(member =>
        `${member.FirstName} ${member.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="staff-management">
            {!showRegisterStaff ? (
                <>
                    <div className="staff-controls">
                        <div className="search-bar">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={handleAddStaff} className="add-staff-btn">
                            <FaUserPlus /> Add New Staff
                        </button>
                    </div>
                    <div className="staff-list">
                        {filteredStaff.map((member) => (
                            <div key={member.StaffID} className="staff-card">
                                <div className="staff-info">
                                    <h3>{`${member.FirstName} ${member.LastName}`}</h3>
                                    <p><strong>Position:</strong> {member.Position}</p>
                                    <p><strong>Email:</strong> {member.Email}</p>
                                    <p><strong>Phone:</strong> {member.PhoneNumber}</p>
                                </div>
                                <div className="staff-actions">
                                    <button className="edit-btn"><FaEdit /> Edit</button>
                                    <button className="delete-btn"><FaTrash /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="staff-register-page">
                    {!isStaffRegistered ? (
                        <form onSubmit={handleStaffSubmit} className="register-form">
                            <div className="form-category">
                                <h2 className="category-title">Account Information</h2>
                                <div className="form-section">
                                    <div className="form-group">
                                        <label htmlFor="username"><FaUser /> Username</label>
                                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email"><FaEnvelope /> Email</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password"><FaLock /> Password</label>
                                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword"><FaLock /> Confirm Password</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-category">
                                <h2 className="category-title">Personal Information</h2>
                                <div className="form-section">
                                    <div className="form-group">
                                        <label htmlFor="firstName"><FaUser /> First Name</label>
                                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName"><FaUser /> Last Name</label>
                                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dateOfBirth"><FaCalendarAlt /> Date of Birth</label>
                                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender"><FaVenusMars /> Gender</label>
                                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-category">
                                <h2 className="category-title">Contact Information</h2>
                                <div className="form-section">
                                    <div className="form-group phone">
                                        <label htmlFor="phoneNumber"><FaPhone /> Phone Number</label>
                                        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                    </div>
                                    <div className="form-group address">
                                        <label htmlFor="address"><FaMapMarkerAlt /> Address</label>
                                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group city">
                                        <label htmlFor="city"><FaCity /> City</label>
                                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group state">
                                        <label htmlFor="state"><FaFlag /> State</label>
                                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group zipcode">
                                        <label htmlFor="zipCode"><FaMapPin /> Zip Code</label>
                                        <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-category">
                                <h2 className="category-title">Employment Information</h2>
                                <div className="form-section">
                                    <div className="form-group">
                                        <label><FaHospital /> Hospital ID</label>
                                        <div className="id-display hospital-id-display">{formData.hospitalID}</div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="position"><FaBriefcase /> Position</label>
                                        <select id="position" name="position" value={formData.position} onChange={handleChange} required>
                                            <option value="">Select Position</option>
                                            {positions.map((position, index) => (
                                                <option key={index} value={position}>{position}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="hireDate"><FaCalendarAlt /> Hire Date</label>
                                        <input type="date" id="hireDate" name="hireDate" value={formData.hireDate} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-footer">
                                <div className="message-container">
                                    {successMessage && <p className="success-message">{successMessage}</p>}
                                    {error && <p className="error-message">{error}</p>}
                                    {!successMessage && !error && <p className="placeholder-message">&nbsp;</p>}
                                </div>

                                <div className="button-group">
                                    <button type="button" className="cancel-btn" onClick={() => setShowRegisterStaff(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="register-staff-btn">
                                        Register Staff
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleDoctorSubmit} className="register-form">
                            <div className="form-category">
                                <h2 className="category-title">Doctor Information</h2>
                                <div className="form-section">
                                    <div className="form-group">
                                        <label htmlFor="staffID"><FaUserMd /> Staff ID</label>
                                        <div className="id-display staff-id-display">{doctorData.staffID}</div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="specialty"><FaStethoscope /> Specialty</label>
                                        <select 
                                            id="specialty" 
                                            name="specialty" 
                                            value={doctorData.specialty} 
                                            onChange={handleDoctorChange} 
                                            required
                                        >
                                            <option value="">Select Specialty</option>
                                            {doctorSpecialties.map((specialty, index) => (
                                                <option key={index} value={specialty}>{specialty}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="licenseNumber"><FaUserMd /> License Number</label>
                                        <input type="text" id="licenseNumber" name="licenseNumber" value={doctorData.licenseNumber} onChange={handleDoctorChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="yearsOfExperience"><FaUserMd /> Years of Experience</label>
                                        <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={doctorData.yearsOfExperience} onChange={handleDoctorChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label><FaClock /> Consultation Hours</label>
                                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                            <div key={day} className="day-consultation">
                                                <h4>{day}</h4>
                                                {doctorData.consultationHours[day].map((slot, index) => (
                                                    <div key={index} className="time-slot">
                                                        <input
                                                            type="time"
                                                            value={slot.split('-')[0]}
                                                            onChange={(e) => handleConsultationChange(day, index, 'start', e.target.value)}
                                                        />
                                                        <span>to</span>
                                                        <input
                                                            type="time"
                                                            value={slot.split('-')[1]}
                                                            onChange={(e) => handleConsultationChange(day, index, 'end', e.target.value)}
                                                        />
                                                        <button type="button" onClick={() => removeTimeSlot(day, index)}>Remove</button>
                                                    </div>
                                                ))}
                                                <button type="button" className="add-slot" onClick={() => addTimeSlot(day)}>
                                                    <FaPlus /> Add Time Slot
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="education"><FaGraduationCap /> Education</label>
                                        <input type="text" id="education" name="education" value={doctorData.education} onChange={handleDoctorChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="certifications"><FaCertificate /> Certifications</label>
                                        <textarea id="certifications" name="certifications" value={doctorData.certifications} onChange={handleDoctorChange} required />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-footer">
                                <div className="message-container">
                                    {successMessage && <p className="success-message">{successMessage}</p>}
                                    {error && <p className="error-message">{error}</p>}
                                    {!successMessage && !error && <p className="placeholder-message">&nbsp;</p>}
                                </div>

                                <div className="button-group">
                                    <button type="submit" className="register-staff-btn">
                                        Register Doctor
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default StaffManagement;