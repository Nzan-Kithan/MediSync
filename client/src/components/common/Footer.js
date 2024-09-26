import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () =>
{
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About MediSync</h3>
                    <p>MediSync is a revolutionary healthcare management platform connecting patients, providers, and hospitals.</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/">Services</a></li>
                        <li><a href="/contact-us">Contact Us</a></li>
                        <li><a href="/">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Connect With Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MediSync. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;