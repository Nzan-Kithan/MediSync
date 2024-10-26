import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginHospital } from '../services/apis';
import { useAuth } from '../context/AuthContext';
import { FaHospital, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import './LoginHospital.css';

const LoginHospital = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting hospital login with email:', email);
            const hospitalData = await loginHospital(email, password);
            console.log('Hospital login successful:', hospitalData);
            login(hospitalData.id, 'hospital');
            navigate('/dashboard');
        } catch (error) {
            console.error('Hospital login failed:', error.response?.data || error.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleRegister = () => {
        navigate('/register-hospital');
    };

    return (
        <div className="login-page hospital-login-page">
            <section className="login-banner">
                <div className="banner-content">
                    <h1>{isAuthenticated ? 'Welcome Back' : 'Hospital Login'}</h1>
                    <p>{isAuthenticated ? 'Manage your hospital efficiently' : 'Access your hospital dashboard'}</p>
                </div>
            </section>

            <section className="login-content">
                <div className="login-form-container">
                    {!isAuthenticated ? (
                        <>
                            <h2>Sign In</h2>
                            <form onSubmit={handleLogin} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="email"><FaEnvelope /> Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password"><FaLock /> Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="login-btn">
                                    <FaSignInAlt className="btn-icon" /> Login
                                </button>
                                {error && <p className="error-message">{error}</p>}
                            </form>
                            <div className="register-section">
                                <p>New hospital to MediSync?</p>
                                <button onClick={handleRegister} className="register-btn">
                                    <FaUserPlus className="btn-icon" /> Register Hospital
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="logout-container">
                            <h2>You're Logged In</h2>
                            <p>Thank you for using MediSync. Ready to leave?</p>
                            <button onClick={handleLogout} className="logout-btn">
                                <FaSignOutAlt className="btn-icon" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LoginHospital;
