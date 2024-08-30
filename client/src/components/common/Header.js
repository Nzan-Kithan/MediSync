import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css'; 

const Header = () =>
{
    const { isAuthenticated, position } = useAuth();

    return (
        <header className="header">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contact-us">Contact Us</Link></li>
                    {isAuthenticated && (
                        <>
                            {position == 'staff' && (

                                <li><Link to="/dashboard">Dashboard</Link></li>
                            )}
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/settings">Settings</Link></li> 
                        </>
                    )}
                    <li>
                        <Link to="/login">
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;