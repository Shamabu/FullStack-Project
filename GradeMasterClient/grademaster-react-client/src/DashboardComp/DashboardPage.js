import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Add your styles here
import { FaChalkboardTeacher, FaClipboardList, FaGraduationCap, FaBook } from 'react-icons/fa'; // Add some Moodle-like icons

function DashboardPage() {
    const location = useLocation();
    const { teacher } = location.state || {};  // Get teacher data from location state
    const navigate = useNavigate();

    // This function handles navigation based on the tab selected
    const handleTabChange = (tab) => {
        if (tab === 'courses') {
            navigate('/courses', { state: { teacher } });  // Navigate to Courses page with teacher info
        } else if (tab === 'assignments') {
            navigate('/assignments', { state: { teacherId: teacher?.id } });  // Navigate to Assignments page
        } else if (tab === 'exams') {
            navigate('/exams', { state: { teacherId: teacher?.id } });  // Navigate to Exams page
        } else if (tab === 'grades') {
            navigate('/grades', { state: { teacherId: teacher?.id } });  // Navigate to Grades page
        }
    };

    if (!teacher) {
        return <div>Loading...</div>;  // Handle case when teacher data is not loaded yet
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome, {teacher.firstName} {teacher.lastName}!</h2>
                <p>Here you can manage your courses, assignments, exams, and more.</p>
            </div>
            <div className="tabs">
                <div className="tab-card" onClick={() => handleTabChange('courses')}>
                    <FaChalkboardTeacher className="tab-icon" />
                    <h4>My Courses</h4>
                </div>
                <div className="tab-card" onClick={() => handleTabChange('assignments')}>
                    <FaClipboardList className="tab-icon" />
                    <h4>Assignments</h4>
                </div>
                <div className="tab-card" onClick={() => handleTabChange('exams')}>
                    <FaGraduationCap className="tab-icon" />
                    <h4>Exams</h4>
                </div>
                <div className="tab-card" onClick={() => handleTabChange('grades')}>
                    <FaBook className="tab-icon" />
                    <h4>Grades</h4>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
