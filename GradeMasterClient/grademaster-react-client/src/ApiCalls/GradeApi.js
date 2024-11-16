import axios from 'axios';

const API_URL = "https://localhost:7185/api/Grade";  

class GradeApi {
    
    // Fetch all grades
    getAllGrades() {
        return axios.get(`${API_URL}`);
    }

    // Fetch a grade by its ID
    getGradeById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Create a new grade
    createGrade(gradeData) {
        return axios.post(API_URL, gradeData, {
            headers: { 'Content-Type': 'application/json' },
        });
    }
    

    // Update an existing grade by its ID
    updateGrade(gradeId, updatedGrade) {
        return axios.put(`${API_URL}/${gradeId}`, updatedGrade);
    }

    // Delete a grade by its ID
    deleteGrade(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new GradeApi();
