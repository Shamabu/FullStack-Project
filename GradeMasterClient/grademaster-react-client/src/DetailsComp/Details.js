import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './Details.css';
import Participant from './Participants';
import StudentAttendance from '../AttendanceComp/StudentAttendance';
import CourseGrades from './CourseGrades';
import CourseTap from './CourseTap';
import { FaChalkboardTeacher, FaClipboardList, FaGraduationCap, FaBook } from 'react-icons/fa';

function Details() {
    const location = useLocation();
    const { courseName, teacherName, courseId } = location.state || {
        courseName: 'No course selected',
        teacherName: 'No instructor selected',
        courseId: null,
    };
    const [activeTab, setActiveTab] = useState('course');

    const tabList = [
        { id: 'course', label: 'Course', icon: <FaBook />, content: <CourseTap courseId={courseId} /> },
        { id: 'participants', label: 'Participants', icon: <FaChalkboardTeacher />, content: <Participant /> },
        { id: 'grades', label: 'Grades', icon: <FaClipboardList />, content: <CourseGrades courseId={courseId} /> },
        { id: 'attendance', label: 'Attendance', icon: <FaGraduationCap />, content: <StudentAttendance courseId={courseId} /> },
    ];

    return (
        <div className="details-page full-page">
            <Navbar />
            <div className="content-area">
                <h2>Course Management</h2>

                <div className="course-info">
                    <div className="alert alert-primary course-info-box">
                        <p>
                            <strong>Course name:</strong> {courseName}
                            <br />
                            <strong>Instructor:</strong> {teacherName}
                        </p>
                    </div>
                </div>

                <ul className="nav nav-tabs tab-navigation" role="tablist">
                    {tabList.map((tab) => (
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

                <div className="tab-content mt-3">
                    {tabList.map((tab) => (
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
    );
}

export default Details;
