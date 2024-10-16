import React, { useState, useEffect } from "react";
import CoursesApi from '../ApiCalls/CourseApi';
import TeachersApi from '../ApiCalls/TeachersApi';  // API for fetching teachers
import { useNavigate } from "react-router-dom";

// Component for managing courses of the logged-in teacher
function CoursePage({ teacher }) {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [currentCourse, setCurrentCourse] = useState({
        id: 0,
        courseName: '',
        courseDescription: '',
        teacherId: teacher ? teacher.id : 0
    });
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, [teacher]);

    const fetchCourses = () => {
        CoursesApi.getCourses().then(response => {
            const teacherCourses = response.data.filter(course => course.teacherId === teacher.id);
            setCourses(teacherCourses);
        });
    };

    const fetchTeachers = () => {
        TeachersApi.getTeachers().then(response => {
            setTeachers(response.data);
        });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentCourse({ ...currentCourse, [name]: value });
    };

    const addCourse = () => {
        CoursesApi.createCourse(currentCourse).then(() => {
            fetchCourses();
            resetForm();
        });
    };

    const updateCourse = () => {
        CoursesApi.updateCourse(currentCourse.id, currentCourse).then(() => {
            fetchCourses();
            resetForm();
            setEditing(false);
        });
    };

    const deleteCourse = id => {
        CoursesApi.deleteCourse(id).then(() => {
            fetchCourses();
        });
    };

    const editCourse = course => {
        setCurrentCourse(course);
        setEditing(true);
    };

    const resetForm = () => {
        setCurrentCourse({
            id: 0,
            courseName: '',
            courseDescription: '',
            teacherId: teacher ? teacher.id : 0
        });
        setEditing(false);
    };

    const goToDetailsPage = (courseName) => {
        navigate("/detailscomp/details", { state: { courseName, teacherName: `${teacher.firstName} ${teacher.lastName}` } }); 
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
                        disabled
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
                                <button onClick={() => goToDetailsPage(course.courseName)} className="btn btn-info">
                                    Class Info
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
