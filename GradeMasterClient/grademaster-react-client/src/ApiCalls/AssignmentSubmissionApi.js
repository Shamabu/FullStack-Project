import axios from 'axios';

const API_URL = "https://localhost:7185/api/AssignmentSubmission"; // Base API URL for assignment submissions

class AssignmentSubmissionApi {
  // Fetch all submissions
  getAllSubmissions() {
    return axios.get(API_URL);
  }

  // Fetch all submissions for a specific course
  getSubmissionsByCourse(courseId) {
    return axios.get(`${API_URL}/course/${courseId}`);
  }

  // Fetch a single submission by its ID
  getSubmissionById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  // Create a new assignment submission
  createSubmission(submission) {
    return axios.post(API_URL, submission);
  }

  // Update an existing assignment submission by its ID
  updateSubmission(id, submission) {
    return axios.put(`${API_URL}/${id}`, submission);
  }

  // Delete an assignment submission by ID
  deleteSubmission(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
  
  getSubmissionsByAssignmentId(assignmentId) {
    return axios.get(`${API_URL}/assignment/${assignmentId}`);
}
}

export default new AssignmentSubmissionApi();
