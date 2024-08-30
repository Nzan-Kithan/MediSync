import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/apis'; // Ensure this function is properly defined in your services
import './Login.css';

const Login = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const userData = await loginUser(userId); // Fetch user data based on userId
            console.log(toString(userData.position))
            login(userData.id, userData.position); // Pass user ID and position to login
        } catch (error) {
            setError('Login failed. Please check your User ID.');
            console.error('Login failed:', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <h2>{isAuthenticated ? 'Logout' : 'Login'}</h2>
            {!isAuthenticated ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    /><br />
                    <button onClick={handleLogin}>Login</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            ) : (
                <button onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
};

export default Login;
