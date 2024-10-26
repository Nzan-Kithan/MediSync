import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get medical history for a specific user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const query = `
            SELECT mh.HistoryID, mh.VisitDate, mh.MedicalCondition, mh.Treatment, mh.Notes,
                   CONCAT(s.FirstName, ' ', s.LastName) AS DoctorName
            FROM MedicalHistory mh
            JOIN Doctors d ON mh.DoctorID = d.DoctorID
            JOIN Staff s ON d.StaffID = s.StaffID
            WHERE mh.UserID = ?
            ORDER BY mh.VisitDate DESC;
        `;
        const [medicalHistory] = await pool.query(query, [userId]);
        res.json(medicalHistory);
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add a new medical history record
router.post('/', async (req, res) => {
    const { HistoryID, UserID, DoctorID, VisitDate, MedicalCondition, Treatment, Notes } = req.body;
    try {
        const query = `
            INSERT INTO MedicalHistory (HistoryID, UserID, DoctorID, VisitDate, MedicalCondition, Treatment, Notes)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [HistoryID, UserID, DoctorID, VisitDate, MedicalCondition, Treatment, Notes];
        await pool.query(query, values);
        res.status(201).json({ message: 'Medical history record added successfully.' });
    } catch (error) {
        console.error('Error adding medical history record:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
