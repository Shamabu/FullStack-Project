import React, { useEffect, useState } from "react";
import CoursesApi from "../ApiCalls/CourseApi"; // Import API for fetching course data
import AssignmentApi from "../ApiCalls/AssignmentApi"; // Import API for fetching assignment data
import "./CourseTap.css"; // Import CSS for styling

function CourseTap({ courseId }) {
    // State variables to manage course description, assignments, loading status, and errors
    const [courseDescription, setCourseDescription] = useState(""); // Stores the course description
    const [assignments, setAssignments] = useState([]); // Stores the list of assignments
    const [loading, setLoading] = useState(true); // Tracks whether the data is still loading
    const [error, setError] = useState(null); // Stores any error messages

    // Effect hook to fetch data when the component mounts or the `courseId` changes
    useEffect(() => {
        if (!courseId) {
            // If `courseId` is missing, set an error and stop loading
            setError("Course ID is missing.");
            setLoading(false);
            return;
        }

        const fetchCourseData = async () => {
            try {
                // Fetch course details
                const courseResponse = await CoursesApi.getCourse(courseId);
                console.log("Course Response:", courseResponse.data); // Log course response for debugging
                setCourseDescription(
                    courseResponse.data.courseDescription || // Use course description from the response
                        "No description available for this course." // Fallback message if description is missing
                );

                // Fetch assignments for the course
                const assignmentsResponse = await AssignmentApi.getAssignmentsByCourseId(courseId);
                console.log("Assignments Response:", assignmentsResponse); // Log assignments response for debugging
                if (assignmentsResponse && Array.isArray(assignmentsResponse)) {
                    setAssignments(assignmentsResponse); // Set the assignments if valid data is received
                } else {
                    console.error("Invalid assignments data received:", assignmentsResponse); // Log invalid response
                    setAssignments([]); // Fallback to an empty list
                }
            } catch (err) {
                console.error("Error fetching data:", err); // Log the error
                setError("Failed to fetch course or assignments data."); // Set error message
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchCourseData(); // Call the fetch function
    }, [courseId]); // Dependency array to re-run the effect when `courseId` changes

    // Render loading message if data is still being fetched
    if (loading) return <div className="loading-message">Loading...</div>;

    // Render error message if an error occurred
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="course-details-page">
            {/* Course Header */}
            <div className="course-header">Course Details</div>

            {/* Course Description Section */}
            <div className="course-description">
                <h3>Course Description</h3>
                <p>{courseDescription}</p>
            </div>

            {/* Assignments Section */}
            <div className="course-assignments">
                <h3>Assignments</h3>
                {assignments.length > 0 ? (
                    <ul className="assignments-list">
                        {/* Render each assignment in the list */}
                        {assignments.map((assignment) => (
                            <li key={assignment.id} className="assignment-item">
                                <h5>{assignment.title}</h5> {/* Assignment title */}
                                <p>{assignment.description}</p> {/* Assignment description */}
                                <p>
                                    <strong>Due Date:</strong>{" "}
                                    {new Date(assignment.dueDate).toLocaleDateString()} {/* Due date formatted */}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    // Message when no assignments are available
                    <div className="no-assignments-message">No assignments available for this course.</div>
                )}
            </div>
        </div>
    );
}

export default CourseTap;
