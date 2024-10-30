import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentAttendance = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Fetch students enrolled in the course
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const response = await axios.get(`https://localhost:7185/api/students/course/${courseId}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', courseId);
      }
    };

    if (courseId) {
      fetchEnrolledStudents();
    }
  }, [courseId]);

  // Fetch attendance records when a student is selected
  const handleStudentChange = async (event) => {
    const studentId = event.target.value;
    setSelectedStudentId(studentId);

    if (studentId) {
      try {
        const response = await axios.get(`https://localhost:7185/api/attendance/student/${studentId}`);
        if (response.data) {
          setAttendanceRecords(response.data);
        } else {
          setAttendanceRecords([]); // Handle case where no records are found
        }
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
    } else {
      setAttendanceRecords([]); // Clear attendance if no student is selected
    }
  };

  return (
    <div>
      <h1>Student Attendance</h1>
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

export default StudentAttendance;
