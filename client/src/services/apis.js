import axios from 'axios';
// dummy api
export const loginUser = async (id) => {
    try {
        const response = await axios.get(`http://localhost:4000/dum/${id}`);
        return response.data[0]; // This will contain the user data
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchUserData = async (id) => {
    try {
        const response = await axios.get(`http://localhost:4000/dum/${id}`);
        return response.data[0]; // This will contain the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

// end of dummy api