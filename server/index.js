import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import hospitalRoutes from './apis/hospitalRoutes.js'
import patientRoutes from './apis/patientRoutes.js'
import staffRoutes from './apis/staffRoutes.js'
import dum from './apis/dum.js'

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
app.use('/hospitals', hospitalRoutes)
app.use('/patients', patientRoutes)
app.use('/staff', staffRoutes)
app.use('/dum', dum)

const port = process.env.NODE_PORT || 4000
const server = app.listen(port, () => {
    console.log('Server is running on port ' + port)
})