import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { FaChalkboardTeacher, FaClipboardList, FaGraduationCap, FaBook } from 'react-icons/fa';
import Navbar from '../DetailsComp/Navbar';

function DashboardPage() {
    const location = useLocation();
    const { teacher } = location.state || {}; // Get teacher data from location state
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        if (tab === 'courses') {
            navigate('/courses', { state: { teacher } });
        } else if (tab === 'assignments') {
            navigate('/assignments', { state: { teacherId: teacher?.id } });
        } else if (tab === 'exams') {
            navigate('/exams', { state: { teacherId: teacher?.id } });
        } else if (tab === 'grades') {
            navigate('/grades', { state: { teacher } }); // Navigate to Grades page with teacher data
        }
    };

    if (!teacher) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="dashboard-page">
            {/* Navbar */}
            <Navbar />

            {/* Header Section */}
            <div className="dashboard-header">
                <h2>Welcome, {teacher.firstName} {teacher.lastName}!</h2>
                <p>Here you can manage your courses, assignments, exams, and more.</p>
            </div>

            {/* Tab Cards Section */}
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
