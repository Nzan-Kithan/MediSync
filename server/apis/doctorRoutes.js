import express from 'express';
import pool from '../db.js';
import generateId from '../utils/id-generator.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { hospitalId } = req.query;
    try {
        const query = `
            SELECT d.DoctorID, s.FirstName, s.LastName, d.Specialty
            FROM Doctors d
            JOIN Staff s ON d.StaffID = s.StaffID
            WHERE s.HospitalID = ?
        `;
        const [doctors] = await pool.query(query, [hospitalId]);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:doctorId/availability', async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;
    try {
        // Fetch the doctor's consultation hours
        const [doctor] = await pool.query('SELECT ConsultationHours FROM Doctors WHERE DoctorID = ?', [doctorId]);
        if (!doctor.length) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        console.log('Doctor consultation hours:', doctor[0].ConsultationHours);

        let consultationHours;
        try {
            consultationHours = JSON.parse(doctor[0].ConsultationHours);
        } catch (parseError) {
            console.error('Error parsing consultation hours:', parseError);
            return res.status(500).json({ message: 'Error parsing consultation hours' });
        }

        const dayOfWeek = new Date(date).toLocaleString('en-us', {weekday: 'long'});
        const availableHours = consultationHours[dayOfWeek] || [];

        console.log('Available hours for', dayOfWeek, ':', availableHours);

        // Fetch existing appointments for the doctor on the given date
        const [appointments] = await pool.query(
            'SELECT AppointmentStartTime FROM Appointments WHERE DoctorID = ? AND AppointmentDate = ?',
            [doctorId, date]
        );

        console.log('Existing appointments:', appointments);

        // Filter out times that are already booked
        const bookedTimes = appointments.map(app => app.AppointmentStartTime);
        const availableTimes = availableHours.filter(time => !bookedTimes.includes(time));

        console.log('Available times after filtering:', availableTimes);

        res.json(availableTimes);
    } catch (error) {
        console.error('Error fetching doctor availability:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    try {
        const query = `
            SELECT d.DoctorID, d.StaffID, d.Specialty, d.LicenseNumber, d.YearsOfExperience,
                   d.ConsultationHours, d.Education, d.Certifications,
                   s.FirstName, s.LastName, s.Email, s.PhoneNumber, s.Address, s.City, s.State, s.ZipCode
            FROM Doctors d
            JOIN Staff s ON d.StaffID = s.StaffID
            WHERE d.DoctorID = ?
        `;
        const [doctor] = await pool.query(query, [doctorId]);
        
        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        // Return DoctorID instead of name
        res.json({ DoctorID: doctor[0].DoctorID });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:doctorId/ById', async (req, res) => {
    const { doctorId } = req.params;
    try {
        const query = `
            SELECT d.DoctorID, d.StaffID, d.Specialty, d.LicenseNumber, d.YearsOfExperience,
                   d.ConsultationHours, d.Education, d.Certifications,
                   s.FirstName, s.LastName, s.Email, s.PhoneNumber, s.Address, s.City, s.State, s.ZipCode
            FROM Doctors d
            JOIN Staff s ON d.StaffID = s.StaffID
            WHERE d.DoctorID = ?
        `;
        const [doctor] = await pool.query(query, [doctorId]);
        
        console.log(doctor)

        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        // Return DoctorID instead of name
        res.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to fetch doctors by staff ID
router.get('/staff/:staffId', async (req, res) => {
    const { staffId } = req.params;

    try {
        const query = `
            SELECT d.DoctorID, s.FirstName, s.LastName, d.Specialty
            FROM Doctors d
            JOIN Staff s ON d.StaffID = s.StaffID
            WHERE d.DoctorID = (SELECT DoctorID FROM Doctors WHERE StaffID = ?);
        `;

        const [doctors] = await pool.query(query, [staffId]);

        console.log('Doctors fetched:', doctors); // Log the fetched doctors

        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found for this staff member' });
        }
        
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors by staff ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const {
            staffID,
            hospitalID,
            specialty,
            licenseNumber,
            yearsOfExperience,
            consultationHours,
            education,
            certifications
        } = req.body;

        const doctorID = await generateId('doctors');

        const query = `
            INSERT INTO Doctors (
                DoctorID,
                StaffID,
                HospitalID,
                Specialty,
                LicenseNumber,
                YearsOfExperience,
                ConsultationHours,
                Education,
                Certifications
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
            doctorID,
            staffID,
            hospitalID,
            specialty,
            licenseNumber,
            yearsOfExperience,
            consultationHours, // This is already a JSON string
            education,
            certifications
        ];

        const [result] = await pool.query(query, values);

        res.status(201).json({ message: 'Doctor registered successfully', doctorID });
    } catch (error) {
        console.error('Error registering doctor:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default router;
