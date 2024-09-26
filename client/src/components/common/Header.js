import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import { FaHome, FaInfoCircle, FaEnvelope, FaUser, FaSignInAlt, FaSignOutAlt, FaTachometerAlt, FaBars } from 'react-icons/fa';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo" onClick={closeMenu}>
                    MediSync
                </Link>
                <div className="menu-icon" onClick={toggleMenu}>
                    <FaBars />
                </div>
                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-item main-nav-item" onClick={closeMenu}><FaHome /> Home</Link>
                    <Link to="/about" className="nav-item main-nav-item" onClick={closeMenu}><FaInfoCircle /> About</Link>
                    <Link to="/contact-us" className="nav-item main-nav-item" onClick={closeMenu}><FaEnvelope /> Contact</Link>
                    <Link to="/dashboard" className="nav-item main-nav-item" onClick={closeMenu}><FaTachometerAlt /> Dashboard</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="nav-item main-nav-item" onClick={closeMenu}><FaUser /> Profile</Link>
                            <button onClick={() => { logout(); closeMenu(); }} className="nav-item logout-btn">
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-item login-btn" onClick={closeMenu}>
                            <FaSignInAlt /> Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;