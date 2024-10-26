import express from 'express';
import pool from '../db.js';
import generateId from '../utils/id-generator.js'; // Import the ID generator

const router = express.Router();

// Get doctor's name by ID
router.get('/doctor/:doctorId', async (req, res) => {
    const doctorId = req.params.doctorId;
    try {
        const query = `
            SELECT s.FirstName, s.LastName
            FROM Doctors d
            JOIN Staff s ON d.StaffID = s.StaffID
            WHERE d.DoctorID = ?;
        `;
        const [doctor] = await pool.query(query, [doctorId]);
        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor[0]);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Check in a doctor
router.post('/checkin', async (req, res) => {
    const { DoctorID } = req.body;
    try {
        const attendanceId = await generateId('doctorattendance'); // Generate the AttendanceID

        const query = `
            INSERT INTO DoctorAttendance (AttendanceID, DoctorID, CheckInTime)
            VALUES (?, ?, NOW());
        `;
        await pool.query(query, [attendanceId, DoctorID]); // Include AttendanceID in the query
        res.status(201).json({ message: 'Doctor checked in successfully.' });
    } catch (error) {
        console.error('Error checking in doctor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Check out a doctor
router.post('/checkout', async (req, res) => {
    const { DoctorID } = req.body;
    try {
        const query = `
            UPDATE DoctorAttendance
            SET CheckOutTime = NOW(),
            isPresent = 0
            WHERE DoctorID = ?
            AND CheckOutTime IS NULL
            ORDER BY CheckInTime DESC
            LIMIT 1;
        `;
        const [result] = await pool.query(query, [DoctorID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No active attendance record found for this doctor.' });
        }
        res.status(200).json({ message: 'Doctor checked out successfully.' });
    } catch (error) {
        console.error('Error checking out doctor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch attendance status for a doctor
router.get('/attendance-status/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    try {
        const query = `
            SELECT isPresent
            FROM DoctorAttendance
            WHERE DoctorID = ?
            ORDER BY CheckInTime DESC
            LIMIT 1;
        `;

        const [result] = await pool.query(query, [doctorId]);
        console.log(result)
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching attendance status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/doctorAttendance', async (req, res) => {
    try {
        const query = `
            SELECT d.DoctorID, CONCAT(s.FirstName, ' ', s.LastName) AS name, d.specialty, da.CheckInTime, da.CheckOutTime, d.hospitalId, h.name AS hospitalName
            FROM Doctors d
            JOIN DoctorAttendance da ON d.DoctorID = da.doctorId
            JOIN Hospitals h ON d.hospitalId = h.hospitalId
            JOIN Staff s ON d.StaffID = s.StaffID  -- Join with Staff to get the doctor's name
            WHERE da.isPresent = 1;
        `;
        const [attendanceData] = await pool.query(query);

        console.error(attendanceData)

        if (attendanceData.length === 0) {
            return res.status(404).json({ message: 'No present doctors found for today.' });
        }

        res.status(200).json(attendanceData); // Return attendance data with a 200 status
    } catch (error) {
        console.error('Error fetching doctor attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Export the router
export default router;
