import React, { useState, useEffect } from 'react';
import ExamApi from '../ApiCalls/ExamApi';
import CourseApi from '../ApiCalls/CourseApi';
import { useLocation, useNavigate } from 'react-router-dom';
import './ExamPage.css';

const ExamPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { teacherId } = location.state || {};

    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [newExam, setNewExam] = useState({
        examName: '',
        examDate: '',
        duration: 0,
        roomNumber: '',
        courseId: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchCourses = async () => {
        try {
            console.log(`Fetching courses for teacher ID: ${teacherId}`);
            const response = await CourseApi.getCoursesByTeacher(teacherId);
            if (response.data) {
                console.log("Courses fetched successfully:", response.data);
                setCourses(response.data);
            }
        } catch (error) {
            console.error("Error fetching courses:", error.response?.data || error.message);
        }
    };

    const fetchExams = async () => {
        try {
            console.log(`Fetching exams for teacher ID: ${teacherId}`);
            const response = await ExamApi.getExamsByTeacher(teacherId);
            setExams(response.data);
        } catch (error) {
            console.error("Error fetching exams:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (teacherId) {
            fetchCourses();
            fetchExams();
        } else {
            console.error("No teacher ID found; redirecting to dashboard.");
            navigate('/dashboard'); 
        }
    }, [teacherId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewExam((prevExam) => ({
            ...prevExam,
            [name]: value,
        }));
    };

    const handleAddExam = async (event) => {
        event.preventDefault();
        if (!newExam.courseId) {
            alert("Please select a course for the exam.");
            return;
        }
        try {
            setIsLoading(true);
            await ExamApi.createExam(newExam);
            setNewExam({ examName: '', examDate: '', duration: 0, roomNumber: '', courseId: '' });
            fetchExams(); 
        } catch (error) {
            console.error("Error adding exam:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExam = async (examId) => {
        try {
            await ExamApi.deleteExam(examId);
            fetchExams(); 
        } catch (error) {
            console.error("Error deleting exam:", error.response?.data || error.message);
        }
    };

    const handleViewSubmissions = (examId) => {
        navigate('/exam-submissions', { state: { examId } });
    };

    return (
        <div className="exam-page">
            <h1>Manage Exams</h1>
            <form onSubmit={handleAddExam}>
                <div>
                    <label>Exam Name</label>
                    <input type="text" name="examName" value={newExam.examName} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Exam Date</label>
                    <input type="date" name="examDate" value={newExam.examDate} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Duration (minutes)</label>
                    <input type="number" name="duration" value={newExam.duration} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Room Number</label>
                    <input type="text" name="roomNumber" value={newExam.roomNumber} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Course</label>
                    <select name="courseId" value={newExam.courseId} onChange={handleInputChange} required>
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>{course.courseName}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Exam'}
                </button>
            </form>

            <div className="exams-list">
                <h2>Exams List</h2>
                {exams.length > 0 ? (
                    <ul>
                        {exams.map((exam) => (
                            <li key={exam.id}>
                                <strong>{exam.examName}</strong> - {exam.examDate}
                                <p>Room: {exam.roomNumber} | Duration: {exam.duration} mins | Course ID: {exam.courseId}</p>
                                <button onClick={() => handleViewSubmissions(exam.id)} className="view-submissions-button">View Submissions</button>
                                <button onClick={() => handleDeleteExam(exam.id)} className="delete-button">Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No exams available for your courses.</p>
                )}
            </div>
        </div>
    );
};

export default ExamPage;
