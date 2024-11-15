import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './Details.css';
import Participant from './Participants';
import StudentAttendance from '../AttendanceComp/StudentAttendance';
import CourseGrades from './CourseGrades'; // Updated import
import { FaChalkboardTeacher, FaClipboardList, FaGraduationCap, FaBook } from 'react-icons/fa';

function Details() {
    const location = useLocation();
    const { courseName, teacherName, courseId } = location.state || { 
        courseName: 'No course selected', 
        teacherName: 'No instructor selected', 
        courseId: null 
    };
    const [activeTab, setActiveTab] = useState('course'); // Default tab is Course

    const tabList = [
        { id: 'course', label: 'Course', icon: <FaBook />, content: <CourseDetails /> },
        { id: 'participants', label: 'Participants', icon: <FaChalkboardTeacher />, content: <Participants /> },
        { id: 'grades', label: 'Grades', icon: <FaClipboardList />, content: <Grades courseId={courseId} /> },
        { id: 'attendance', label: 'Attendance', icon: <FaGraduationCap />, content: <Attendance courseId={courseId} /> }
    ];

    return (
        <div className="details-page full-page">
            <Navbar />
            <div className="content-area">
                <h2>Course Management</h2>

                {/* General Information Section */}
                <div className="course-info">
                    <div className="alert alert-primary course-info-box">
                        <p>
                            <strong>Course name:</strong> {courseName}<br />
                            <strong>Instructor:</strong> {teacherName}
                        </p>
                    </div>
                </div>

                {/* Tabs Section */}
                <div>
                    <ul className="nav nav-tabs tab-navigation" role="tablist">
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
                                    {tab.icon} {tab.label}
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

const CourseDetails = () => (
    <div>
        <h4>Course Details</h4>
        <p>Here you can display all the detailed information about the course, such as syllabus, schedule, and more.</p>
    </div>
);

const Participants = () => (
    <div>
        <Participant />
    </div>
);

const Grades = ({ courseId }) => (
    <div>
        <CourseGrades courseId={courseId} /> {/* Updated component */}
    </div>
);

const Attendance = ({ courseId }) => (
    <div>
        <StudentAttendance courseId={courseId} />
    </div>
);

export default Details;
