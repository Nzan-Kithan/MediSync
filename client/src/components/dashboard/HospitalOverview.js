import React, { useState, useEffect } from 'react';
import { FaUserMd, FaUsers, FaBed, FaCheckCircle } from 'react-icons/fa';
import { fetchHospitalStats } from '../../services/apis';
import './HospitalOverview.css';

const HospitalOverview = ({ userPosition, userId }) => {
    const [hospitalStats, setHospitalStats] = useState({
        totalDoctors: 0,
        totalStaff: 0,
        totalRooms: 0,
        availableRooms: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await fetchHospitalStats(userId);
                setHospitalStats(stats);
            } catch (error) {
                console.error('Error fetching hospital stats:', error);
            }
        };

        fetchStats();
    }, [userId]);

    return (
        <div className="hospital-overview">
            <div className="stats-grid">
                <div className="stat-card">
                    <FaUsers className="stat-icon blue-icon" />
                    <div className="stat-content">
                        <h3>Total Staff</h3>
                        <p className="stat-number">{hospitalStats.totalStaff}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaUserMd className="stat-icon purple-icon" />
                    <div className="stat-content">
                        <h3>Doctors</h3>
                        <p className="stat-number">{hospitalStats.totalDoctors}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaBed className="stat-icon orange-icon" />
                    <div className="stat-content">
                        <h3>Total Rooms</h3>
                        <p className="stat-number">{hospitalStats.totalRooms}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaCheckCircle className="stat-icon green-icon" />
                    <div className="stat-content">
                        <h3>Available Rooms</h3>
                        <p className="stat-number">{hospitalStats.availableRooms}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalOverview;
