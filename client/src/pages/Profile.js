import React, { useEffect, useState } from 'react';
import { fetchPatientData } from '../services/apis';
import { FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaPhone, FaMapMarkerAlt, FaTint, FaRing, FaBriefcase, FaAmbulance, FaIdCard } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            fetchPatientData(userId).then(data => setUserData(data));
        }
    }, []);

    if (!userData) {
        return <div className="profile-loading">Loading...</div>;
    }

    return (
        <div className="profile-page">
            <section className="profile-banner">
                <div className="banner-content">
                    <h1>User Profile</h1>
                    <p>Manage your personal information</p>
                </div>
            </section>

            <section className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {userData.FirstName.charAt(0)}{userData.LastName.charAt(0)}
                    </div>
                    <h2>{userData.FirstName} {userData.LastName}</h2>
                    <p>{userData.Occupation}</p>
                </div>

                <div className="profile-details">
                    <div className="detail-section">
                        <h3>Account Information</h3>
                        <div className="detail-grid">
                            <DetailItem icon={FaIdCard} title="User ID" value={userData.UserID} />
                            <DetailItem icon={FaUser} title="Username" value={userData.Username} />
                            <DetailItem icon={FaEnvelope} title="Email" value={userData.Email} />
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Personal Information</h3>
                        <div className="detail-grid">
                            <DetailItem icon={FaUser} title="Full Name" value={`${userData.FirstName} ${userData.LastName}`} />
                            <DetailItem icon={FaCalendarAlt} title="Date of Birth" value={userData.DateOfBirth} />
                            <DetailItem icon={FaVenusMars} title="Gender" value={userData.Gender} />
                            <DetailItem icon={FaPhone} title="Phone Number" value={userData.PhoneNumber} />
                            <DetailItem icon={FaBriefcase} title="Occupation" value={userData.Occupation} />
                            <DetailItem icon={FaRing} title="Marital Status" value={userData.MaritalStatus} />
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Address</h3>
                        <div className="detail-grid">
                            <DetailItem icon={FaMapMarkerAlt} title="Street" value={userData.Address} />
                            <DetailItem icon={FaMapMarkerAlt} title="City" value={userData.City} />
                            <DetailItem icon={FaMapMarkerAlt} title="State" value={userData.State} />
                            <DetailItem icon={FaMapMarkerAlt} title="Zip Code" value={userData.ZipCode} />
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Medical Information</h3>
                        <div className="detail-grid">
                            <DetailItem icon={FaTint} title="Blood Group" value={userData.BloodGroup} />
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Emergency Contact</h3>
                        <div className="detail-grid">
                            <DetailItem icon={FaUser} title="Name" value={userData.EmergencyContactName} />
                            <DetailItem icon={FaPhone} title="Phone" value={userData.EmergencyContactPhone} />
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="edit-profile-btn">Edit Profile</button>
                    <button className="change-password-btn">Change Password</button>
                </div>
            </section>
        </div>
    );
};

const DetailItem = ({ icon: Icon, title, value }) => (
    <div className="detail-item">
        <Icon className="detail-icon" />
        <div className="detail-content">
            <span className="detail-title">{title}:</span>
            <span className="detail-value">{value}</span>
        </div>
    </div>
);

export default Profile;