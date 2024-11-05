// AttendancePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AttendanceCoursePage = () => {
  const { courseId } = useParams();  // Retrieve courseId from route parameters
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const response = await axios.get(`https://localhost:7185/api/students/course/${courseId}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (courseId) {
      fetchEnrolledStudents();
    }
  }, [courseId]);

  const handleStudentChange = async (event) => {
    const studentId = event.target.value;
    setSelectedStudentId(studentId);

    if (studentId) {
      try {
        const response = await axios.get(`https://localhost:7185/api/attendance/student/${studentId}`);
        setAttendanceRecords(response.data || []);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
    } else {
      setAttendanceRecords([]);
    }
  };

  return (
    <div>
      <h1>Attendance for Course {courseId}</h1>
      <label htmlFor="student-select">Select Student:</label>
      <select id="student-select" value={selectedStudentId} onChange={handleStudentChange}>
        <option value="">--Please choose a student--</option>
        {students.map(student => (
          <option key={student.id} value={student.id}>
            {student.firstName} {student.lastName}
          </option>
        ))}
      </select>

      {attendanceRecords.length > 0 && (
        <div>
          <h2>Attendance Records for {students.find(student => student.id === selectedStudentId)?.firstName} {students.find(student => student.id === selectedStudentId)?.lastName}</h2>
          <ul>
            {attendanceRecords.map(record => (
              <li key={record.id}>
                Room: {record.roomNumber}, Date: {new Date(record.start).toLocaleDateString()}, Status: {record.status}, Notes: {record.notes}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttendanceCoursePage;
