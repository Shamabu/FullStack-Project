// Navigates From Dashboard Page, Allows Teacher to View/Add/Edit/Delete Assignments
import React, { useEffect, useState } from 'react';
import CoursesApi from '../ApiCalls/CourseApi';
import AssignmentApi from '../ApiCalls/AssignmentApi';
import { useLocation, useNavigate } from 'react-router-dom';
import './AssignmentPage.css';

const AssignmentsPage = () => {
    const location = useLocation(); // React Router hook to get data passed via navigation
    const navigate = useNavigate(); // React Router hook for programmatic navigation
    const { teacherId } = location.state || { teacherId: null }; // Extract teacher ID from navigation state

    // State for managing the list of courses and assignments
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [assignments, setAssignments] = useState([]);

    // State for managing the current assignment being added/edited
    const [assignment, setAssignment] = useState({
        title: '',
        description: '',
        dueDate: '',
        courseId: 0
    });

    // State for tracking if the form is in edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editingAssignmentId, setEditingAssignmentId] = useState(null);

    // Fetch courses when the teacher ID is available
    useEffect(() => {
        if (teacherId) {
            fetchCourses();
        }
    }, [teacherId]);

    // Fetch all courses for the teacher
    const fetchCourses = () => {
        CoursesApi.getCourses()
            .then(response => {
                // Filter courses by teacher ID
                const teacherCourses = response.data.filter(course => course.teacherId === teacherId);
                setCourses(teacherCourses);
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            });
    };

    // Fetch assignments for the selected course
    const fetchAssignments = (courseId) => {
        AssignmentApi.getAssignmentsByTeacher(teacherId)
            .then(response => {
                // Filter assignments by the selected course ID
                const courseAssignments = response.filter(assignment => assignment.courseId === courseId);
                setAssignments(courseAssignments);
            })
            .catch(error => {
                console.error("Error fetching assignments:", error);
            });
    };

    // Handle course selection from the dropdown
    const handleCourseSelection = (event) => {
        const selectedId = parseInt(event.target.value); // Get the selected course ID
        setSelectedCourseId(selectedId);
        fetchAssignments(selectedId); // Fetch assignments for the selected course
        setAssignment({ ...assignment, courseId: selectedId }); // Update the course ID in the assignment state
    };

    // Handle input changes in the assignment form
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAssignment({ ...assignment, [name]: value });
    };

    // Handle form submission for adding or updating an assignment
    const handleAddOrUpdateAssignment = async (event) => {
        event.preventDefault(); // Prevent page reload on form submission
        try {
            if (isEditing) {
                // Update the assignment
                await AssignmentApi.updateAssignment(editingAssignmentId, assignment);
                setIsEditing(false); // Reset edit mode
                setEditingAssignmentId(null); // Clear editing ID
            } else {
                // Add a new assignment
                await AssignmentApi.createAssignment(assignment);
            }
            fetchAssignments(selectedCourseId); // Refresh assignments after operation
            resetForm(); // Clear the form fields
        } catch (error) {
            console.error('Failed to save assignment:', error.response ? error.response.data : error.message);
        }
    };

    // Handle editing an existing assignment
    const handleEditAssignment = (assignmentToEdit) => {
        setAssignment(assignmentToEdit); // Populate form with assignment data
        setIsEditing(true); // Enable edit mode
        setEditingAssignmentId(assignmentToEdit.id); // Set the ID of the assignment being edited
    };

    // Handle deleting an assignment
    const handleDeleteAssignment = async (assignmentId) => {
        try {
            await AssignmentApi.deleteAssignment(assignmentId);
            fetchAssignments(selectedCourseId); // Refresh assignments after deletion
        } catch (error) {
            console.error('Failed to delete assignment:', error.response ? error.response.data : error.message);
        }
    };

    // Reset the form fields and exit edit mode
    const resetForm = () => {
        setAssignment({ title: '', description: '', dueDate: '', courseId: selectedCourseId });
        setIsEditing(false);
        setEditingAssignmentId(null);
    };

    // Navigate to the submissions page for a specific assignment
    const handleViewSubmissions = (assignmentId) => {
        navigate('/assignments/submissions', { state: { assignmentId } });
    };

    return (
        <div className="assignments-page">
            <h2>Assignments Management</h2>

            {/* Dropdown to select a course */}
            <div className="course-selection">
                <label htmlFor="courseDropdown">Select a Course:</label>
                <select id="courseDropdown" onChange={handleCourseSelection} value={selectedCourseId || ""}>
                    <option value="">Select a course</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.courseName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Assignments section for the selected course */}
            {selectedCourseId && (
                <div className="assignments-section">
                    <h3>Assignments for {courses.find(course => course.id === selectedCourseId)?.courseName}</h3>
                    {assignments.length > 0 ? (
                        <ul className="assignments-list">
                            {assignments.map(assignment => (
                                <li key={assignment.id} className="assignment-card">
                                    <h4>{assignment.title}</h4>
                                    <p><strong>Description:</strong> {assignment.description}</p>
                                    <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                    <button onClick={() => handleEditAssignment(assignment)} className="edit-button">
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDeleteAssignment(assignment.id)} className="delete-button">
                                        🗑️ Delete
                                    </button>
                                    <button onClick={() => handleViewSubmissions(assignment.id)} className="view-submissions-button">
                                        👀 View Submissions
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-assignments">No assignments found for this course.</p>
                    )}
                </div>
            )}

            {/* Form to add or edit an assignment */}
            {selectedCourseId && (
                <div className="add-assignment-section">
                    <h3>{isEditing ? 'Edit Assignment' : 'Add New Assignment'}</h3>
                    <form onSubmit={handleAddOrUpdateAssignment} className="assignment-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={assignment.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={assignment.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={assignment.dueDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">{isEditing ? 'Update Assignment' : 'Add Assignment'}</button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="cancel-button">Cancel Edit</button>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;
