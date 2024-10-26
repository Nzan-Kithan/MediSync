import React, { useEffect, useState } from 'react';
import { fetchPatientData, fetchHospitalData, fetchStaffData, fetchDoctorData } from '../services/apis';
import { FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaPhone, FaMapMarkerAlt, FaTint, FaRing, FaBriefcase, FaAmbulance, FaIdCard, FaHospital, FaGlobe, FaUserMd, FaStethoscope, FaGraduationCap, FaCertificate, FaCity, FaFlag, FaMapPin } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [userPosition, setUserPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const position = localStorage.getItem('position');
                const userId = localStorage.getItem('id');
                console.log('User position:', position);
                console.log('User ID:', userId);

                setUserPosition(position);

                if (userId) {
                    let data;
                    if (position === 'patient') {
                        console.log('Fetching patient data...');
                        data = await fetchPatientData(userId);
                    } else if (position === 'hospital') {
                        console.log('Fetching hospital data...');
                        data = await fetchHospitalData(userId);
                    } else if (position === 'doctor' || position === 'staff') {
                        console.log('Fetching staff data...');
                        data = await fetchStaffData(userId);
                        if (position === 'doctor') {
                            console.log('Fetching doctor data...');
                            const doctorData = await fetchDoctorData(userId);
                            data = { ...data, ...doctorData };
                        }
                    }
                    console.log('Fetched data in Profile component:', data);
                    setUserData(data);
                } else {
                    throw new Error('User ID not found in localStorage');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (error) {
        return <div className="profile-error">Error: {error}</div>;
    }

    if (!userData) {
        return <div className="profile-error">No user data available</div>;
    }

    return (
        <div className="profile-page">
            <section className="profile-banner">
                <div className="banner-content">
                    <h1>{userPosition === 'hospital' ? 'Hospital Profile' : 'User Profile'}</h1>
                    <p>Manage your information</p>
                </div>
            </section>

            <section className="profile-content">
                <div className="profile-header">
                    {userPosition === 'patient' ? (
                        <>
                            <div className="profile-avatar">
                                {userData.FirstName && userData.LastName ? 
                                    `${userData.FirstName.charAt(0)}${userData.LastName.charAt(0)}` : 'N/A'}
                            </div>
                            <h2>{userData.FirstName} {userData.LastName}</h2>
                            <p>{userData.Occupation}</p>
                        </>
                    ) : userPosition === 'hospital' ? (
                        <>
                            <div className="profile-avatar">
                                {userData.Name ? userData.Name.charAt(0) : 'N/A'}
                            </div>
                            <h2>{userData.Name}</h2>
                        </>
                    ) : (
                        <>
                            <div className="profile-avatar">
                                {userData.FirstName && userData.LastName ? 
                                    `${userData.FirstName.charAt(0)}${userData.LastName.charAt(0)}` : 'N/A'}
                            </div>
                            <h2>{userData.FirstName} {userData.LastName}</h2>
                            <p>{userData.Position}</p>
                        </>
                    )}
                </div>

                <div className="profile-details">
                    {userPosition === 'patient' ? (
                        <>
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
                        </>
                    ) : userPosition === 'hospital' ? (
                        <>
                            <div className="detail-section">
                                <h3>Hospital Information</h3>
                                <div className="detail-grid">
                                    <DetailItem icon={FaIdCard} title="Hospital ID" value={userData.HospitalID} />
                                    <DetailItem icon={FaHospital} title="Hospital Name" value={userData.Name} />
                                    <DetailItem icon={FaEnvelope} title="Email" value={userData.Email} />
                                    <DetailItem icon={FaPhone} title="Phone Number" value={userData.PhoneNumber} />
                                    <DetailItem icon={FaMapMarkerAlt} title="Address" value={userData.Address} />
                                    <DetailItem icon={FaGlobe} title="Website" value={userData.WebsiteURL} />
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Contact Person</h3>
                                <div className="detail-grid">
                                    <DetailItem icon={FaUser} title="Name" value={userData.ContactPersonName} />
                                    <DetailItem icon={FaBriefcase} title="Position" value={userData.ContactPersonPosition} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="detail-section">
                                <h3>Staff Information</h3>
                                <div className="detail-grid">
                                    <DetailItem icon={FaIdCard} title="Staff ID" value={userData?.StaffID} />
                                    <DetailItem icon={FaUser} title="Full Name" value={`${userData?.FirstName} ${userData?.LastName}`} />
                                    <DetailItem icon={FaEnvelope} title="Email" value={userData?.Email} />
                                    <DetailItem icon={FaPhone} title="Phone No." value={userData?.PhoneNumber} />
                                    <DetailItem icon={FaBriefcase} title="Position" value={userData?.Position} />
                                    <DetailItem icon={FaCalendarAlt} title="Hire Date" value={userData?.HireDate} />
                                    <DetailItem icon={FaHospital} title="Hospital" value={userData?.HospitalName} />
                                    <DetailItem icon={FaMapMarkerAlt} title="Address" value={userData?.Address} />
                                    <DetailItem icon={FaCity} title="City" value={userData?.City} />
                                    <DetailItem icon={FaFlag} title="State" value={userData?.State} />
                                    <DetailItem icon={FaMapPin} title="Zip Code" value={userData?.ZipCode} />
                                </div>
                            </div>
                            {userPosition === 'doctor' && (
                                <div className="detail-section">
                                    <h3>Doctor Information</h3>
                                    <div className="detail-grid">
                                        <DetailItem icon={FaUserMd} title="Doctor ID" value={userData?.DoctorID} />
                                        <DetailItem icon={FaStethoscope} title="Specialty" value={userData?.Specialty} />
                                        <DetailItem icon={FaIdCard} title="License Number" value={userData?.LicenseNumber} />
                                        <DetailItem icon={FaBriefcase} title="Years of Experience" value={userData?.YearsOfExperience} />
                                        <DetailItem icon={FaGraduationCap} title="Education" value={userData?.Education} />
                                        <DetailItem icon={FaCertificate} title="Certifications" value={userData?.Certifications} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
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