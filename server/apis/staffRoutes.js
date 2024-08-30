import express from 'express'
import pool from '../db.js'
import generateId from '../utils/id-generator.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try
    {
        const [result] = await pool.query('SELECT * FROM staff;')
        const formattedData = JSON.stringify(result, null, 2)
            
        res.setHeader('Content-Type', 'application/json')
        res.send(formattedData);
    }
    catch (error)
    {
        console.error('Error loading staff: ', error)
        res.status(500).send('Internal Server Error.')
    }
})

router.post('/register', async (req, res) => {
    try
    {
        const {
            hospitalID,
            firstName,
            lastName,
            gender,
            position,
            email,
            phoneNumber,
            hireDate,
            address,
            city,
            state,
            zipCode,
            dateOfBirth
        } = req.body;

        const employmentStatus = 'Active'

        const query = `
            INSERT INTO Staff (
                StaffID,
                HospitalID,
                FirstName,
                LastName,
                Gender,
                Position,
                Email,
                PhoneNumber,
                HireDate,
                EmploymentStatus,
                Address,
                City,
                State,
                ZipCode,
                DateOfBirth
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const staffID = await generateId('staff')

        const values = [
          staffID,
          hospitalID, 
          firstName,
          lastName,
          gender,
          position,
          email,
          phoneNumber,
          hireDate,
          employmentStatus,
          address,
          city,
          state,
          zipCode,
          dateOfBirth
        ];
    
        const [result] = await pool.query(query, values)
    
        res.send('Staff registered successfully.')
    }
    catch (error)
    {
        console.error('Error registering staff: ', error)
        res.status(500).send('Internal Server Error')
    }
})

export default router