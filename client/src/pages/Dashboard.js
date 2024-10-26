import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFileInvoiceDollar, FaHistory, FaUserMd, FaHospital, FaUserNurse, FaClipboardList,  FaHome } from 'react-icons/fa';
import './Dashboard.css';

// Import your components here
import AppointmentScheduling from '../components/dashboard/AppointmentScheduling';
import BillChecking from '../components/dashboard/BillChecking';
import MedicalHistory from '../components/dashboard/MedicalHistory';
import DoctorAvailability from '../components/dashboard/DoctorAvailability';
import HospitalOverview from '../components/dashboard/HospitalOverview';
import StaffManagement from '../components/dashboard/StaffManagement';
import RoomManagement from '../components/dashboard/RoomManagement';
import AttendanceManagement from '../components/dashboard/AttendanceManagement';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('appointments');
    const [userPosition, setUserPosition] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const storedPosition = localStorage.getItem('position');
        const storedId = localStorage.getItem('id');
        if (storedPosition && storedId) {
            setUserPosition(storedPosition);
            setUserId(storedId);
            setActiveTab(getDefaultTab(storedPosition));
        }
    }, []);

    const getDefaultTab = (position) => {
        switch (position) {
            case 'patient': return 'appointments';
            case 'doctor': return 'appointments';
            case 'staff': return 'room';
            case 'hospital': return 'overview';
            default: return 'appointments';
        }
    };

    const patientTabs = [
        { id: 'appointments', label: 'My Appointments', icon: FaCalendarAlt, component: AppointmentScheduling },
        { id: 'bills', label: 'Bill Checking', icon: FaFileInvoiceDollar, component: BillChecking },
        { id: 'history', label: 'Medical History', icon: FaHistory, component: MedicalHistory },
        { id: 'doctors', label: 'Doctor Availability', icon: FaUserMd, component: DoctorAvailability },
    ];

    const doctorTabs = [
        { id: 'appointments', label: 'My Appointments', icon: FaCalendarAlt, component: AppointmentScheduling },
        { id: 'patients', label: 'My Patients', icon: FaUserNurse, component: MedicalHistory },
    ];

    const staffTabs = [
        { id: 'room', label: 'Room Management', icon: FaHome, component: RoomManagement },
        { id: 'attendance', label: 'Attendance Management', icon: FaUserMd, component: AttendanceManagement },
    ];

    const hospitalTabs = [
        { id: 'overview', label: 'Hospital Overview', icon: FaHospital, component: HospitalOverview },
        { id: 'staff', label: 'Staff Management', icon: FaUserMd, component: StaffManagement }
        //,
        //{ id: 'inventory', label: 'Inventory Management', icon: FaClipboardList, component: InventoryManagement },
    ];

    const getTabs = () => {
        switch (userPosition) {
            case 'patient': return patientTabs;
            case 'doctor': return doctorTabs;
            case 'staff': return staffTabs;
            case 'hospital': return hospitalTabs;
            default: return [];
        }
    };

    const tabs = getTabs();
    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || (() => null);
    const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || '';

    // Create a context object with relevant information
    const dashboardContext = {
        userPosition,
        userId,
        activeTab,
        setActiveTab
    };

    return (
        <div className="dashboard-page">
            <section className="dashboard-banner">
                <div className="banner-content">
                    <h1>{userPosition.charAt(0).toUpperCase() + userPosition.slice(1)} Dashboard</h1>
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
                    <ActiveComponent {...dashboardContext} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;