import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../services/apis';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            fetchUserData(userId).then(data => setUserData(data));
        }
    }, []);

    return (
        <div className="profile">
            <h2>Profile</h2>
            {userData ? (
                <div>
                    <p>ID: {userData.id}</p>
                    <p>Name: {userData.uname}</p>
                    <p>Position: {userData.position}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
