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
  
  // Delete an assignment submission by ID
  deleteSubmission(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  // Fetch submissions for a specific assignment
  getSubmissionsByAssignmentId(assignmentId) {
    return axios.get(`${API_URL}/assignment/${assignmentId}`);
  }

  updateSubmission(id, updatedSubmission) {
    return axios.put(`${API_URL}/${id}`, updatedSubmission, {
        headers: {
            'Content-Type': 'application/json',  // Ensure this header is set
        }
    });
}

}

export default new AssignmentSubmissionApi();
