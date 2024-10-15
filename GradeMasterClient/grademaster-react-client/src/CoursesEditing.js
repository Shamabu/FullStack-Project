import React, { useState, useEffect } from "react";
import CoursesApi from './ApiCalls/CourseApi';
import TeachersApi from './ApiCalls/TeachersApi';  // API for fetching teachers

// Component for CRUD operations using server calls for Courses
function CoursesEditing() {
    // State for all courses
    const [courses, setCourses] = useState([]);

    // State for all teachers to select from
    const [teachers, setTeachers] = useState([]);

    // State for current course
    const [currentCourse, setCurrentCourse] = useState({
        id: 0,
        courseName: '',
        courseDescription: '',
        teacherId: 0
    });

    // Edit / create
    const [editing, setEditing] = useState(false);

    // Fetch courses and teachers when component mounts
    useEffect(() => {
        refreshCourses();
        fetchTeachers();
    }, []);

    // Fetch all courses from the API and update state
    const refreshCourses = () => {
        CoursesApi.getCourses().then(response => {
            setCourses(response.data);
        });
    };

    // Fetch all teachers from the API and update state
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
            refreshCourses();
            setCurrentCourse({
                id: 0,
                courseName: '',
                courseDescription: '',
                teacherId: ''
            });
        });
    };

    // Update an existing course
    const updateCourse = () => {
        CoursesApi.updateCourse(currentCourse.id, currentCourse).then(() => {
            refreshCourses();
            setCurrentCourse({
                id: 0,
                courseName: '',
                courseDescription: '',
                teacherId: ''
            });
            setEditing(false);
        });
    };

    // Delete a course by id
    const deleteCourse = id => {
        CoursesApi.deleteCourse(id).then(() => {
            refreshCourses();
        });
    };

    // Edit course by setting current course and switching to editing mode
    const editCourse = course => {
        setCurrentCourse(course);
        setEditing(true);
    };

    return (
        <div className="container">
            <h2>Courses</h2>
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
                    />
                </div>
                <div className="form-group">
                    <label>Course Description</label>
                    <textarea
                        name="courseDescription"
                        value={currentCourse.courseDescription}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Teacher</label>
                    <select
                        name="teacherId"
                        value={currentCourse.teacherId}
                        onChange={handleInputChange}
                        className="form-control"
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
                    {editing ? 'Update' : 'Add'}
                </button>
            </form>
            <table className="table table-striped">
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
                                {teachers.find(teacher => teacher.id === course.teacherId)?.firstName}{" "}
                                {teachers.find(teacher => teacher.id === course.teacherId)?.lastName}
                            </td>
                            <td>
                                <button
                                    onClick={() => editCourse(course)}
                                    className="btn btn-warning"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCourse(course.id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CoursesEditing;
