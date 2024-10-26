import express from 'express';
import pool from '../db.js';
import generateId from '../utils/id-generator.js';

const router = express.Router();

router.post('/schedule', async (req, res) => {
    try {
        const {
            patientID,
            hospitalID,
            doctorID,
            appointmentType,
            appointmentDate,
            appointmentStartTime,
            appointmentEndTime,
            status
        } = req.body;

        const appointmentID = await generateId("appointments");

        const query = `
            INSERT INTO Appointments (
                AppointmentID,
                PatientID,
                HospitalID,
                DoctorID,
                AppointmentType,
                AppointmentDate,
                AppointmentStartTime,
                AppointmentEndTime,
                Status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
            appointmentID,
            patientID,
            hospitalID,
            doctorID,
            appointmentType,
            appointmentDate,
            appointmentStartTime,
            appointmentEndTime,
            status
        ];

        await pool.query(query, values);

        res.status(201).json({ message: 'Appointment scheduled successfully', appointmentID });
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/', async (req, res) => {
    try {
        const { userID, userPosition } = req.query;
        console.log('Received request for appointments. UserID:', userID, 'Position:', userPosition);
        
        let query;
        let queryParams = [];

        if (userPosition === 'patient') {
            query = `
                SELECT a.*, h.Name as HospitalName, h.Address as HospitalAddress, 
                       CONCAT(s.FirstName, ' ', s.LastName) as DoctorName
                FROM Appointments a
                JOIN Hospitals h ON a.HospitalID = h.HospitalID
                JOIN Doctors d ON a.DoctorID = d.DoctorID
                JOIN Staff s ON d.StaffID = s.StaffID
                WHERE a.PatientID = ?
                ORDER BY a.AppointmentDate DESC, a.AppointmentStartTime DESC
            `;
            queryParams = [userID];
        } else if (userPosition === 'doctor') {
            query = `
                SELECT a.*, h.Name as HospitalName, h.Address as HospitalAddress, 
                       CONCAT(uc.FirstName, ' ', uc.LastName) as PatientName
                FROM Appointments a
                JOIN Doctors d ON a.DoctorID = d.DoctorID
                JOIN Staff s ON d.StaffID = s.StaffID
                JOIN Hospitals h ON a.HospitalID = h.HospitalID
                JOIN UserCredentials uc ON a.PatientID = uc.UserID
                WHERE a.DoctorID = (SELECT DoctorID FROM Doctors WHERE StaffID = ?)
                ORDER BY a.AppointmentDate DESC, a.AppointmentStartTime DESC
            `;
            queryParams = [userID];
        } else if (userPosition === 'staff') {
            query = `
                SELECT a.*, h.Name as HospitalName, h.Address as HospitalAddress, 
                       CONCAT(uc.FirstName, ' ', uc.LastName) as PatientName,
                       CONCAT(s.FirstName, ' ', s.LastName) as DoctorName
                FROM Appointments a
                JOIN Hospitals h ON a.HospitalID = h.HospitalID
                JOIN UserCredentials uc ON a.PatientID = uc.UserID
                JOIN Doctors d ON a.DoctorID = d.DoctorID
                JOIN Staff s ON d.StaffID = s.StaffID
                WHERE h.HospitalID = (SELECT HospitalID FROM Staff WHERE StaffID = ?)
                ORDER BY a.AppointmentDate DESC, a.AppointmentStartTime DESC
            `;
            queryParams = [userID];
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const [appointments] = await pool.query(query, queryParams);
        console.log('Query results:', appointments);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.put('/:appointmentId/cancel', async (req, res) => {
    try {
        const { appointmentId } = req.params;
        console.log('Received request to cancel appointment:', appointmentId);
        const query = `
            UPDATE Appointments
            SET Status = 'Cancelled'
            WHERE AppointmentID = ?
        `;
        console.log('Executing query:', query);
        const [result] = await pool.query(query, [appointmentId]);
        console.log('Query result:', result);
        
        if (result.affectedRows === 0) {
            console.log('No appointment found with ID:', appointmentId);
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        console.log('Appointment cancelled successfully');
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.delete('/:appointmentId', async (req, res) => {
    try {
        const { appointmentId } = req.params;
        console.log('Received request to delete appointment:', appointmentId);
        const query = `
            DELETE FROM Appointments
            WHERE AppointmentID = ?
        `;
        console.log('Executing query:', query);
        const [result] = await pool.query(query, [appointmentId]);
        console.log('Query result:', result);
        
        if (result.affectedRows === 0) {
            console.log('No appointment found with ID:', appointmentId);
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        console.log('Appointment deleted successfully');
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;