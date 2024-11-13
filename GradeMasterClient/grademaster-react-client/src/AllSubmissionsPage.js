import React, { useEffect, useState } from 'react';
import AssignmentSubmissionApi from './ApiCalls/AssignmentSubmissionApi';

const AllSubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        fetchAllSubmissions();
    }, []);

    const fetchAllSubmissions = async () => {
        try {
            setLoading(true);
            const response = await AssignmentSubmissionApi.getAllSubmissions();
            setSubmissions(response.data);
        } catch (error) {
            setResponseMessage('Error loading submissions.');
            console.error('Unexpected error fetching submissions:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatSubmissionDate = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00") {
            return "No valid date provided";
        }
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid date format" : date.toLocaleDateString();
    };

    return (
        <div className="all-submissions-page">
            <h2>All Assignment Submissions</h2>

            {loading ? (
                <p>Loading submissions...</p>
            ) : submissions.length > 0 ? (
                <ul className="submissions-list">
                    {submissions.map(submission => (
                        <li key={submission.id} className="submission-card">
                            <h4>Assignment ID: {submission.assignmentId}</h4>
                            <p><strong>Student ID:</strong> {submission.studentId}</p>
                            <p><strong>File Path:</strong> {submission.filePath}</p>
                            <p><strong>Submission Date:</strong> {formatSubmissionDate(submission.submissionDate)}</p>
                            <p><strong>Feedback:</strong> {submission.feedback || 'No feedback yet'}</p>
                            <p><strong>Grade:</strong> {submission.grade !== null ? submission.grade : 'No grade assigned'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No submissions found.</p>
            )}

            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
    );
};

export default AllSubmissionsPage;
