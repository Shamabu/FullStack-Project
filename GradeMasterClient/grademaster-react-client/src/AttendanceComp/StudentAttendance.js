// Component for managing student attendance for a specific course
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentAttendance.css';

const StudentAttendance = ({ courseId, courseName }) => {
  // State to store the list of students enrolled in the course
  const [students, setStudents] = useState([]);

  // State to manage attendance records for each student
  const [attendanceRecords, setAttendanceRecords] = useState({});

  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  // Fetch the list of enrolled students when the course ID changes
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        // API call to fetch students enrolled in the course
        const response = await axios.get(`https://localhost:7185/api/Student/course/${courseId}`);
        setStudents(response.data);

        // Initialize attendance records for all students
        const initialRecords = response.data.reduce((acc, student) => {
          acc[student.id] = { roomNumber: '', start: '', duration: '', status: '', notes: '' };
          return acc;
        }, {});
        setAttendanceRecords(initialRecords);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    // Trigger the fetch only if a valid course ID is provided
    if (courseId) {
      fetchEnrolledStudents();
    }
  }, [courseId]);

  // Handle changes to input fields for attendance records
  const handleInputChange = (studentId, field, value) => {
    setAttendanceRecords((prevRecords) => ({
      ...prevRecords,
      [studentId]: {
        ...prevRecords[studentId],
        [field]: value,
      },
    }));
  };

  // Handle form submission to save attendance records
  const handleSubmitAttendance = async (event) => {
    event.preventDefault();
    try {
      // Prepare attendance data for API submission
      const attendanceData = students.map((student) => ({
        ...attendanceRecords[student.id],
        studentId: student.id,
        courseId: courseId,
      }));

      // Submit each attendance record to the API
      await Promise.all(
        attendanceData.map((record) =>
          axios.post(`https://localhost:7185/api/attendance`, record)
        )
      );

      alert('Attendance records added successfully!');
    } catch (error) {
      console.error('Error submitting attendance records:', error);
    }
  };

  // Navigate to view attendance records for a specific student
  const handleViewAttendance = (studentId) => {
    navigate(`/student-attendance/${studentId}/${courseId}`);
  };

  return (
    <form onSubmit={handleSubmitAttendance} className="attendance-form">
      <h1>Student Attendance for Course {courseName}</h1>

      {/* Attendance table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Room Number</th>
            <th>Date & Time</th>
            <th>Duration (minutes)</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="attendance-row">
              {/* Display student name */}
              <td className="student-name">
                {student.firstName} {student.lastName}
              </td>
              {/* Input field for room number */}
              <td>
                <input
                  type="text"
                  className="input-field"
                  value={attendanceRecords[student.id]?.roomNumber || ''}
                  onChange={(e) => handleInputChange(student.id, 'roomNumber', e.target.value)}
                  required
                />
              </td>
              {/* Input field for date and time */}
              <td>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={attendanceRecords[student.id]?.start || ''}
                  onChange={(e) => handleInputChange(student.id, 'start', e.target.value)}
                  required
                />
              </td>
              {/* Input field for duration */}
              <td>
                <input
                  type="number"
                  className="input-field"
                  value={attendanceRecords[student.id]?.duration || ''}
                  onChange={(e) => handleInputChange(student.id, 'duration', e.target.value)}
                  required
                />
              </td>
              {/* Dropdown for attendance status */}
              <td>
                <select
                  className="input-field"
                  value={attendanceRecords[student.id]?.status || ''}
                  onChange={(e) => handleInputChange(student.id, 'status', e.target.value)}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </td>
              {/* Input field for notes */}
              <td>
                <input
                  type="text"
                  className="input-field"
                  value={attendanceRecords[student.id]?.notes || ''}
                  onChange={(e) => handleInputChange(student.id, 'notes', e.target.value)}
                  placeholder="Add notes"
                />
              </td>
              {/* Button to view attendance records */}
              <td>
                <button onClick={() => handleViewAttendance(student.id)} className="view-button">
                  View Records
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form submission button */}
      <div className="form-footer">
        <button type="submit" className="submit-button">Submit Attendance</button>
      </div>
    </form>
  );
};

export default StudentAttendance;
