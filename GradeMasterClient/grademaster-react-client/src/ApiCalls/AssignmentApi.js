import axios from 'axios';

// Base URL for the API
const API_URL = 'https://localhost:7185/api/assignment';

const AssignmentApi = {
    // Add this method in AssignmentSubmissionApi.js
getSubmissionsByStudentAndCourse(studentId, courseId) {
    return axios.get(`${API_URL}/student/${studentId}/course/${courseId}`);
},

    // Get assignments by teacher ID
    getAssignmentsByTeacher: async (teacherId) => {
        console.log(`Fetching assignments for teacher ID: ${teacherId}`);
        try {
            const response = await axios.get(`${API_URL}/teacher/${teacherId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching assignments by teacher:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Create a new assignment
    createAssignment: async (assignment) => {
        try {
            const response = await axios.post(API_URL, assignment, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating assignment:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Update an existing assignment
    updateAssignment: async (id, assignment) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, assignment, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating assignment:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Fetch all assignments
    getAllAssignments: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching all assignments:', error);
            throw error;
        }
    },

    // Delete an assignment
    deleteAssignment: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting assignment:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Get a single assignment by its ID
    getAssignmentById: async (id) => {
        try {
            return await axios.get(`https://localhost:7185/api/assignment/${id}`);
        } catch (error) {
            console.error('Error fetching assignment by ID:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    
};

export default AssignmentApi;
