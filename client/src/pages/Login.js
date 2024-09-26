import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginPatient } from '../services/apis';
import { FaUser, FaLock, FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login with username:', username);
            const userData = await loginPatient(username, password);
            console.log('Login successful:', userData);
            login(userData.id, userData.position);
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleRegister = () => {
        navigate('/register-patient');
    };

    return (
        <div className="login-page">
            <section className="login-banner">
                <div className="banner-content">
                    <h1>{isAuthenticated ? 'Welcome Back' : 'Login to MediSync'}</h1>
                    <p>{isAuthenticated ? 'Manage your healthcare tasks efficiently' : 'Access your personalized healthcare dashboard'}</p>
                </div>
            </section>

            <section className="login-content">
                {!isAuthenticated ? (
                    <div className="login-form-container">
                        <h2>Sign In</h2>
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label htmlFor="username">
                                    <FaUser className="input-icon" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">
                                    <FaLock className="input-icon" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
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
                            <p>New to MediSync?</p>
                            <button onClick={handleRegister} className="register-btn">
                                <FaUserPlus className="btn-icon" /> Register
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="logout-container">
                        <h2>You're Logged In</h2>
                        <p>Thank you for using MediSync. Ready to leave?</p>
                        <button onClick={handleLogout} className="logout-btn">
                            <FaSignOutAlt className="btn-icon" /> Logout
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Login;
