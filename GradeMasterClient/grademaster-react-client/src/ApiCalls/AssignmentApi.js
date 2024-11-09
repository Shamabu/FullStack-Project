import axios from 'axios';

// Base URL for the API
const API_URL = 'https://localhost:7185/api/assignment';

const AssignmentApi = {
    // Get assignments by teacher ID
    getAssignmentsByTeacher: async (teacherId) => {
        console.log(`Fetching assignments for teacher ID: ${teacherId}`); // Log the teacher ID
        try {
            const response = await axios.get(`${API_URL}/teacher/${teacherId}`);
            return response.data; // Return data directly
        } catch (error) {
            console.error('Error fetching assignments by teacher:', error.response ? error.response.data : error.message);
            throw error; // Re-throw to handle it in the component
        }
    },

    // Create a new assignment
    createAssignment: async (assignment) => {
        try {
            const response = await axios.post(API_URL, assignment, {
                headers: {
                    'Content-Type': 'application/json' // Ensure you set the correct header
                }
            });
            return response.data; // Return the created assignment
        } catch (error) {
            console.error('Error creating assignment:', error.response ? error.response.data : error.message);
            throw error; // Re-throw to handle it in the component
        }
    },

    // Update an existing assignment
    updateAssignment: async (id, assignment) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, assignment, {
                headers: {
                    'Content-Type': 'application/json' // Ensure you set the correct header
                }
            });
            return response.data; // Return updated assignment
        } catch (error) {
            console.error('Error updating assignment:', error.response ? error.response.data : error.message);
            throw error; // Re-throw to handle it in the component
        }
    },

    // Fetch all assignments (for admin use)
    getAllAssignments: async () => {
        try 
        {
            const response = await axios.get(API_URL);
            return response.data;
        } 
        catch (error) 
        {
            console.error('Error fetching all assignments:', error);  
            throw error;
            
        }
        
    },

    // Delete an assignment
    deleteAssignment: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data; // Return success message, if needed
        } catch (error) {
            console.error('Error deleting assignment:', error.response ? error.response.data : error.message);
            throw error; // Re-throw to handle it in the component
        }
    }
};

export default AssignmentApi;
