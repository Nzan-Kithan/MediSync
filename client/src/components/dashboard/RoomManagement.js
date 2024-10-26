import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { fetchRoomsByHospitalId, fetchHospitalIdByStaffId, addPatientToRoom, removePatientFromRoom } from '../../services/apis'; // Import the new API functions
import ConfirmationDialog from './ConfirmationDialog'; // Import the confirmation dialog
import './RoomManagement.css'; // Ensure you have appropriate styles

const RoomItem = ({ room, onAddPatient, onRemovePatient }) => {
    return (
        <div className="room-item">
            <div className="room-details">
                <h3>Room Number: {room.RoomNumber}</h3>
                <p><strong>Room Type:</strong> {room.RoomType}</p>
                <p><strong>Status:</strong> {room.Status}</p>
                <p><strong>Max Capacity:</strong> {room.MaxCapacity}</p>
                <p><strong>Current Capacity:</strong> {room.CurrentCapacity}</p>
            </div>
            <div className="room-actions">
                <button className="add-patient" onClick={() => onAddPatient(room.RoomID)}>
                    <FaPlus /> Add Patient
                </button>
                <button className="remove-patient" onClick={() => onRemovePatient(room.RoomID)}>
                    <FaTrash /> Remove Patient
                </button>
            </div>
        </div>
    );
};

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState('All'); // Filter state
    const [roomTypeFilter, setRoomTypeFilter] = useState('All'); // New state for room type filter
    const [message, setMessage] = useState('');
    const [staffId, setStaffId] = useState(''); // State to hold staff ID
    const [showDialog, setShowDialog] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [roomIdToModify, setRoomIdToModify] = useState('');

    useEffect(() => {
        const storedStaffId = localStorage.getItem('id'); // Assuming 'user' holds the staff ID
        if (storedStaffId) {
            setStaffId(storedStaffId); // Set the staff ID state
            loadRooms(storedStaffId); // Load rooms with the staff ID
        }
    }, []); // Empty dependency array to run only on mount

    const loadRooms = async (staffId) => {
        try {
            const hospitalId = await fetchHospitalIdByStaffId(staffId); // Fetch hospital ID using staff ID
            const roomData = await fetchRoomsByHospitalId(hospitalId); // Fetch rooms from the API
            setRooms(roomData);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setMessage('Failed to load rooms.');
        }
    };

    const handleAddPatient = (roomId) => {
        setRoomIdToModify(roomId);
        setCurrentAction('add');
        setShowDialog(true);
    };

    const handleRemovePatient = (roomId) => {
        setRoomIdToModify(roomId);
        setCurrentAction('remove');
        setShowDialog(true);
    };

    const confirmAction = async () => {
        try {
            if (currentAction === 'add') {
                const data = await addPatientToRoom(roomIdToModify);
                setMessage(data.message);
            } else if (currentAction === 'remove') {
                const data = await removePatientFromRoom(roomIdToModify);
                setMessage(data.message);
            }
            loadRooms(staffId); // Reload rooms to get updated capacity
        } catch (error) {
            console.error('Error during action:', error);
            setMessage(error.message);
        } finally {
            setShowDialog(false);
        }
    };

    const filteredRooms = rooms.filter(room => {
        const isTypeMatch = roomTypeFilter === 'All' || room.RoomType === roomTypeFilter; // Check room type
        if (filter === 'Available') return room.Status === 'Available' && isTypeMatch;
        if (filter === 'Occupied') return room.Status === 'Occupied' && isTypeMatch;
        return isTypeMatch; // Show all rooms
    });

    return (
        <div className="room-management">
            <div className="filter-buttons">
                <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
                <button onClick={() => setFilter('Available')} className={filter === 'Available' ? 'active' : ''}>Available</button>
                <button onClick={() => setFilter('Occupied')} className={filter === 'Occupied' ? 'active' : ''}>Occupied</button>
                <select className="room-type-filter" onChange={(e) => setRoomTypeFilter(e.target.value)} value={roomTypeFilter}>
                    <option value="All">All Room Types</option>
                    <option value="General Ward">General Ward</option>
                    <option value="Private Room">Private Room</option>
                    <option value="ICU">ICU</option>
                    <option value="Emergency Room">Emergency Room</option>
                    <option value="Labor and Delivery">Labor and Delivery</option>
                    <option value="Pediatric Ward">Pediatric Ward</option>
                </select>
            </div>
            <div className="room-list">
                {filteredRooms.map(room => (
                    <RoomItem 
                        key={room.RoomID} 
                        room={room} 
                        onAddPatient={handleAddPatient} 
                        onRemovePatient={handleRemovePatient} 
                    />
                ))}
            </div>
            {message && <p className="message">{message}</p>}
            {showDialog && (
                <ConfirmationDialog 
                    message={`Are you sure you want to ${currentAction === 'add' ? 'add' : 'remove'} a patient from this room?`}
                    onConfirm={confirmAction}
                    onCancel={() => setShowDialog(false)}
                />
            )}
        </div>
    );
};

export default RoomManagement;
