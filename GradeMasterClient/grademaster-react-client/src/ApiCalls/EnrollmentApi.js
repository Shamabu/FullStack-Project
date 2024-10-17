import axios from "axios";

const API_ENROLLMENTS_URL = "https://localhost:7185/api/Enrollment";  // Check the correct URL

class EnrollmentsApi {
  // Get all enrollments
  getEnrollments() {
    return axios.get(API_ENROLLMENTS_URL);
  }

  // Get a specific enrollment by ID
  getEnrollment(id) {
    return axios.get(`${API_ENROLLMENTS_URL}/${id}`);
  }

  // Create a new enrollment
  createEnrollment(enrollment) {
    return axios.post(API_ENROLLMENTS_URL, enrollment);
  }

  // Update an existing enrollment by ID
  updateEnrollment(id, enrollment) {
    return axios.put(`${API_ENROLLMENTS_URL}/${id}`, enrollment);
  }

  // Delete an enrollment by ID
  deleteEnrollment(id) {
    return axios.delete(`${API_ENROLLMENTS_URL}/${id}`);
  }
}

export default new EnrollmentsApi();
