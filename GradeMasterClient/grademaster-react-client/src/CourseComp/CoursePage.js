import React, { useState, useEffect } from "react";
import CoursesApi from '../ApiCalls/CourseApi';
import { useNavigate, useLocation } from "react-router-dom";
import './CoursePage.css';

function CoursePage() {
    const location = useLocation();
    const { teacher } = location.state || {};  // Getting teacher data from location state
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState({
        id: 0,
        courseName: '',
        courseDescription: '',
        teacherId: teacher ? teacher.id : 0
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);  // Loading state for courses
    const navigate = useNavigate();

    useEffect(() => {
        if (teacher) {
            fetchCourses();
        }
    }, [teacher]);

    const fetchCourses = () => {
        setLoading(true);
        CoursesApi.getCourses().then(response => {
            const teacherCourses = response.data.filter(course => course.teacherId === teacher?.id);
            setCourses(teacherCourses);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    const handleInputChange = (event) => {
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

    const deleteCourse = (id) => {
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

    if (!teacher) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page-container">
            <div className="main-content">
                <div>
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
                                <option value={teacher.id}>
                                    {teacher.firstName} {teacher.lastName}
                                </option>
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
                        {loading ? (
                            <p>Loading courses...</p>
                        ) : courses.length === 0 ? (
                            <p>No courses found.</p>
                        ) : (
                            <div className="row">
                                {courses.map(course => (
                                    <div key={course.id} className="course-card col-md-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">{course.courseName}</h5>
                                                <p className="card-text">{course.courseDescription}</p>
                                                <p className="card-text"><strong>Instructor:</strong> {teacher.firstName} {teacher.lastName}</p>
                                                <div className="btn-group">
                                                    <button
                                                        onClick={() => deleteCourse(course.id)}
                                                        className="btn btn-danger me-2"
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
            </div>
        </div>
    );
}

export default CoursePage;
