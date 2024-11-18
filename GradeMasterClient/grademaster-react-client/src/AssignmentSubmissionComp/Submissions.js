//Navigates From Assignments Comp , shows all student submissions for this Assignment 
import React, { useState, useEffect } from 'react';
import AssignmentSubmissionApi from '../ApiCalls/AssignmentSubmissionApi';
import { useLocation } from 'react-router-dom';
import './Submissions.css';

const Submissions = () => {
    const location = useLocation();
    const { assignmentId } = location.state || { assignmentId: null }; // Get the assignmentId from the state
    const [submissions, setSubmissions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSubmissionId, setEditingSubmissionId] = useState(null);
    const [editedGrade, setEditedGrade] = useState('');
    const [editedFeedback, setEditedFeedback] = useState('');
    const [currentFilePath, setCurrentFilePath] = useState(''); // Track current file path

    useEffect(() => {
        if (assignmentId) {
            fetchSubmissions();
        }
    }, [assignmentId]);

    const fetchSubmissions = async () => {
        if (!assignmentId) return;
    
        try {
            const response = await AssignmentSubmissionApi.getSubmissionsByAssignmentId(assignmentId);
            console.log("Submissions fetched:", response.data); // Debugging output
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };
    

    const handleEditSubmission = (submission) => {
        setIsEditing(true);
        setEditingSubmissionId(submission.id);
        setEditedGrade(submission.grade);
        setEditedFeedback(submission.feedback);
        setCurrentFilePath(submission.filePath); // Set the current file path
    };

    const handleUpdateSubmission = async (event) => {
        event.preventDefault();

        const updatedSubmission = {
            grade: editedGrade,
            feedback: editedFeedback,
            filePath: currentFilePath, // Include current file path
        };

        try {
            await AssignmentSubmissionApi.updateSubmission(editingSubmissionId, updatedSubmission);
            setIsEditing(false);
            setEditingSubmissionId(null);
            setEditedGrade('');
            setEditedFeedback('');
            setCurrentFilePath(''); // Reset file path after update
            fetchSubmissions();
        } catch (error) {
            console.error('Failed to update submission:', error.response ? error.response.data : error.message);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingSubmissionId(null);
        setEditedGrade('');
        setEditedFeedback('');
        setCurrentFilePath(''); // Reset file path
    };

    const handleDeleteSubmission = async (submissionId) => {
        try {
            await AssignmentSubmissionApi.deleteSubmission(submissionId);
            fetchSubmissions();
        } catch (error) {
            console.error('Failed to delete submission:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="submissions-page">
            <h2>Submissions for Assignment {assignmentId}</h2>

            {isEditing ? (
                <div className="edit-submission-form">
                    <h3>Edit Submission</h3>
                    <form onSubmit={handleUpdateSubmission}>
                        <div className="form-group">
                            <label>Grade</label>
                            <input
                                type="number"
                                value={editedGrade}
                                onChange={(e) => setEditedGrade(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Feedback</label>
                            <textarea
                                value={editedFeedback}
                                onChange={(e) => setEditedFeedback(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>File Path</label>
                            <input
                                type="text"
                                value={currentFilePath}
                                onChange={(e) => setCurrentFilePath(e.target.value)} // Handle file path change
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Update Submission</button>
                        <button type="button" onClick={handleCancelEdit} className="cancel-button">Cancel Edit</button>
                    </form>
                </div>
            ) : (
                <div className="submissions-list">
                    {submissions.length > 0 ? (
                        <ul className="submissions">
                            {submissions.map((submission) => (
                                <li key={submission.id} className="submission-card">
                                    <h4>Student ID: {submission.studentId}</h4>
                                    <p><strong>File Path:</strong> {submission.filePath}</p>
                                    <p>
                                        <strong>Submission Date:</strong> 
                                        {submission.submittionDate
                                        ? new Date(submission.submittionDate).toLocaleDateString()
                                        : 'Submission date not available'}
                                    </p>
                                    <p><strong>Grade:</strong> {submission.grade}</p>
                                    <p><strong>Feedback:</strong> {submission.feedback}</p>
                                    <button onClick={() => handleEditSubmission(submission)} className="edit-button">
                                        ✏️ Edit Grade/Feedback
                                    </button>
                                    <button onClick={() => handleDeleteSubmission(submission.id)} className="delete-button">
                                        🗑️ Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No submissions found for this assignment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Submissions;
