import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './Details.css';
import Participant from './Participants';

function Details() {
    const location = useLocation();
    const { courseName, teacherName } = location.state || { courseName: 'No course selected', teacherName: 'No instructor selected' };
    
    const [activeTab, setActiveTab] = useState('course'); // Default tab is Course

    // Tab data
    const tabList = [
        { id: 'course', label: 'Course', content: <CourseDetails /> },
        { id: 'participants', label: 'Participants', content: <Participants /> },
        { id: 'grades', label: 'Grades', content: <Grades /> },
        { id: 'Attendance', label: 'Attendance', content: <Attendance /> }
    ];

    return (
        <div className="full-page">
            <Navbar />
            <div className="content-area">
                <h2>Course Management</h2>

                {/* General Information Section */}
                <div>
                    <h3>General Information</h3>
                    <div className="alert alert-primary">
                        <p>
                            <strong>Course name:</strong> {courseName}<br />
                            <strong>Instructor:</strong> {teacherName}
                        </p>
                    </div>
                </div>

                {/* Tabs Section */}
                <div>
                    <ul className="nav nav-tabs" role="tablist">
                        {tabList.map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <a
                                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                    href={`#${tab.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(tab.id);
                                    }}
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Tab Content */}
                    <div className="tab-content mt-3">
                        {tabList.map(tab => (
                            <div
                                key={tab.id}
                                className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
                            >
                                {tab.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components for each tab content

const CourseDetails = () => (
    <div>
        <h4>Course Details</h4>
        <p>Here you can display all the detailed information about the course, such as syllabus, schedule, and more.</p>
    </div>
);

const Participants = () => (
    <div>
        <Participant></Participant>
    </div>
);

const Grades = () => (
    <div>
        <h4>Grades</h4>
        <p>Grade management functionality for the course will be implemented here. You can include input forms to add or edit grades, and a table to display current grades.</p>
    </div>
);

const Attendance = () => (
    <div>
        Attendance
        
    </div>
);

export default Details;
