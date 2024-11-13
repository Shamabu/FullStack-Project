import React, { useState, useEffect } from 'react';
import ExamSubmissionApi from '../ApiCalls/ExamSubmissionApi';
import { useLocation } from 'react-router-dom';
import './ExamSubmissionsPage.css';

const ExamSubmissionsPage = () => {
    const location = useLocation();
    const { examId } = location.state || { examId: null };
    const [submissions, setSubmissions] = useState([]);
    const [editGrade, setEditGrade] = useState('');
    const [editFeedback, setEditFeedback] = useState('');
    const [editSubmissionId, setEditSubmissionId] = useState(null);

    // Fetch the submissions when the examId changes
    useEffect(() => {
        if (examId) {
            fetchSubmissions();
        }
    }, [examId]);

    // Fetch the submissions for a specific examId
    const fetchSubmissions = async () => {
        try {
            const response = await ExamSubmissionApi.getSubmissionsByExamId(examId);
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching exam submissions:', error);
        }
    };

    // Handle edit action for a specific submission
    const handleEditSubmission = (submission) => {
        setEditSubmissionId(submission.id);
        setEditGrade(submission.grade);  // Pre-fill the grade field
        setEditFeedback(submission.feedback);  // Pre-fill the feedback field
    };

    // Update the submission
    const handleUpdateSubmission = async (submissionId) => {
        console.log("Submitting ID:", submissionId);
        
        // Ensure grade is a number and handle the submittionDate in ISO format
        const updatedSubmission = {
            grade: parseInt(editGrade, 10),  // Ensure grade is a number
            feedback: editFeedback,
            examFilePath: submissions.find(submission => submission.id === submissionId).examFilePath,  // Use the existing file path
            submittionDate: new Date().toISOString(),  // Make sure the date is correctly formatted
        };
    
        console.log("Updated Submission Data: ", updatedSubmission); // Log to verify the data
    
        try {
            // Send data to the backend
            await ExamSubmissionApi.updateSubmission(submissionId, updatedSubmission);
            
            // Update state with new grade and feedback
            setSubmissions(submissions.map(submission =>
                submission.id === submissionId
                    ? { ...submission, grade: editGrade, feedback: editFeedback }
                    : submission
            ));
    
            // Close the edit form after update
            setEditSubmissionId(null);
        } catch (error) {
            console.error('Error updating exam submission:', error);
        }
    };
    
    // Delete the submission
    const handleDeleteSubmission = async (submissionId) => {
        try {
            await ExamSubmissionApi.deleteSubmission(submissionId);
            setSubmissions(submissions.filter(submission => submission.id !== submissionId)); // Remove the deleted submission from the list
        } catch (error) {
            console.error('Error deleting exam submission:', error);
        }
    };

    return (
        <div className="exam-submissions-page">
            <h1>Submissions for Exam {examId}</h1>
            {submissions.length > 0 ? (
                <ul>
                    {submissions.map((submission) => (
                        <li key={submission.id}>
                            <strong>Student ID: {submission.studentId}</strong>
                            <p>File Path: {submission.examFilePath}</p>
                            <p>Submission Date: {new Date(submission.submittionDate).toLocaleDateString()}</p>

                            {editSubmissionId === submission.id ? (
                                <div>
                                    <div className="form-group">
                                        <label>Grade</label>
                                        <input
                                            type="number"
                                            value={editGrade}
                                            onChange={(e) => setEditGrade(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Feedback</label>
                                        <textarea
                                            value={editFeedback}
                                            onChange={(e) => setEditFeedback(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button onClick={() => handleUpdateSubmission(submission.id)} className="update-button">Update</button>
                                    <button onClick={() => setEditSubmissionId(null)} className="cancel-button">Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <p><strong>Grade:</strong> {submission.grade}</p>
                                    <p><strong>Feedback:</strong> {submission.feedback}</p>
                                    <button onClick={() => handleEditSubmission(submission)} className="edit-button">
                                        Edit Grade/Feedback
                                    </button>
                                </>
                            )}

                            <button onClick={() => handleDeleteSubmission(submission.id)} className="delete-button">
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No submissions found for this exam.</p>
            )}
        </div>
    );
};

export default ExamSubmissionsPage;
