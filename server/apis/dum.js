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

export default router