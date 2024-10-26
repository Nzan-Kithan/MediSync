import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get bills for a specific user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const query = `
            SELECT b.BillID, b.Amount, b.Status, b.Description, b.DueDate, h.Name AS HospitalName
            FROM Bills b
            JOIN Hospitals h ON b.HospitalID = h.HospitalID
            WHERE b.UserID = ?
            ORDER BY b.DueDate ASC;
        `;
        const [bills] = await pool.query(query, [userId]);
        res.json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Update bill status to paid
router.put('/:billId/pay', async (req, res) => {
    const billId = req.params.billId;
    try {
        const query = `
            UPDATE Bills
            SET Status = 'paid'
            WHERE BillID = ?;
        `;
        const [result] = await pool.query(query, [billId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.status(200).json({ message: 'Bill status updated to paid' });
    } catch (error) {
        console.error('Error updating bill status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;