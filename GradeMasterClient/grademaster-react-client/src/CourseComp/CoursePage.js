import React, { useState, useEffect } from "react";
import CoursesApi from '../ApiCalls/CourseApi';
import { useNavigate, useLocation } from "react-router-dom";
import './CoursePage.css';

function CoursePage() {
    const location = useLocation();
    const { teacher } = location.state || {};  
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState({
        id: 0,
        courseName: '',
        courseDescription: '',
        teacherId: teacher ? teacher.id : 0
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);  
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
                    <form
                        onSubmit={event => {
                            event.preventDefault();
                            editing ? updateCourse() : addCourse();
                        }}
                        className="course-form"
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
                        <button type="submit" className={`btn ${editing ? 'btn-update' : 'btn-add'}`}>
                            {editing ? 'Update Course' : 'Add Course'}
                        </button>
                        {editing && (
                            <button
                                type="button"
                                className="btn btn-cancel"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    <div className="course-list">
                        {loading ? (
                            <p>Loading courses...</p>
                        ) : courses.length === 0 ? (
                            <p>No courses found.</p>
                        ) : (
                            <div className="course-card-grid">
                                {courses.map(course => (
                                    <div key={course.id} className="course-card">
                                        <h5>{course.courseName}</h5>
                                        <p>{course.courseDescription}</p>
                                        <div className="card-buttons">
                                            <button
                                                onClick={() => deleteCourse(course.id)}
                                                className="btn btn-delete"
                                            >
                                                🗑️ Delete
                                            </button>
                                            <button
                                                onClick={() => goToDetailsPage(course.courseName, course.id)}
                                                className="btn btn-info"
                                            >
                                                📘 Details
                                            </button>
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
