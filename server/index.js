// Main page of the server side

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './routes/router.js' // only for an example
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use('/', router) // only for an example

const port = process.env.MYSQL_PORT | 4000
const server = app.listen(port, () => {
    console.log('Server is running on port ' + port)
})