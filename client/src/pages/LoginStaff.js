import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStaff } from '../services/apis';
import { useAuth } from '../context/AuthContext';
import { FaUserMd, FaEnvelope, FaLock, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import './LoginStaff.css';

const LoginStaff = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting staff login with email:', email);
            const staffData = await loginStaff(email, password);
            console.log('Staff login successful:', staffData);
            login(staffData.id, staffData.position);
            navigate('/dashboard');
        } catch (error) {
            console.error('Staff login failed:', error.response?.data || error.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="login-page staff-login-page">
            <section className="login-banner">
                <div className="banner-content">
                    <h1>{isAuthenticated ? 'Welcome Back' : 'Staff Login'}</h1>
                    <p>{isAuthenticated ? 'Manage your tasks efficiently' : 'Access your staff dashboard'}</p>
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

export default LoginStaff;
