import React, { useState } from 'react';
import axios from 'axios';

const SubmitAssignmentPage = () => {
    const [filePath, setFilePath] = useState('');
    const [assignmentId, setAssignmentId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [feedback, setFeedback] = useState('');
    const [grade, setGrade] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            filePath: filePath,
            assignmentId: parseInt(assignmentId),
            studentId: parseInt(studentId),
            submittionDate: submissionDate,
            feedback: feedback,
            grade: parseInt(grade)
        };

        try {
            const response = await axios.post('https://localhost:7185/api/AssignmentSubmission', data);
            setResponseMessage("Assignment submitted successfully!");
            console.log(response.data);  // This will include the assignment and student details
        } catch (error) {
            setResponseMessage("Failed to submit the assignment.");
            console.error(error.response.data);
        }
    };

    return (
        <div>
            <h1>Submit Assignment</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>File Path: </label>
                    <input type="text" value={filePath} onChange={(e) => setFilePath(e.target.value)} />
                </div>
                <div>
                    <label>Assignment ID: </label>
                    <input type="text" value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} />
                </div>
                <div>
                    <label>Student ID: </label>
                    <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                </div>
                <div>
                    <label>Feedback: </label>
                    <input type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </div>
                <div>
                    <label>Grade: </label>
                    <input type="number" value={grade} onChange={(e) => setGrade(e.target.value)} />
                </div>
                <div>
                    <label>Submission Date: </label>
                    <input type="date" value={submissionDate} onChange={(e) => setSubmissionDate(e.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </form>

            <div>
                <p>{responseMessage}</p>
            </div>
        </div>
    );
};

export default SubmitAssignmentPage;
