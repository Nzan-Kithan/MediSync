import express from 'express'
import pool from '../db.js'
import generateId from '../utils/id-generator.js'
import bcrypt from 'bcrypt'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM staff;')
        const formattedData = JSON.stringify(result, null, 2)
        
        res.setHeader('Content-Type', 'application/json')
        res.send(formattedData);
    } catch (error) {
        console.error('Error loading staff: ', error)
        res.status(500).send('Internal Server Error.')
    }
})

router.post('/register', async (req, res) => {
    try {
        const {
            hospitalID,
            firstName,
            lastName,
            position,
            email,
            phoneNumber,
            hireDate,
            address,
            city,
            state,
            zipCode,
            dateOfBirth,
            gender,
            username,
            password
        } = req.body;

        const employmentStatus = 'Active';
        const passwordHash = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO Staff (
                StaffID,
                HospitalID,
                FirstName,
                LastName,
                Position,
                Email,
                PhoneNumber,
                HireDate,
                EmploymentStatus,
                Address,
                City,
                State,
                ZipCode,
                DateOfBirth,
                Gender,
                Username,
                PasswordHash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const staffID = await generateId('staff');

        const values = [
            staffID,
            hospitalID,
            firstName,
            lastName,
            position,
            email,
            phoneNumber,
            hireDate,
            employmentStatus,
            address,
            city,
            state,
            zipCode,
            dateOfBirth,
            gender,
            username,
            passwordHash
        ];

        const [result] = await pool.query(query, values);

        res.status(201).json({ message: 'Staff registered successfully.', staffID });
    } catch (error) {
        console.error('Error registering staff:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

router.get('/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const query = `
            SELECT StaffID, HospitalID, FirstName, LastName, Position, Email, PhoneNumber, 
            HireDate, EmploymentStatus, Address, City, State, ZipCode, DateOfBirth, Gender, Username
            FROM Staff 
            WHERE HospitalID = ?
        `;
        const [staff] = await pool.query(query, [hospitalId]);
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Staff login attempt:', { email }); // Log the login attempt

        // Query the database for the staff member
        const [staffMembers] = await pool.query('SELECT * FROM Staff WHERE Email = ?', [email]);

        if (staffMembers.length === 0) {
            console.log('Staff member not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const staff = staffMembers[0];

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, staff.PasswordHash);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the staff member is a doctor
        const [doctors] = await pool.query('SELECT * FROM Doctors WHERE StaffID = ?', [staff.StaffID]);
        const isDoctor = doctors.length > 0;

        // If credentials are valid, send back staff information
        const staffInfo = {
            id: staff.StaffID,
            firstName: staff.FirstName,
            lastName: staff.LastName,
            email: staff.Email,
            position: isDoctor ? 'doctor' : 'staff'
        };

        console.log('Staff login successful:', staffInfo);
        res.json(staffInfo);
    } catch (error) {
        console.error('Staff login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add this new route
router.get('/id/:staffId', async (req, res) => {
    try {
        const { staffId } = req.params;
        const query = `
            SELECT s.StaffID, s.HospitalID, s.FirstName, s.LastName, s.Position, s.Email, s.PhoneNumber, 
                   s.HireDate, s.EmploymentStatus, s.Address, s.City, s.State, s.ZipCode, 
                   s.DateOfBirth, s.Gender, s.Username,
                   h.Name AS HospitalName,
                   d.DoctorID, d.Specialty, d.LicenseNumber, d.YearsOfExperience,
                   d.ConsultationHours, d.Education, d.Certifications
            FROM Staff s
            LEFT JOIN Hospitals h ON s.HospitalID = h.HospitalID
            LEFT JOIN Doctors d ON s.StaffID = d.StaffID
            WHERE s.StaffID = ?
        `;
        const [staff] = await pool.query(query, [staffId]);
        
        if (staff.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        
        // Convert HireDate to a string format
        if (staff[0].HireDate) {
            staff[0].HireDate = staff[0].HireDate.toISOString().split('T')[0];
        }
        
        console.log('Fetched staff data from database:', staff[0]);
        res.json(staff[0]);
    } catch (error) {
        console.error('Error fetching staff member:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to fetch hospital ID using staff ID
router.get('/:staffId/hospital', async (req, res) => {
    const { staffId } = req.params;
    try {
        const query = `
            SELECT HospitalID FROM Staff WHERE StaffID = ?;
        `;
        const [result] = await pool.query(query, [staffId]);
        
        if (result.length > 0) {
            return res.status(200).json({ hospitalId: result[0].HospitalID });
        } else {
            return res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        console.error('Error fetching hospital ID:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to fetch doctors by hospital ID
router.get('/hospital/:hospitalId/doctors', async (req, res) => {
    const { hospitalId } = req.params;
    try {
        const query = `
            SELECT d.DoctorID, s.FirstName, s.LastName, d.Specialty
            FROM Doctors d
            JOIN Staff s ON d.StaffID = s.StaffID
            WHERE s.HospitalID = ?;
        `;
        const [doctors] = await pool.query(query, [hospitalId]);
        return res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router
