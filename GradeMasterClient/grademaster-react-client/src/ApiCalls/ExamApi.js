import axios from 'axios';

const API_URL = "https://localhost:7185/api/Exam";

class ExamApi {
    // Fetch all exams for a specific teacher's courses
    getExamsByTeacher(teacherId) {
        return axios.get(`${API_URL}/teacher/${teacherId}`);
    }

    // Fetch a single exam by ID
    getExamById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Create a new exam
    createExam(exam) {
        return axios.post(API_URL, exam);
    }

    // Update an exam by ID
    updateExam(id, exam) {
        return axios.put(`${API_URL}/${id}`, exam);
    }

    // Delete an exam by ID
    deleteExam(id) {
        return axios.delete(`${API_URL}/${id}`);
    }

    getExams(courseId) {
        return axios.get(`${API_URL}/course/${courseId}`);
    }
    
}

export default new ExamApi();
