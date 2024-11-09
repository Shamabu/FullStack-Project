// src/Submissions/Submissions.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AssignmentSubmissionApi from '../ApiCalls/AssignmentSubmissionApi';
import './Submissions.css';

const Submissions = () => {
    const location = useLocation();
    const { assignmentId } = location.state || {};

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        if (assignmentId) {
            fetchSubmissions();
        }
    }, [assignmentId]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await AssignmentSubmissionApi.getSubmissionsByAssignmentId(assignmentId);
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error.response?.data || error.message);
            if (error.response) {
                console.log('Error response:', error.response);
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle deletion of a submission
    const handleDeleteSubmission = async (submissionId) => {
        try {
            await AssignmentSubmissionApi.deleteSubmission(submissionId);
            setSubmissions(submissions.filter(submission => submission.id !== submissionId));
            setResponseMessage('Submission deleted successfully.');
        } catch (error) {
            console.error('Error deleting submission:', error.response?.data || error.message);
            setResponseMessage('Failed to delete submission.');
        }
    };

    return (
        <div className="submissions-page">
            <h2>Submissions for Assignment {assignmentId}</h2>

            {loading ? (
                <p>Loading submissions...</p>
            ) : submissions.length > 0 ? (
                <ul className="submissions-list">
                    {submissions.map(submission => (
                        <li key={submission.id} className="submission-card">
                            <h4>Submission by Student ID: {submission.studentId}</h4>
                            <p><strong>File Path:</strong> {submission.filePath}</p>
                            <p><strong>Submission Date:</strong> {new Date(submission.submissionDate).toLocaleDateString()}</p>
                            <p><strong>Feedback:</strong> {submission.feedback || 'No feedback yet'}</p>
                            <p><strong>Grade:</strong> {submission.grade !== null ? submission.grade : 'Not graded'}</p>
                            <button
                                onClick={() => handleDeleteSubmission(submission.id)}
                                className="delete-button"
                            >
                                Delete Submission
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No submissions found for this assignment.</p>
            )}

            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
    );
};

export default Submissions;
