import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StudentAttendanceRecord.css';

const StudentAttendanceRecord = () => {
    const { studentId, courseId } = useParams();
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                const response = await axios.get(`https://localhost:7185/api/attendance/student/${studentId}/course/${courseId}`);
                setAttendanceRecords(response.data);
            } catch (error) {
                console.error('Error fetching attendance records:', error);
            }
        };

        fetchAttendanceRecords();
    }, [studentId, courseId]);

    // Handle delete attendance record
    const handleDeleteRecord = async (recordId) => {
        try {
            await axios.delete(`https://localhost:7185/api/attendance/${recordId}`);
            // Update the state to remove the deleted record
            setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record.id !== recordId));
        } catch (error) {
            console.error('Error deleting attendance record:', error);
        }
    };

    return (
        <div className="student-attendance-record">
            <h2>Attendance Records for Student ID: {studentId} in Course ID: {courseId}</h2>
            {attendanceRecords.length === 0 ? (
                <p>No attendance records found for this student in this course.</p>
            ) : (
                <ul>
                    {attendanceRecords.map((record) => (
                        <li key={record.id} className="attendance-record-item">
                            <div>Room: {record.roomNumber}</div>
                            <div>Date: {new Date(record.start).toLocaleString()}</div>
                            <div>Duration: {record.duration} minutes</div>
                            <div>Status: {record.status}</div>
                            <div>Notes: {record.notes}</div>
                            <button
                                onClick={() => handleDeleteRecord(record.id)}
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentAttendanceRecord;
