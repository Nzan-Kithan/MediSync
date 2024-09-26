import express from 'express' // dummy api
import pool from '../db.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
    try
    {
        const { id } = req.params;
        const [result] = await pool.query('SELECT * FROM dum WHERE id = ?', [id])
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

router.post('/login', async (req, res) => {
    try 
    {
        const { userId, password } = req.body;
        // In a real application, you would validate the password here
        const [result] = await pool.query('SELECT * FROM dum WHERE id = ?', [userId])
        
        if (result.length === 0)
        {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userData = result[0];
        res.json(userData);
    }
    catch (error) 
    {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router