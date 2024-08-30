import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../db.js'
import generateId from '../utils/id-generator.js'

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
    try
    {
        const { 
            name,
            address,
            phoneNumber,
            email,
            contactPersonName,
            contactPersonPosition,
            websiteURL,
            specialties
        } = req.body;

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
                Specialties
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const hospitalID = await generateId("hospitals")

        const values = [
            hospitalID,
            name,
            address,
            phoneNumber,
            email,
            contactPersonName,
            contactPersonPosition,
            websiteURL,
            specialties
        ];
    
        const [result] = await pool.query(query, values)
        res.send('Hospital registered successfully.')
    } 
    catch (error) 
    {
        console.error('Error registering hospital: ', error)
        res.status(500).send('Internal Server Error')
    }
})

export default router