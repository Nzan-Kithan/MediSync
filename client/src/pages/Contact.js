import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formData);
        // Reset form after submission
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-page">
            <section className="contact-banner">
                <div className="banner-content">
                    <h1>Contact Us</h1>
                    <p>We're here to help and answer any question you might have</p>
                </div>
            </section>

            <section className="contact-section">
                <div className="section-content">
                    <div className="contact-form-container">
                        <h2>Send us a message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
                            </div>
                            <button type="submit" className="submit-button">Send Message</button>
                        </form>
                    </div>
                    <div className="contact-info-container">
                        <h2>Contact Information</h2>
                        <div className="info-item">
                            <FaEnvelope className="info-icon" />
                            <p>info@medisync.com</p>
                        </div>
                        <div className="info-item">
                            <FaPhone className="info-icon" />
                            <p>+1 (555) 123-4567</p>
                        </div>
                        <div className="info-item">
                            <FaMapMarkerAlt className="info-icon" />
                            <p>123 MediSync Street, Health City, MC 12345</p>
                        </div>
                        <div className="social-media">
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaTwitter /></a>
                            <a href="#" className="social-icon"><FaLinkedinIn /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;