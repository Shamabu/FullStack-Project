import axios from "axios";

const API_ATTENDANCE_URL = "https://localhost:7185/api/attendance"; // URL to your Attendance API

class AttendanceApi {
    // Fetch all attendance records
    getAttendances() {
        return axios.get(API_ATTENDANCE_URL);
    }

    // Fetch a single attendance record by ID
    getAttendance(id) {
        return axios.get(`${API_ATTENDANCE_URL}/${id}`);
    }

    // Create a new attendance record
    createAttendance(attendance) {
        return axios.post(API_ATTENDANCE_URL, attendance);
    }

    // Update an existing attendance record
    updateAttendance(id, attendance) {
        return axios.put(`${API_ATTENDANCE_URL}/${id}`, attendance);
    }

    // Delete an attendance record by ID
    deleteAttendance(id) {
        return axios.delete(`${API_ATTENDANCE_URL}/${id}`);
    }

    // Fetch attendance records by course ID
    getAttendancesByCourse(courseId) {
        return axios.get(`${API_ATTENDANCE_URL}/course/${courseId}`);
    }

    // Fetch attendance records for a specific student in a specific course
    getAttendancesByStudentAndCourse(studentId, courseId) {
        return axios.get(`${API_ATTENDANCE_URL}/student/${studentId}/course/${courseId}`);
    }
}

export default new AttendanceApi();
