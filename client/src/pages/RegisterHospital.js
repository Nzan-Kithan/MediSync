import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerHospital } from '../services/apis';
import { FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaUserTie, FaGlobe, FaLock } from 'react-icons/fa';
import './RegisterHospital.css';

function RegisterHospital() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    contactPersonName: '',
    contactPersonPosition: '',
    websiteURL: '',
    password: '', // New field for password
    confirmPassword: '', // New field for password confirmation
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
      const response = await registerHospital(formData);
      console.log('Registration response:', response);
      navigate('/');
    } catch (error) {
      setError('Failed to register hospital. Please try again.');
      console.error('Error registering hospital:', error.response?.data || error.message);
    }
  };

  return (
    <div className="hospital-register-page">
      <section className="register-banner">
        <div className="banner-content">
          <h1>Hospital Registration</h1>
          <p>Join MediSync and enhance your healthcare services</p>
        </div>
      </section>

      <section className="register-content">
        <div className="register-form-container">
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="name"><FaHospital /> Hospital Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="address"><FaMapMarkerAlt /> Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} required></textarea>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="phoneNumber"><FaPhone /> Phone Number</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email"><FaEnvelope /> Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="contactPersonName"><FaUser /> Contact Person Name</label>
                <input type="text" id="contactPersonName" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="contactPersonPosition"><FaUserTie /> Contact Person Position</label>
                <input type="text" id="contactPersonPosition" name="contactPersonPosition" value={formData.contactPersonPosition} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="websiteURL"><FaGlobe /> Website URL</label>
                <input type="url" id="websiteURL" name="websiteURL" value={formData.websiteURL} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="password"><FaLock /> Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword"><FaLock /> Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="register-btn">Register Hospital</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}

export default RegisterHospital;