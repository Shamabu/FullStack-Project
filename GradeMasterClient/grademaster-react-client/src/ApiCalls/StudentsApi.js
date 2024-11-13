import axios from "axios";

const API_STUDENTS_URL = "https://localhost:7185/api/student";

class StudentsApi {
  // Fetch all students
  getStudents() {
    return axios.get(API_STUDENTS_URL);
  }

  // Fetch a specific student by ID
  getStudentById(id) {
    return axios.get(`${API_STUDENTS_URL}/${id}`);
  }

  // Fetch students by course ID
  getStudentsByCourseId(courseId) {
    return axios.get(`${API_STUDENTS_URL}/course/${courseId}`);
  }

  // Create a new student
  createStudent(student) {
    return axios.post(API_STUDENTS_URL, student);
  }

  // Update an existing student by ID
  updateStudent(id, student) {
    return axios.put(`${API_STUDENTS_URL}/${id}`, student);
  }

  // Delete a student by ID
  deleteStudent(id) {
    return axios.delete(`${API_STUDENTS_URL}/${id}`);
  }
}

export default new StudentsApi();
