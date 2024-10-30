import axios from "axios";

const API_STUDENTS_URL = "https://localhost:7185/api/student";

class StudentsApi {
  // Get all students
  getStudents() {
    return axios.get(API_STUDENTS_URL);
  }

  // Get a specific student by ID
  getStudent(id) {
    return axios.get(`${API_STUDENTS_URL}/${id}`);
  }

  getStudentsByCourseId(courseId){
    return axios.get(`${API_STUDENTS_URL}/${courseId}`);
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
  getStudentsByCourse(courseId) {
    return axios.get(`https://localhost:7185/api/students/course/${courseId}`);

}
}

export default new StudentsApi();
