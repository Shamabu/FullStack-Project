import React, { useState, useEffect } from 'react';
import ExamSubmissionApi from '../ApiCalls/ExamSubmissionApi';
import ExamApi from '../ApiCalls/ExamApi';
import EnrollmentApi from '../ApiCalls/EnrollmentApi';
import CourseApi from '../ApiCalls/CourseApi';
import './ExamSubmissionAdmin.css';


const ExamSubmissionAdmin = () => {
    const [studentId, setStudentId] = useState('');
    const [filePath, setFilePath] = useState('');
    const [courseId, setCourseId] = useState('');
    const [examId, setExamId] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);

    const feedback = 'loading';
    const grade = 0;

    // Fetch courses for the student based on enrollments
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
        if (!courseId) return;  // Ensure courseId is defined
        try {
            const response = await ExamApi.getExams(courseId);  // Pass courseId as an argument
            setExams(response.data);
        } catch (error) {
            console.error("Error fetching exams for course:", error.response?.data || error.message);
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

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const filePathValue = filePath || '/path/to/file';

        const submissionData = {
            studentId: parseInt(studentId),
            examFilePath: filePath || '/default/path/to/file', // Use a default if empty
            examId: parseInt(examId),
            submissionDate,
            feedback: 'Pending',
            grade: 0
        };
        
        console.log("Submission Data:", submissionData);

        try {
            await ExamSubmissionApi.createSubmission(submissionData);
            setResponseMessage('Exam submitted successfully!');
            setStudentId('');
            setCourseId('');
            setFilePath('');
            setExamId('');
            setSubmissionDate('');
            setCourses([]);
            setExams([]);
        } catch (error) {
            setResponseMessage('Failed to submit the exam.');
            console.error('Submission error:', error.response?.data.errors || error.message);
        }
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

export default ExamSubmissionAdmin;
