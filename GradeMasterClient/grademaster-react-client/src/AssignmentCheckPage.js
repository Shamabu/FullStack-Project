import React, { useEffect, useState } from "react";
import AssignmentApi from './ApiCalls/AssignmentApi'; // Ensure this import is correct

function AssignmentCheckPage() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '' });
    const teacherId = 1; // Example teacher ID, replace it with actual logic to get the teacher ID

    // Function to fetch assignments
    const fetchAssignments = async () => {
        try {
            const response = await AssignmentApi.getAssignmentsByTeacher(teacherId);
            setAssignments(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Use effect to fetch assignments on mount
    useEffect(() => {
        fetchAssignments();
    }, [teacherId]); // Re-fetch if teacherId changes

    // Function to handle adding an assignment
    const handleAddAssignment = async () => {
        try {
            const response = await AssignmentApi.createAssignment(newAssignment);
            setAssignments([...assignments, response.data]); // Add the new assignment to the list
            setNewAssignment({ title: '', description: '', dueDate: '' }); // Reset the form
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to handle deleting an assignment
    const handleDeleteAssignment = async (id) => {
        try {
            await AssignmentApi.deleteAssignment(id);
            setAssignments(assignments.filter(assignment => assignment.id !== id)); // Remove deleted assignment from state
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="assignment-check-page">
            <h2>Assignments Check</h2>
            {loading && <p>Loading assignments...</p>}
            {error && <p>Error: {error}</p>}
            {assignments.length === 0 && !loading && <p>No assignments found.</p>}
            {assignments.length > 0 && (
                <ul>
                    {assignments.map((assignment) => (
                        <li key={assignment.id}>
                            <strong>{assignment.title}</strong>: {assignment.description}
                            <button onClick={() => handleDeleteAssignment(assignment.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Form to add a new assignment */}
            <h3>Add New Assignment</h3>
            <input 
                type="text" 
                placeholder="Title" 
                value={newAssignment.title} 
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} 
            />
            <input 
                type="text" 
                placeholder="Description" 
                value={newAssignment.description} 
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} 
            />
            <input 
                type="date" 
                value={newAssignment.dueDate} 
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} 
            />
            <button onClick={handleAddAssignment}>Add Assignment</button>
        </div>
    );
}

export default AssignmentCheckPage;
