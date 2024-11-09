import axios from "axios";

const API_COURSES_URL = "https://localhost:7185/api/course";  // Update with correct URL

// API Methods
class CoursesApi {
    getCourses() {
        return axios.get(API_COURSES_URL);
    }

    getCourse(id) {
        return axios.get(`${API_COURSES_URL}/${id}`);
    }

    createCourse(course) {
        return axios.post(API_COURSES_URL, course);
    }

    updateCourse(id, course) {
        return axios.put(`${API_COURSES_URL}/${id}`, course);
    }

    deleteCourse(id) {
        return axios.delete(`${API_COURSES_URL}/${id}`);
    }

    getCoursesByTeacher(teacherId) {
        return axios.get(`${API_COURSES_URL}/teacher/${teacherId}`);
    }
   
}

export default new CoursesApi();
