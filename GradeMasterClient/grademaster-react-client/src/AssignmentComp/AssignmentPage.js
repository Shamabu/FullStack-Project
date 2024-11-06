// src/Assignments/AssignmentsPage.js
import React, { useEffect, useState } from 'react';
import CoursesApi from '../ApiCalls/CourseApi';
import AssignmentApi from '../ApiCalls/AssignmentApi';
import { useLocation } from 'react-router-dom';
import './AssignmentPage.css';

const AssignmentsPage = () => {
    const location = useLocation();
    const { teacherId } = location.state || { teacherId: null };

    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [assignment, setAssignment] = useState({
        title: '',
        description: '',
        dueDate: '',
        courseId: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingAssignmentId, setEditingAssignmentId] = useState(null);

    useEffect(() => {
        if (teacherId) {
            fetchCourses();
        }
    }, [teacherId]);

    const fetchCourses = () => {
        CoursesApi.getCourses().then(response => {
            const teacherCourses = response.data.filter(course => course.teacherId === teacherId);
            setCourses(teacherCourses);
        }).catch(error => {
            console.error("Error fetching courses:", error);
        });
    };

    const fetchAssignments = (courseId) => {
        AssignmentApi.getAssignmentsByTeacher(teacherId).then(response => {
            const courseAssignments = response.filter(assignment => assignment.courseId === courseId);
            setAssignments(courseAssignments);
        }).catch(error => {
            console.error("Error fetching assignments:", error);
        });
    };

    const handleCourseSelection = (event) => {
        const selectedId = parseInt(event.target.value);
        setSelectedCourseId(selectedId);
        fetchAssignments(selectedId);
        setAssignment({ ...assignment, courseId: selectedId });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAssignment({ ...assignment, [name]: value });
    };

    const handleAddOrUpdateAssignment = async (event) => {
        event.preventDefault();
        try {
            if (isEditing) {
                // Update existing assignment
                await AssignmentApi.updateAssignment(editingAssignmentId, assignment);
                setIsEditing(false);
                setEditingAssignmentId(null);
            } else {
                // Create new assignment
                await AssignmentApi.createAssignment(assignment);
            }
            fetchAssignments(selectedCourseId);
            resetForm();
        } catch (error) {
            console.error('Failed to save assignment:', error.response ? error.response.data : error.message);
        }
    };

    const handleEditAssignment = (assignmentToEdit) => {
        setAssignment(assignmentToEdit);
        setIsEditing(true);
        setEditingAssignmentId(assignmentToEdit.id);
    };

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            await AssignmentApi.deleteAssignment(assignmentId);
            fetchAssignments(selectedCourseId);
        } catch (error) {
            console.error('Failed to delete assignment:', error.response ? error.response.data : error.message);
        }

    };

    const resetForm = () => {
        setAssignment({ title: '', description: '', dueDate: '', courseId: selectedCourseId });
        setIsEditing(false);
        setEditingAssignmentId(null);
    };

    return (
        <div className="assignments-page">

            <h2>Assignments Management</h2>

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
                                    <button onClick={() => handleEditAssignment(assignment)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDeleteAssignment(assignment.id)} className="delete-button">Delete</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-assignments">No assignments found for this course.</p>
                    )}
                </div>
            )}

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
