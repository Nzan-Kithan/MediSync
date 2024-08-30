import pool from '../db.js'

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
}

const tableDateFormats = {
    hospitals: "YYYY",
    staff: "YYYYMM",
    doctors: "YYYYMM",
    staffattendance: "YYYYMMDD",
    patients: "YYYYMMDD",
    usercredentials: "YYYYMMDD",
    tests: "YYYYMM",
    imagingtests: "YYYYMM",
    laboratorytests: "YYYYMM",
    items: "YYYY",
    suppliers: "YYYY",
    centralsupplyroomstorage: "YYYYMM",
    departmentalstorage: "YYYYMM",
    pharmacystorage: "YYYYMM"
}

const fieldKeys = {
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
}

export default async function generateId(tableName)
{
    const dateFormat = tableDateFormats[tableName]
    const datePrefix = getDatePrefix(dateFormat)
    const key = tableKeys[tableName]
    const field = fieldKeys[tableName]

    if (!key || !field)
    {
        throw new Error(`Table '${tableName}' not found in tableKeys or fieldKeys.`);
    }

    const latestId = await fetchLatestIdFromDatabase(field, tableName, key, datePrefix, dateFormat);
    const newId = incrementId(latestId);

    const id = (tableName === 'hospitals') ? `${key}${newId}` : `${datePrefix}${key}${newId}`

    return id
}

function getDatePrefix(dateFormat) 
{
    const date = new Date()

    switch (dateFormat) {
        case 'YYYY':
            return date.getFullYear().toString()
        case 'YYYYMM':
            return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
        case 'YYYYMMDD':
            return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
        default:
            throw new Error(`Invalid date format: ${dateFormat}`)
    }
}

async function fetchLatestIdFromDatabase(field, tableName, key, datePrefix, dateFormat) 
{
    try 
    {
        const query = `SELECT MAX(\`${field}\`) AS latestId FROM \`${tableName}\``
        const [result] = await pool.query(query)
        const id = result[0]?.latestId || '00000'

        if (tableName === 'hospitals')
        {
            const latestID = id.substring(id.indexOf(key) + key.length)
            return latestID
        }

        const latestId = checkAndResetId(key, id, datePrefix, dateFormat)
        return latestId;
    } 
    catch (error) 
    {
        throw new Error(`Error fetching latest ID for ${tableName}: ${error.message}`)
    }
}

function incrementId(id)
{
    const num = parseInt(id)
    return (num + 1).toString().padStart(id.length, '0')
}

function checkAndResetId(key, currID, datePrefix, dateFormat)
{
    if (currID === '00000')
    {
        return currID;
    }

    if (dateFormat === 'YYYY' && !currID.startsWith(datePrefix))
    {
        return '00000';
    }
        else if (dateFormat === 'YYYYMM' && !currID.startsWith(datePrefix))
    {
    return '00000';
    }
    else if (dateFormat === 'YYYYMMDD' && !currID.startsWith(datePrefix))
    {
        return '00000';
    }

    return currID.substring(currID.indexOf(key) + key.length)
}