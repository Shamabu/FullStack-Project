import React, { useState, useEffect } from "react";
import CoursesApi from '../ApiCalls/CourseApi';
import TeachersApi from '../ApiCalls/TeachersApi';  
import { useNavigate } from "react-router-dom";
import './CoursePage.css'; // Ensure to include the CSS file for styles

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
    const [showCourses, setShowCourses] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, [teacher]);

    const fetchCourses = () => {
        CoursesApi.getCourses().then(response => {
            const teacherCourses = response.data.filter(course => course.teacherId === teacher?.id);
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

    const resetForm = () => {
        setCurrentCourse({
            id: 0,
            courseName: '',
            courseDescription: '',
            teacherId: teacher ? teacher.id : 0
        });
        setEditing(false);
    };

    const goToDetailsPage = (courseName, courseId) => {
        navigate("/detailscomp/details", { state: { courseName, courseId, teacherName: `${teacher?.firstName || ''} ${teacher?.lastName || ''}` } });
    };

    const toggleCourses = () => {
        setShowCourses(!showCourses);
    };

    const goToAssignmentsPage = () => {
        navigate("/assignments", { state: { teacherId: teacher?.id } });
    };

    return (
        <div className="page-container">
            <div className="sidebar">
                <h2>Teacher Dashboard</h2>
                <nav>
                    <ul className="circle-menu">
                        <li>
                            <button onClick={toggleCourses} className="circle-button">My Courses</button>
                        </li>
                        <li>
                            <button onClick={goToAssignmentsPage} className="circle-button">Assignments</button>
                        </li>
                        <li>
                            <button className="circle-button">Exams</button>
                        </li>
                        <li>
                            <button className="circle-button">Grades</button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="main-content">
                {showCourses && (
                    <div>
                        <h2>Courses for {teacher?.firstName} {teacher?.lastName}</h2>

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
                                    required
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
                                    required
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
                        <div className="course-list mt-4">
                            {courses.length === 0 ? (
                                <p>No courses found.</p>
                            ) : (
                                <div className="row">
                                    {courses.map(course => (
                                        <div key={course.id} className="course-card col-md-4">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">{course.courseName}</h5>
                                                    <p className="card-text">{course.courseDescription}</p>
                                                    <p className="card-text"><strong>Instructor:</strong> {teacher?.firstName} {teacher?.lastName}</p>
                                                    <div className="btn-group">
                                                        <button
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="btn btn-danger me-2" // Added margin-end
                                                        >
                                                            Delete
                                                        </button>
                                                        <button 
                                                            onClick={() => goToDetailsPage(course.courseName, course.id)} 
                                                            className="btn btn-info"
                                                        >
                                                            Class Info
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoursePage;
