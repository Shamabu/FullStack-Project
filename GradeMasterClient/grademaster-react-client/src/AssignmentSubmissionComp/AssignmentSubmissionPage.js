import React, { useState, useEffect } from 'react';
import AssignmentSubmissionApi from '../ApiCalls/AssignmentSubmissionApi';
import AssignmentApi from '../ApiCalls/AssignmentApi';
import EnrollmentApi from '../ApiCalls/EnrollmentApi';
import CourseApi from '../ApiCalls/CourseApi';
import './AdminAssignmentSubmissionPage.css';


const AdminAssignmentSubmissionPage = () => {
    const [studentId, setStudentId] = useState('');
    const [filePath, setFilePath] = useState('');
    const [courseId, setCourseId] = useState('');
    const [assignmentId, setAssignmentId] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Set default feedback and grade
    const feedback = 'loading'; // Automatically set feedback to 'loading'
    const grade = 0;            // Automatically set grade to 0

    // Fetch courses for a specific student based on enrollments
    const fetchCoursesForStudent = async () => {
        if (!studentId) return;
    
        try {
            setLoading(true);
            const enrollmentResponse = await EnrollmentApi.getEnrollments();
            const studentEnrollments = enrollmentResponse.data.filter(enrollment => enrollment.studentId === parseInt(studentId));
    
            const courseDetailsPromises = studentEnrollments.map(async (enrollment) => {
                const courseResponse = await CourseApi.getCourse(enrollment.courseId);
                return { courseId: courseResponse.data.id, courseName: courseResponse.data.courseName };
            });
    
            const coursesWithNames = await Promise.all(courseDetailsPromises);
            setCourses(coursesWithNames);
            
        } catch (error) {
            console.error('Error fetching courses for student:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch assignments for the selected course
    const fetchAssignmentsForCourse = async () => {
        if (!courseId) return;
        try {
            const allAssignments = await AssignmentApi.getAllAssignments();
            const filteredAssignments = allAssignments.filter(assignment => assignment.courseId === parseInt(courseId));
            setAssignments(filteredAssignments);
        } catch (error) {
            console.error('Error fetching assignments for course:', error);
        }
    };

    useEffect(() => {
        setCourses([]);
        setAssignments([]);
        if (studentId) fetchCoursesForStudent();
    }, [studentId]);

    useEffect(() => {
        setAssignments([]);
        if (courseId) fetchAssignmentsForCourse();
    }, [courseId]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Ensure filePath is non-empty
        const filePathValue = filePath || '/path/to/file'; // Provide a default if empty

        const submissionData = {
            studentId: parseInt(studentId),
            filePath: filePathValue,
            assignmentId: parseInt(assignmentId),
            submissionDate,
            feedback: feedback, // Automatically set to 'loading'
            grade: grade        // Automatically set to 0
        };

        console.log("Submission Data:", submissionData); // Verify the data structure

        try {
            await AssignmentSubmissionApi.createSubmission(submissionData);
            setResponseMessage('Assignment submitted successfully!');
            // Reset form fields
            setStudentId('');
            setCourseId('');
            setFilePath('');
            setAssignmentId('');
            setSubmissionDate('');
            setCourses([]);
            setAssignments([]);
        } catch (error) {
            setResponseMessage('Failed to submit the assignment.');
            console.error('Submission error:', error.response?.data.errors || error.message);
        }
    };

    return (
        <div className="assignment-submission-container">
            <h1>Submit Assignment for Student</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Student ID</label>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => {
                            setStudentId(e.target.value);
                            setCourses([]);
                            setAssignments([]);
                            setCourseId('');
                        }}
                        onBlur={fetchCoursesForStudent}
                        required
                    />
                </div>

                {courses.length > 0 && (
                    <div className="form-group">
                        <label>Course</label>
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            required
                        >
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {assignments.length > 0 && (
                    <div className="form-group">
                        <label>Assignment</label>
                        <select
                            value={assignmentId}
                            onChange={(e) => setAssignmentId(e.target.value)}
                            required
                        >
                            <option value="">Select Assignment</option>
                            {assignments.map(assignment => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {courseId && assignmentId && (
                    <>
                        <div className="form-group">
                            <label>File Path</label>
                            <input
                                type="text"
                                value={filePath}
                                onChange={(e) => setFilePath(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Submission Date</label>
                            <input
                                type="date"
                                value={submissionDate}
                                onChange={(e) => setSubmissionDate(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Submit Assignment</button>
                    </>
                )}
            </form>

            {loading && <p>Loading courses and assignments...</p>}
            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
    );
};

export default AdminAssignmentSubmissionPage;
