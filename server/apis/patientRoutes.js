import express from 'express'
import pool from '../db.js'
import generateId from '../utils/id-generator.js'
import { hashPassword, comparePassword } from '../utils/password-handler.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try
    {
        const [result] = await pool.query('SELECT * FROM patients;')
        const formattedData = JSON.stringify(result, null, 2)
            
        res.setHeader('Content-Type', 'application/json')
        res.send(formattedData);
    }
    catch (error)
    {
        console.error('Error loading patients: ', error)
        res.status(500).send('Internal Server Error.')
    }
})

router.post('/register', async (req, res) => {
    try
    {
        const {
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
            emergencyContactPhone,
            hospitalID
        } = req.body;

        const query = `
            INSERT INTO Hospitals (
                patientID,
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const patientID = await generateId("patient")

        const values = [
            patientID,
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
    
        const [result] = await pool.query(query, values)
        res.send('Patient registered successfully.')
    }
    catch (error)
    {
        console.error('Error registering patient: ', error)
        res.status(500).send('Internal Server Error')
    }
})

export default router