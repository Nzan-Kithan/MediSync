import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../db.js'
import generateId from '../utils/id-generator.js'
import bcrypt from 'bcrypt';

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/', async (req, res) => {
    try
    {
        const [result] = await pool.query('SELECT * FROM hospitals;')
        const formattedData = JSON.stringify(result, null, 2)
            
        res.setHeader('Content-Type', 'application/json')
        res.send(formattedData);
    }
    catch (error)
    {
        console.error('Error loading hospitals: ', error)
        res.status(500).send('Internal Server Error.')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const hospitalId = req.params.id;
        const [result] = await pool.query('SELECT * FROM Hospitals WHERE HospitalID = ?', [hospitalId]);
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Remove sensitive information before sending the response
        const hospitalData = result[0];
        delete hospitalData.PasswordHash;

        const formattedData = JSON.stringify(hospitalData, null, 2);
            
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedData);
    }
    catch (error) {
        console.error('Error loading hospital: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/positions', async (req, res) => {
    try
    {
        const positionFilePath = path.join(__dirname, 'positions.json')
        fs.readFile(positionFilePath, 'utf8', (err, data) => {
            if (err)
            {
                throw err
            }

            const parsedData = JSON.parse(data);
            
            const formattedData = JSON.stringify(parsedData, null, 2);

            res.setHeader('Content-Type', 'application/json')
            res.send(formattedData);
        })
    }
    catch (error)
    {
        console.error('Error reading position.json.', error)
        res.status(500).send('Internal Server Error.')
    }
})

router.post('/register', async (req, res) => {
    try {
        const { 
            name,
            address,
            phoneNumber,
            email,
            contactPersonName,
            contactPersonPosition,
            websiteURL,
            password // New field for password
        } = req.body;

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO Hospitals (
                HospitalID,
                Name,
                Address,
                PhoneNumber,
                Email,
                ContactPersonName,
                ContactPersonPosition,
                WebsiteURL,
                PasswordHash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const hospitalID = await generateId("hospitals");

        const values = [
            hospitalID,
            name,
            address,
            phoneNumber,
            email,
            contactPersonName,
            contactPersonPosition,
            websiteURL,
            passwordHash
        ];
    
        const [result] = await pool.query(query, values);
        res.status(201).json({ message: 'Hospital registered successfully.', hospitalID });
    } 
    catch (error) {
        console.error('Error registering hospital: ', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Hospital login attempt:', { email }); // Log the login attempt

        // Query the database for the hospital
        const [hospitals] = await pool.query('SELECT * FROM Hospitals WHERE Email = ?', [email]);

        if (hospitals.length === 0) {
            console.log('Hospital not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const hospital = hospitals[0];

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, hospital.PasswordHash);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If credentials are valid, send back hospital information
        const hospitalInfo = {
            id: hospital.HospitalID,
            name: hospital.Name,
            email: hospital.Email,
            position: "hospital"
        };

        console.log('Hospital login successful:', hospitalInfo);
        res.json(hospitalInfo);
    } catch (error) {
        console.error('Hospital login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to get hospital stats
router.get('/:hospitalId/stats', async (req, res) => {
    const hospitalId = req.params.hospitalId;

    try {
        // Existing queries for doctors and staff
        const doctorsQuery = 'SELECT COUNT(*) as totalDoctors FROM Staff WHERE HospitalID = ? AND Position = "Doctor"';
        const [doctorsResult] = await pool.query(doctorsQuery, [hospitalId]);

        const staffQuery = 'SELECT COUNT(*) as totalStaff FROM Staff WHERE HospitalID = ?';
        const [staffResult] = await pool.query(staffQuery, [hospitalId]);

        // New query for rooms
        const roomsQuery = 'SELECT COUNT(*) as totalRooms, SUM(CASE WHEN Status = "Available" THEN 1 ELSE 0 END) as availableRooms FROM Rooms WHERE HospitalID = ?';
        const [roomsResult] = await pool.query(roomsQuery, [hospitalId]);

        const stats = {
            totalDoctors: doctorsResult[0].totalDoctors,
            totalStaff: staffResult[0].totalStaff,
            totalRooms: roomsResult[0].totalRooms,
            availableRooms: roomsResult[0].availableRooms
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching hospital stats:', error);
        res.status(500).json({ message: 'Error fetching hospital stats' });
    }
});

export default router