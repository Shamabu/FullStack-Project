import axios from 'axios'

const API_TEACHERS_URL = "http://localhost:5209/api/teachers";

//--Api Methods 

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
}

export default new TeachersApi();