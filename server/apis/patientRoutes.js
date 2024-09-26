import express from 'express'
import pool from '../db.js'
import generateId from '../utils/id-generator.js'
import { hashPassword, comparePassword } from '../utils/password-handler.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const [result] = await pool.query('SELECT * FROM UserCredentials WHERE UserID = ?', [userId]);
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const formattedData = JSON.stringify(result[0], null, 2);
            
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedData);
    }
    catch (error) {
        console.error('Error loading user: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        console.log('Received data:', JSON.stringify(req.body, null, 2)); // Log entire request body

        const {
            username, // Changed from userName to match client-side
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phoneNumber,
            address,
            city,
            state,
            zipCode,
            bloodGroup,
            maritalStatus,
            occupation,
            emergencyContactName,
            emergencyContactPhone
        } = req.body;

        const userID = await generateId("usercredentials");
        const passwordHash = await hashPassword(password);

        const query = `
            INSERT INTO UserCredentials (
                UserID,
                Username,
                PasswordHash,
                FirstName,
                LastName,
                Gender,
                DateOfBirth,
                Address,
                City,
                State,
                ZipCode,
                PhoneNumber,
                Email,
                BloodGroup,
                MaritalStatus,
                Occupation,
                EmergencyContactName,
                EmergencyContactPhone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
            userID,
            username,
            passwordHash,
            firstName,
            lastName,
            gender,
            dateOfBirth,
            address,
            city,
            state,
            zipCode,
            phoneNumber,
            email,
            bloodGroup,
            maritalStatus,
            occupation,
            emergencyContactName,
            emergencyContactPhone
        ];
    
        const [result] = await pool.query(query, values);
        res.status(201).json({ message: 'Patient registered successfully.', userID });
    }
    catch (error) {
        console.error('Error registering patient: ', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

// New login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username }); // Log the login attempt

        // Query the database for the user
        const [users] = await pool.query('SELECT * FROM UserCredentials WHERE Username = ?', [username]);

        if (users.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Compare the provided password with the stored hash
        const isPasswordValid = await comparePassword(password, user.PasswordHash);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If credentials are valid, send back user information
        const userInfo = {
            id: user.UserID,
            username: user.Username,
            email: user.Email,
            position: "patient" // Assuming you have a Position field in your UserCredentials table
        };

        console.log('Login successful:', userInfo);
        res.json(userInfo);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router