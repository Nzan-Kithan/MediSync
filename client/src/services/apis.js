import axios from 'axios';

export const loginPatient = async (username, password) => {
    try {
        console.log('Attempting login with:', { username }); // Log the login attempt
        const response = await axios.post('http://localhost:4000/patients/login', { username, password });
        console.log('Login response:', response.data); // Log the response
        return response.data;
    } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchPatientData = async (id) => {
    try {
        const response = await axios.get(`http://localhost:4000/patients/${id}`);
        return response.data; // This will contain the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const registerPatient = async (patientData) => {
    try {
        const response = await axios.post('http://localhost:4000/patients/register', patientData);
        return response.data;
    } catch (error) {
        console.error('Error during patient registration:', error.response?.data || error.message);
        throw error;
    }
};