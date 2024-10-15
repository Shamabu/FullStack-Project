import React, { useState, useEffect } from "react";
import CoursesApi from '../ApiCalls/CourseApi';
import TeachersApi from '../ApiCalls/TeachersApi';  // API for fetching teachers
import Attendance from "../AttendanceComp/Attendance";  // Ensure path is correct

// Component for managing courses of the logged-in teacher
function CoursePage({ teacher }) {
    // State for all courses of the logged-in teacher
    const [courses, setCourses] = useState([]);

    // State for all teachers to select from (for add/edit)
    const [teachers, setTeachers] = useState([]);

    // State for the current course being added or edited
    const [currentCourse, setCurrentCourse] = useState({
        id: 0,
        courseName: '',
        courseDescription: '',
        teacherId: teacher ? teacher.id : 0 // Use logged-in teacher's ID by default
    });

    // Edit / create mode
    const [editing, setEditing] = useState(false);

    // Fetch courses and teachers when component mounts
    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, [teacher]);

    // Fetch all courses that belong to the logged-in teacher
    const fetchCourses = () => {
        CoursesApi.getCourses().then(response => {
            const teacherCourses = response.data.filter(course => course.teacherId === teacher.id);
            setCourses(teacherCourses);
        });
    };

    // Fetch all teachers (used for creating/editing courses)
    const fetchTeachers = () => {
        TeachersApi.getTeachers().then(response => {
            setTeachers(response.data);
        });
    };

    // Handle input change for form fields
    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentCourse({ ...currentCourse, [name]: value });
    };

    // Add a new course
    const addCourse = () => {
        CoursesApi.createCourse(currentCourse).then(() => {
            fetchCourses();  // Refresh the list of courses
            resetForm();     // Reset the form
        });
    };

    // Update an existing course
    const updateCourse = () => {
        CoursesApi.updateCourse(currentCourse.id, currentCourse).then(() => {
            fetchCourses();  // Refresh the list of courses
            resetForm();     // Reset the form
            setEditing(false);  // Exit editing mode
        });
    };

    // Delete a course by id
    const deleteCourse = id => {
        CoursesApi.deleteCourse(id).then(() => {
            fetchCourses();  // Refresh the list of courses
        });
    };

    // Edit course by setting current course and switching to editing mode
    const editCourse = course => {
        setCurrentCourse(course);
        setEditing(true);
    };

    // Reset the form state after add/update
    const resetForm = () => {
        setCurrentCourse({
            id: 0,
            courseName: '',
            courseDescription: '',
            teacherId: teacher ? teacher.id : 0  // Reset teacherId to logged-in teacher's ID
        });
        setEditing(false);
    };

    // Function to go to the Attendance page
    const goToAttendancePage = () => {
        if (!teacher) {
            window.location.href = "/login"; // If no teacher, redirect to login page
        } else {
            // If teacher exists, navigate to the Attendance page
            window.location.href = "./AttendanceComp/Attendance";  // Ensure path is correct
        }
    };

    return (
        <div className="container">
            <h2>Courses for {teacher.firstName} {teacher.lastName}</h2>

            {/* Add/Edit Course Form */}
            <form
                onSubmit={event => {
                    event.preventDefault();
                    editing ? updateCourse() : addCourse();
                }}
            >
                <div className="form-group">
                    <label>Course Name</label>
                    <input
                        type="text"
                        name="courseName"
                        value={currentCourse.courseName}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter course name"
                    />
                </div>
                <div className="form-group">
                    <label>Course Description</label>
                    <textarea
                        name="courseDescription"
                        value={currentCourse.courseDescription}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter course description"
                    />
                </div>
                <div className="form-group">
                    <label>Teacher</label>
                    <select
                        name="teacherId"
                        value={currentCourse.teacherId}
                        onChange={handleInputChange}
                        className="form-control"
                        disabled // Teacher is fixed for logged-in teacher
                    >
                        <option value="0">Select Teacher</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    {editing ? 'Update Course' : 'Add Course'}
                </button>
                {editing && (
                    <button
                        type="button"
                        className="btn btn-secondary ml-2"
                        onClick={resetForm}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Display the list of courses */}
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Course Description</th>
                        <th>Teacher</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.courseName}</td>
                            <td>{course.courseDescription}</td>
                            <td>
                                {teacher.firstName} {teacher.lastName}
                            </td>
                            <td>
                                <button
                                    onClick={() => editCourse(course)}
                                    className="btn btn-warning ml-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCourse(course.id)}
                                    className="btn btn-danger ml-4"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={goToAttendancePage}
                                    className="btn btn-info ml-4"
                                >
                                    Class Attendance
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CoursePage;
