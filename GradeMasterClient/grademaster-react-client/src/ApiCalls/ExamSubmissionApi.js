import axios from 'axios';

const API_URL = "https://localhost:7185/api/ExamSubmission";

class ExamSubmissionApi {
    
    // Fetch all submissions for a specific exam
    getSubmissionsByExamId(examId) {
        return axios.get(`${API_URL}/exam/${examId}`);
    }

    // Fetch a single submission by its ID
    getSubmissionById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Create a new exam submission
    createSubmission(submissionData) {
        return axios.post(API_URL, submissionData);
    }

    // Update an existing exam submission by its ID
    updateSubmission(submissionId, updatedSubmission) {
        return axios.put(`${API_URL}/${submissionId}`, updatedSubmission); 
    }
    // Delete an exam submission by its ID
    deleteSubmission(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
    
}

export default new ExamSubmissionApi();
