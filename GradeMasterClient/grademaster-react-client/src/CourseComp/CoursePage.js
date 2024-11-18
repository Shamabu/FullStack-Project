// Component for managing courses by a teacher
import React, { useState, useEffect } from "react";
import CoursesApi from "../ApiCalls/CourseApi";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../DetailsComp/Navbar";
import "./CoursePage.css";

function CoursePage() {
  // Access teacher data from location state
  const location = useLocation();
  const { teacher } = location.state || {};

  // State to hold courses
  const [courses, setCourses] = useState([]);

  // State to manage the current course being edited/created
  const [currentCourse, setCurrentCourse] = useState({
    id: 0,
    courseName: "",
    courseDescription: "",
    teacherId: teacher ? teacher.id : 0,
  });

  // State for editing mode
  const [editing, setEditing] = useState(false);

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // React Router navigation hook
  const navigate = useNavigate();

  // Fetch courses when the component mounts or when the teacher changes
  useEffect(() => {
    if (teacher) {
      fetchCourses();
    }
  }, [teacher]);

  // Fetch courses for the current teacher
  const fetchCourses = () => {
    setLoading(true);
    CoursesApi.getCourses()
      .then((response) => {
        // Filter courses to include only those belonging to the current teacher
        const teacherCourses = response.data.filter(
          (course) => course.teacherId === teacher?.id
        );
        setCourses(teacherCourses);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentCourse({ ...currentCourse, [name]: value });
  };

  // Add a new course
  const addCourse = () => {
    CoursesApi.createCourse(currentCourse).then(() => {
      fetchCourses();
      resetForm();
    });
  };

  // Update an existing course
  const updateCourse = () => {
    CoursesApi.updateCourse(currentCourse.id, currentCourse).then(() => {
      fetchCourses();
      resetForm();
      setEditing(false);
    });
  };

  // Delete a course
  const deleteCourse = (id) => {
    CoursesApi.deleteCourse(id).then(() => {
      fetchCourses();
    });
  };

  // Reset the form to initial state
  const resetForm = () => {
    setCurrentCourse({
      id: 0,
      courseName: "",
      courseDescription: "",
      teacherId: teacher ? teacher.id : 0,
    });
    setEditing(false);
  };

  // Navigate to the course details page
  const goToDetailsPage = (courseName, courseId) => {
    navigate("/detailscomp/details", {
      state: {
        courseName,
        courseId,
        teacherName: `${teacher?.firstName || ""} ${teacher?.lastName || ""}`,
      },
    });
  };

  // Navigate to the course statistics page
  const goToStatisticsPage = (courseId) => {
    navigate(`/statistics/${courseId}`, {
      state: { courseId },
    });
  };

  // Render a loading message if the teacher is not loaded yet
  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <header className="course-header">
        <h1>Welcome, {teacher.firstName} {teacher.lastName}!</h1>
        <p>Manage your courses or add a new one below.</p>
      </header>

      {/* Courses Section */}
      <div className="course-list-container">
        <h2>Your Courses</h2>
        {loading ? (
          <div className="loading-message">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="empty-message">No courses found. Add a new course below.</div>
        ) : (
          <ul className="course-list">
            {courses.map((course) => (
              <li key={course.id} className="course-list-item">
                <div className="course-info">
                  <h3>{course.courseName}</h3>
                  <p>{course.courseDescription}</p>
                </div>
                <div className="list-actions">
                  {/* Button to delete a course */}
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                  {/* Button to navigate to course details */}
                  <button
                    onClick={() => goToDetailsPage(course.courseName, course.id)}
                    className="btn btn-details"
                  >
                    Details
                  </button>
                  {/* Button to navigate to course statistics */}
                  <button
                    onClick={() => goToStatisticsPage(course.id)}
                    className="btn btn-statistics"
                  >
                    View Statistics
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Update Form Section */}
      <div className="form-container">
        <h2>{editing ? "Update Course" : "Add New Course"}</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            editing ? updateCourse() : addCourse();
          }}
          className="course-form"
        >
          <div className="form-group">
            <label>Course Name:</label>
            <input
              type="text"
              name="courseName"
              value={currentCourse.courseName}
              onChange={handleInputChange}
              placeholder="Enter course name"
              required
            />
          </div>
          <div className="form-group">
            <label>Course Description:</label>
            <textarea
              name="courseDescription"
              value={currentCourse.courseDescription}
              onChange={handleInputChange}
              placeholder="Enter course description"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn ${editing ? "btn-update" : "btn-add"}`}
          >
            {editing ? "Update Course" : "Add Course"}
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
      </div>
    </div>
  );
}

export default CoursePage;
