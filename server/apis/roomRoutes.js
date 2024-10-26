import express from 'express';
import pool from '../db.js'; // Adjust the path to your database connection

const router = express.Router();

// Route to fetch rooms by HospitalID
router.get('/hospital/:hospitalId', async (req, res) => {
    const { hospitalId } = req.params;

    try {
        const query = `
            SELECT RoomID, RoomNumber, RoomType, Status, MaxCapacity, CurrentCapacity
            FROM Rooms
            WHERE HospitalID = ? AND IsActive = 1;
        `;
        const [rooms] = await pool.query(query, [hospitalId]);

        if (rooms.length === 0) {
            return res.status(404).json({ message: 'No rooms found for this hospital.' });
        }

        res.status(200).json(rooms); // Return rooms with a 200 status
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to add a patient to a room
router.post('/:roomId/add-patient', async (req, res) => {
    const { roomId } = req.params;

    try {
        const query = `
            UPDATE Rooms
            SET CurrentCapacity = CurrentCapacity + 1
            WHERE RoomID = ? AND CurrentCapacity < MaxCapacity;
        `;
        const [result] = await pool.query(query, [roomId]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Cannot add patient: Room is at full capacity.' });
        }

        res.status(200).json({ message: 'Patient added successfully.' });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to remove a patient from a room
router.post('/:roomId/remove-patient', async (req, res) => {
    const { roomId } = req.params;

    try {
        const query = `
            UPDATE Rooms
            SET CurrentCapacity = CurrentCapacity - 1
            WHERE RoomID = ? AND CurrentCapacity > 0;
        `;
        const [result] = await pool.query(query, [roomId]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Cannot remove patient: Room is empty.' });
        }

        res.status(200).json({ message: 'Patient removed successfully.' });
    } catch (error) {
        console.error('Error removing patient:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router; // Use export default for ES module syntax