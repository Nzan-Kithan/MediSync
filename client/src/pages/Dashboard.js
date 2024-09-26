import React, { useState } from 'react';
import { FaCalendarAlt, FaFileInvoiceDollar, FaHistory, FaUserMd } from 'react-icons/fa';
import './Dashboard.css';

// Import your components here
import AppointmentScheduling from '../components/dashboard/AppointmentScheduling';
import BillChecking from '../components/dashboard/BillChecking';
import MedicalHistory from '../components/dashboard/MedicalHistory';
import DoctorAvailability from '../components/dashboard/DoctorAvailability';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('appointments');

    const tabs = [
        { id: 'appointments', label: 'Appointment Scheduling', icon: FaCalendarAlt, component: AppointmentScheduling },
        { id: 'bills', label: 'Bill Checking', icon: FaFileInvoiceDollar, component: BillChecking },
        { id: 'history', label: 'Medical History', icon: FaHistory, component: MedicalHistory },
        { id: 'doctors', label: 'Doctor Availability', icon: FaUserMd, component: DoctorAvailability },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || (() => null);
    const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || '';

    return (
        <div className="dashboard-page">
            <section className="dashboard-banner">
                <div className="banner-content">
                    <h1>Patient Dashboard</h1>
                    <p>Manage your healthcare information and services</p>
                </div>
            </section>
            <div className="dashboard-content">
                <div className="dashboard-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon className="tab-icon" />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="tab-content">
                    <h2 className="tab-title">{activeTabLabel}</h2>
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;