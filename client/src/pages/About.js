import React from 'react';
import { FaEye, FaListUl, FaHandshake, FaEnvelope, FaHospital, FaClock, FaLock, FaCalendar, FaQrcode } from 'react-icons/fa';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-banner">
                <div className="banner-content">
                    <h1>About MediSync</h1>
                    <p>Revolutionizing Healthcare Management</p>
                </div>
            </section>

            <section className="about-section vision">
                <div className="section-content">
                    <div className="text-content">
                        <div className="icon-wrapper">
                            <FaEye className="section-icon" />
                        </div>
                        <h2>Our Vision</h2>
                        <p>MediSync aims to create a seamless, integrated platform that connects patients, healthcare providers, and hospitals, transforming the way healthcare is managed and delivered.</p>
                    </div>
                </div>
            </section>
            
            <section className="about-section offerings">
                <div className="section-content">
                    <div className="text-content">
                        <div className="icon-wrapper">
                            <FaListUl className="section-icon" />
                        </div>
                        <h2>What We Offer</h2>
                        <div className="offerings-grid">
                            <div className="offering-item">
                                <FaHospital className="offering-icon" />
                                <h3>Multi-Hospital Management</h3>
                                <p>Efficiently manage patient information across multiple hospitals</p>
                            </div>
                            <div className="offering-item">
                                <FaClock className="offering-icon" />
                                <h3>Real-Time Tracking</h3>
                                <p>Monitor doctor and room availability in real-time</p>
                            </div>
                            <div className="offering-item">
                                <FaLock className="offering-icon" />
                                <h3>Secure Access</h3>
                                <p>Access medical records and billing information securely</p>
                            </div>
                            <div className="offering-item">
                                <FaCalendar className="offering-icon" />
                                <h3>Streamlined Scheduling</h3>
                                <p>Easily manage appointments and schedules</p>
                            </div>
                            <div className="offering-item">
                                <FaQrcode className="offering-icon" />
                                <h3>QR Code Integration</h3>
                                <p>Share information innovatively using QR codes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="about-section commitment">
                <div className="section-content">
                    <div className="text-content">
                        <div className="icon-wrapper">
                            <FaHandshake className="section-icon" />
                        </div>
                        <h2>Our Commitment</h2>
                        <p>We are dedicated to enhancing healthcare accessibility, reducing administrative burdens, and improving the overall patient experience through innovative technology and user-centered design.</p>
                    </div>
                </div>
            </section>
            
            <section className="about-section contact">
                <div className="section-content">
                    <div className="text-content">
                        <div className="icon-wrapper">
                            <FaEnvelope className="section-icon" />
                        </div>
                        <h2>Get in Touch</h2>
                        <p>Have questions or want to learn more about MediSync? We'd love to hear from you!</p>
                        <a href="/contact-us" className="cta-button">Contact Us</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
