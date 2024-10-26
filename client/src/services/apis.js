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
        console.log('Fetching patient data for ID:', id);
        const response = await axios.get(`http://localhost:4000/patients/${id}`);
        console.log('Patient data response:', response.data);
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

export const registerHospital = async (hospitalData) => {
    try {
        const response = await axios.post('http://localhost:4000/hospitals/register', hospitalData);
        console.log('Hospital registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during hospital registration:', error.response?.data || error.message);
        throw error;
    }
};

export const loginHospital = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:4000/hospitals/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error during hospital login:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchHospitalData = async (hospitalId) => {
    try {
        console.log('Fetching hospital data for ID:', hospitalId);
        const response = await axios.get(`http://localhost:4000/hospitals/${hospitalId}`);
        console.log('Hospital data response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching hospital data:', error.response?.data || error.message);
        throw error;
    }
};

export const scheduleAppointment = async (appointmentData) => {
    try {
        const response = await axios.post('http://localhost:4000/appointments/schedule', appointmentData);
        console.log('Appointment scheduling response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error scheduling appointment:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchAppointments = async (userID, userPosition) => {
    try {
        console.log('Sending request to fetch appointments for userID:', userID, 'position:', userPosition);
        const response = await axios.get(`http://localhost:4000/appointments`, {
            params: { userID, userPosition }
        });
        console.log('Raw response from server:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
};

export const cancelAppointment = async (appointmentId) => {
    try {
        const response = await axios.put(`http://localhost:4000/appointments/${appointmentId}/cancel`);
        console.log('Appointment cancellation response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error cancelling appointment:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchDoctorName = async (doctorId) => {
    try {
        const response = await axios.get(`http://localhost:4000/doctors/${doctorId}`);
        const { DoctorID } = response.data; // Change to fetch DoctorID
        return DoctorID; // Return DoctorID instead of name
    } catch (error) {
        console.error('Error fetching doctor ID:', error);
        return 'Unknown Doctor';
    }
};


export const fetchDoctorNameById = async (doctorId) => {
    try {
        const response = await axios.get(`http://localhost:4000/doctors/${doctorId}/ById`);
        return response.data; // Return DoctorID instead of name
    } catch (error) {
        console.error('Error fetching doctor ID:', error);
        return 'Unknown Doctor';
    }
};

export const fetchHospitals = async () => {
    try {
        const response = await axios.get('http://localhost:4000/hospitals');
        return response.data;
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
    }
};

export const fetchDoctors = async (hospitalId) => {
    try {
        const response = await axios.get(`http://localhost:4000/doctors?hospitalId=${hospitalId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
};

export const fetchAvailableTimes = async (doctorId, date) => {
    try {
        const response = await axios.get(`http://localhost:4000/doctors/${doctorId}/availability?date=${date}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available times:', error);
        throw error;
    }
};

export const registerStaff = async (staffData) => {
    try {
        const response = await axios.post('http://localhost:4000/staff/register', staffData);
        console.log('Staff registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during staff registration:', error.response?.data || error.message);
        throw error;
    }
};

export const registerDoctor = async (doctorData) => {
    try {
        const response = await axios.post('http://localhost:4000/doctors/register', doctorData);
        console.log('Doctor registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during doctor registration:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchPositions = async () => {
    try {
        const response = await axios.get('http://localhost:4000/hospitals/positions');
        return response.data.positions;
    } catch (error) {
        console.error('Error fetching positions:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchStaff = async (hospitalId) => {
    try {
        const response = await axios.get(`http://localhost:4000/staff/${hospitalId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching staff:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchHospitalStats = async (hospitalId) => {
    try {
        const response = await axios.get(`http://localhost:4000/hospitals/${hospitalId}/stats`);
        
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch hospital stats');
        }
    } catch (error) {
        console.error('Error fetching hospital stats:', error);
        throw error;
    }
};

export const loginStaff = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:4000/staff/login', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchStaffData = async (staffId) => {
    try {
        const response = await axios.get(`http://localhost:4000/staff/id/${staffId}`);
        console.log("Staff data: ", staffId)
        return response.data;
    } catch (error) {
        console.error('Error fetching staff data:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchDoctorData = async (staffId) => {
    try {
        const response = await axios.get(`http://localhost:4000/doctors/staff/${staffId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching doctor data:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchBills = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:4000/bills/${userId}`); // Adjust the URL as needed
        return response.data;
    } catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
};

// Update bill status to paid
export const updateBillStatus = async (billId) => {
    try {
        const response = await axios.put(`http://localhost:4000/bills/${billId}/pay`);
        return response.data;
    } catch (error) {
        console.error('Error updating bill status:', error);
        throw error;
    }
};

export const fetchMedicalHistory = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:4000/medical-history/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching medical history:', error);
        throw error;
    }
};

export const checkInDoctor = async (doctorId) => {
    try {
        const response = await axios.post('http://localhost:4000/doctor-attendance/checkin', { DoctorID: doctorId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to check out a doctor
export const checkOutDoctor = async (doctorId) => {
    try {
        const response = await axios.post('http://localhost:4000/doctor-attendance/checkout', { DoctorID: doctorId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to fetch attendance status for a doctor
export const fetchAttendanceStatus = async (doctorId) => {
    try {
        const response = await axios.get(`http://localhost:4000/doctor-attendance/attendance-status/${doctorId}`);
        return response.data[0];
    } catch (error) {
        throw error;
    }
};

// Function to fetch hospital ID using staff ID
export const fetchHospitalIdByStaffId = async (staffId) => {
    try {
        const response = await axios.get(`http://localhost:4000/staff/${staffId}/hospital`);
        return response.data.hospitalId; // Assuming the response contains the hospital ID
    } catch (error) {
        throw error;
    }
};

// Function to fetch doctors by hospital ID
export const fetchDoctorsByHospital = async (hospitalId) => {
    try {
        const response = await axios.get(`http://localhost:4000/staff/hospital/${hospitalId}/doctors`);
        return response.data; // Assuming the response contains an array of doctors
    } catch (error) {
        throw error;
    }
};

// Function to fetch doctors by staff ID
export const fetchDoctorsByStaffId = async (staffId) => {
    try {
        const response = await axios.get(`http://localhost:4000/doctors/staff/${staffId}`);
        return response.data; // Return the array of doctors
    } catch (error) {
        console.error('Error fetching doctors by staff ID:', error.response?.data || error.message);
        throw error; // Rethrow the error for handling in the component
    }
};

export const fetchRoomsByHospitalId = async (hospitalId) => {
    try {
        const response = await axios.get(`http://localhost:4000/rooms/hospital/${hospitalId}`);
        console.log(response.data)
        return response.data; // Assuming the response contains the room data
    } catch (error) {
        throw error;
    }
};

// Function to add a patient to a room
export const addPatientToRoom = async (roomId) => {
    const response = await fetch(`http://localhost:4000/rooms/${roomId}/add-patient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add patient.');
    }
    return await response.json();
};

// Function to remove a patient from a room
export const removePatientFromRoom = async (roomId) => {
    const response = await fetch(`http://localhost:4000/rooms/${roomId}/remove-patient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove patient.');
    }
    return await response.json();
};

export const fetchDoctorAttendance = async () => {
    try {
        const response = await axios.get(`http://localhost:4000/doctor-attendance/doctorAttendance`);
        return response.data; // Assuming the response data contains the attendance information
    } catch (error) {
        console.error('Error fetching doctor attendance:', error);
        throw error; // Rethrow the error for handling in the component
    }
};


// Other API functions can be added here
