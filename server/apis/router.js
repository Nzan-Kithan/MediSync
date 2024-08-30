import express from 'express'
import pool from '../db.js'
import generateId from '../utils/id-generator.js'

const router = express.Router()

router.post('/contact', (req, res) => {
  const {email, website, message} = req.body

  console.log(email + ' | ' + website + ' | ' + message)
  res.send('Message sent. Thank you')
})

router.get('/users', async (req, res) => {
  try 
  {
    const userData = await getUsers();
    const formattedData = JSON.stringify(userData, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedData);
  } 
  catch (error) 
  {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
})

router.get('/hospitals', async (req, res) => {
  try
  {
    const [result] = await pool.query("SELECT * FROM hospitals;")
    const formattedData = JSON.stringify(result, null, 2)
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedData);
  }  
  catch (error) {

    console.error('Error registering staff:', error);
    res.status(500).send('Internal Server Error');
  }
})

router.post("/register-staff", async (req, res) =>{
  try 
  {
    const { hospitalID, firstName, lastName, position, email, phoneNumber, hireDate, address, city, state, zipCode, dateOfBirth } = req.body;
    const employmentStatus = 'Active'
      
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
        DateOfBirth
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const staffID = await generateId('staff', hospitalID)

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
      dateOfBirth
    ];

    const [result] = await pool.query(query, values)
    console.log(result)

    res.send('Staff registered successfully.');
} 
catch (error) {

    console.error('Error registering staff:', error);
    res.status(500).send('Internal Server Error');
}
})


// not yet completed. 
const tableKeys = {
  hospitals: "HO",
  staff: "SF",
  doctors: "DR",
  staffattendance: "SA",
  patients: "PA",
  usercredentials: "UC",
  tests: "TE",
  imagingtests: "IM",
  laboratorytests: "LA",
  items: "IT",
  suppliers: "SU",
  centralsupplyroomstorage: "CS",
  departmentalstorage: "DS",
  pharmacystorage: "PH"
};

const idKeys = {
  hospitals: "HospitalID",
  staff: "StaffID",
  doctors: "DoctorID",
  staffattendance: "AttendanceID",
  patients: "PatientID",
  usercredentials: "UserID",
  tests: "TestID",
  imagingtests: "ImagingTestID",
  laboratorytests: "LabTestID",
  items: "ItemID",
  suppliers: "SupplierID",
  centralsupplyroomstorage: "StorageID",
  departmentalstorage: "StorageID",
  pharmacystorage: "StorageID"
};

// Example function to generate ID using date prefix and table key
async function regenerateId(tableName) 
{
  const datePrefix = getDatePrefix();
  const key = tableKeys[tableName.toLowerCase()];
  const idKey = idKeys[tableName.toLowerCase()];

  if (!key || !idKey) 
  {
      throw new Error(`Table '${tableName}' not found in tableKeys or idKeys.`);
  }

  // Example query logic to fetch and increment ID
  const latestId = await fetchLatestIdFromDatabase(idKey, tableName);
  const newId = incrementId(latestId);

  return `${datePrefix}${key}${newId}`;
}

// Function to get current date prefix (YYMMDD)
function getDatePrefix() 
{
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month in two-digit format
  const day = now.getDate().toString().padStart(2, '0'); // Day in two-digit format
  return `${year}${month}${day}`;
}

// Example function to fetch latest ID from database
async function fetchLatestIdFromDatabase(idKey, tableName) 
{
  try 
  {
      const [rows, fields] = await pool.query(`SELECT MAX(${idKey}) AS maxId FROM ${tableName}`);
      const maxId = rows[0].maxId || '0000'; // Assuming ID is VARCHAR and default to '0000' if no rows
      return maxId;
  } 
  catch (error) 
  {
      throw new Error(`Error fetching latest ID for ${tableName}: ${error.message}`);
  }
}

// Function to increment ID (assuming numeric ID)
function incrementId(id) 
{
  const num = parseInt(id);
  return (num + 1).toString().padStart(id.length, '0'); // Ensure same length padding
}

// Example usage
async function test() 
{
  try 
  {
      const id = await regenerateId('hospitals');
      console.log(`Generated ID for 'hospitals': ${id}`);
      // Get table name using idKey from idKeys
      const tableName = getKeyByValue(idKeys, id.slice(2, 4));
      console.log(`Table name: ${tableName}`);
  } 
  catch (error) 
  {
      console.error('Error generating ID:', error.message);
  }
}

// Function to get table name by ID key value
function getKeyByValue(object, value) 
{
  return Object.keys(object).find(key => object[key] === value);
}

export default router