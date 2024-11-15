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
    const [feedback, setFeedback] = useState('loading'); // Set default feedback
    const [responseMessage, setResponseMessage] = useState('');
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        setCourses([]);
        setExams([]);
        if (studentId) fetchCoursesForStudent();
    }, [studentId]);

    useEffect(() => {
        setExams([]);
        if (courseId) fetchExamsForCourse();
    }, [courseId]);

    // Handle form submission for adding a new exam submission
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Set a valid date format and correct field name
        const validSubmissionDate = isValidDate(submissionDate) ? submissionDate : new Date().toISOString().split('T')[0];
    
        const submissionData = {
            studentId: parseInt(studentId),
            examFilePath: filePath || '/default/path/to/file',
            examId: parseInt(examId),
            SubmittionDate: validSubmissionDate,  // Adjusted to match backend spelling
            feedback: feedback || "loading",
        };
    
        console.log("Submission Data:", submissionData); // Log payload to verify structure
    
        try {
            await ExamSubmissionApi.createSubmission(submissionData);
            setResponseMessage('Exam submission added successfully!');
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
