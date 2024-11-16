import React, { useState, useEffect } from 'react';
import ExamSubmissionApi from '../ApiCalls/ExamSubmissionApi';
import ExamApi from '../ApiCalls/ExamApi';
import EnrollmentApi from '../ApiCalls/EnrollmentApi';
import CourseApi from '../ApiCalls/CourseApi';
import './AdminExamSubmissionPage.css';

const AdminExamSubmissionPage = () => {
    const [studentId, setStudentId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [examId, setExamId] = useState('');
    const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
    const [filePath, setFilePath] = useState('');
    const [feedback, setFeedback] = useState('loading');
    const [responseMessage, setResponseMessage] = useState('');
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [examDueDate, setExamDueDate] = useState(null);

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

    // Fetch exams for the selected course
    const fetchExamsForCourse = async () => {
        if (!courseId) return;

        try {
            const response = await ExamApi.getExamsByCourse(courseId);
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams for course:', error);
        }
    };

    // Fetch the due date for the selected exam
    const fetchExamDueDate = async () => {
        if (!examId) return;

        try {
            const response = await ExamApi.getExamById(examId);
            setExamDueDate(response.data.examDate); // Assuming `examDate` is the due date
        } catch (error) {
            console.error('Error fetching exam due date:', error);
        }
    };

    useEffect(() => {
        setCourses([]);
        setExams([]);
        setExamDueDate(null);
        if (studentId) fetchCoursesForStudent();
    }, [studentId]);

    useEffect(() => {
        setExams([]);
        setExamDueDate(null);
        if (courseId) fetchExamsForCourse();
    }, [courseId]);

    useEffect(() => {
        setExamDueDate(null);
        if (examId) fetchExamDueDate();
    }, [examId]);

    // Handle form submission for adding a new exam submission
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Ensure valid submission date format
        const validSubmissionDate = isValidDate(submissionDate) ? submissionDate : new Date().toISOString().split('T')[0];
        const dueDate = new Date(examDueDate); // Parse the due date
        const submission = new Date(validSubmissionDate); // Parse the submission date
    
        // Convert to UTC midnight to ensure correct day-based comparison
        const dueDateUTC = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
        const submissionUTC = Date.UTC(submission.getUTCFullYear(), submission.getUTCMonth(), submission.getUTCDate());
    
        console.log("Submission Date (UTC):", submissionUTC);
        console.log("Due Date (UTC):", dueDateUTC);
    
        // Calculate time difference in hours
        const timeDifferenceHours = (submissionUTC - dueDateUTC) / (1000 * 60 * 60);
    
        console.log("Time Difference in Hours:", timeDifferenceHours);
    
        let grade = 0; // Default grade
        let submissionFeedback = feedback || "Submission added successfully!"; // Default feedback
    
        if (timeDifferenceHours != 0) {
            // Submission is late
            if (timeDifferenceHours <= 24) {
                grade = 0; // Zero grade for late submissions
                submissionFeedback = "Submission is not within 24 hours from due date .";
                setResponseMessage("Submission is not within 24 hours from due date.");
            } else {
                grade = 0; // Zero grade for submissions beyond 24 hours
                submissionFeedback = "Submission not in time.";
                setResponseMessage("Submission not in time.");
            }
        } else {
            // Submission is on time
            setResponseMessage("Submission added successfully!");
        }
    
        const submissionData = {
            studentId: parseInt(studentId),
            examFilePath: filePath || '/default/path/to/file',
            examId: parseInt(examId),
            SubmittionDate: validSubmissionDate,
            feedback: submissionFeedback, // Use the updated feedback
            grade, // Use the updated grade
        };
    
        console.log("Submission Data:", submissionData);
    
        try {
            await ExamSubmissionApi.createSubmission(submissionData);
            // Reset form fields
            setStudentId('');
            setCourseId('');
            setExamId('');
            setFilePath('');
            setFeedback('loading');
            setSubmissionDate(new Date().toISOString().split('T')[0]);
            setCourses([]);
            setExams([]);
        } catch (error) {
            setResponseMessage('Failed to submit the exam.');
            console.error('Submission error:', error.response?.data.errors || error.message);
        }
    };
    
    
    

    const isValidDate = (date) => {
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate);
    };

    return (
        <div className="exam-submission-container">
            <h1>Submit Exam for Student</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Student ID</label>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => {
                            setStudentId(e.target.value);
                            setCourses([]);
                            setExams([]);
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

                {exams.length > 0 && (
                    <div className="form-group">
                        <label>Exam</label>
                        <select
                            value={examId}
                            onChange={(e) => setExamId(e.target.value)}
                            required
                        >
                            <option value="">Select Exam</option>
                            {exams.map(exam => (
                                <option key={exam.id} value={exam.id}>
                                    {exam.examName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {examDueDate && <p><strong>Exam Due Date:</strong> {new Date(examDueDate).toLocaleDateString()}</p>}

                {courseId && examId && (
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

                        <button type="submit" className="btn btn-primary">Submit Exam</button>
                    </>
                )}
            </form>

            {loading && <p>Loading courses and exams...</p>}
            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
    );
};

export default AdminExamSubmissionPage;
