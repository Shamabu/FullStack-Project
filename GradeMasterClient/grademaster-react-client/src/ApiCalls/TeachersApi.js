import axios from "axios";

const API_TEACHERS_URL = "https://localhost:7185/api/teacher";
const API_LOGIN_URL = "https://localhost:7185/api/login";  // New login endpoint

class TeachersApi {
    getTeachers() {
        return axios.get(API_TEACHERS_URL);
    }

    getTeacher(id) {
        return axios.get(`${API_TEACHERS_URL}/${id}`);
    }

    createTeacher(teacher) {
        return axios.post(API_TEACHERS_URL, teacher);
    }

    updateTeacher(id, teacher) {
        return axios.put(`${API_TEACHERS_URL}/${id}`, teacher);
    }

    deleteTeacher(id) {
        return axios.delete(`${API_TEACHERS_URL}/${id}`);
    }

    // New method for login
    login(credentials) {
        return axios.post(API_LOGIN_URL, credentials);  // Sends email and password to the backend
    }
}

export default new TeachersApi();
