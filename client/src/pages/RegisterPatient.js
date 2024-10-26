import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerPatient } from '../services/apis';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaVenusMars, FaPhone, FaMapMarkerAlt, FaCity, FaFlag, FaMapPin, FaTint, FaUserFriends, FaUserPlus } from 'react-icons/fa';
import './RegisterPatient.css';

const RegisterPatient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        bloodGroup: '',
        maritalStatus: '',
        occupation: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const formattedData = {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : undefined
            };
            console.log('Sending data:', formattedData); // Log data being sent
            const response = await registerPatient(formattedData);
            console.log('Registration response:', response); // Log server response
            navigate('/login');
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Registration error:', error.response?.data || error.message);
        }
    };

    return (
        <div className="patient-register-page">
            <section className="register-banner">
                <div className="banner-content">
                    <h1>Patient Registration</h1>
                    <p>Join MediSync and take control of your healthcare journey</p>
                </div>
            </section>

            <section className="register-content">
                <div className="register-form-container">
                    <form onSubmit={handleSubmit} className="register-form">
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
                                <div className="form-group">
                                    <label htmlFor="maritalStatus"><FaVenusMars /> Marital Status</label>
                                    <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-category">
                            <h2 className="category-title">Contact Information</h2>
                            <div className="form-section">
                                <div className="form-group">
                                    <label htmlFor="phoneNumber"><FaPhone /> Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address"><FaMapMarkerAlt /> Address</label>
                                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="city"><FaMapMarkerAlt /> City</label>
                                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state"><FaMapMarkerAlt /> State</label>
                                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="zipCode"><FaMapMarkerAlt /> Zip Code</label>
                                    <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-category">
                            <h2 className="category-title">Medical Information</h2>
                            <div className="form-section">
                                <div className="form-group">
                                    <label htmlFor="bloodGroup"><FaTint /> Blood Group</label>
                                    <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                {/* Add more medical-related fields here */}
                            </div>
                        </div>

                        <div className="form-category">
                            <h2 className="category-title">Emergency Contact</h2>
                            <div className="form-section">
                                <div className="form-group">
                                    <label htmlFor="emergencyContactName"><FaUserFriends /> Emergency Contact Name</label>
                                    <input type="text" id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emergencyContactPhone"><FaPhone /> Emergency Contact Phone</label>
                                    <input type="tel" id="emergencyContactPhone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="register-btn">
                            <FaUserPlus /> Register
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </section>
        </div>
    );
};

export default RegisterPatient;