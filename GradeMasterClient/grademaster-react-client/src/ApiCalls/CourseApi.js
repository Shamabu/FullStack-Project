import axios from "axios";

const API_COURSES_URL = "https://localhost:7185/api/course"; // Ensure this URL is correct

class CoursesApi {
    // Fetch all courses
    getCourses() {
        return axios.get(API_COURSES_URL);
    }

    // Fetch a single course by its ID
    getCourse(id) {
        console.log(`Fetching course with ID: ${id}`);
        return axios.get(`${API_COURSES_URL}/${id}`);
    }

    // Create a new course
    createCourse(course) {
        return axios.post(API_COURSES_URL, course, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Update an existing course
    updateCourse(id, course) {
        return axios.put(`${API_COURSES_URL}/${id}`, course, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Delete a course by its ID
    deleteCourse(id) {
        return axios.delete(`${API_COURSES_URL}/${id}`);
    }

    // Fetch courses by teacher ID
    getCoursesByTeacher(teacherId) {
        console.log(`Fetching courses for teacher ID: ${teacherId}`);
        return axios.get(`${API_COURSES_URL}/teacher/${teacherId}`);
    }
}

export default new CoursesApi();
