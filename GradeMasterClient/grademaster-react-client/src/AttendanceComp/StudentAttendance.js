import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentAttendance.css';

const StudentAttendance = ({ courseId, courseName }) => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const response = await axios.get(`https://localhost:7185/api/Student/course/${courseId}`);
        setStudents(response.data);
        const initialRecords = response.data.reduce((acc, student) => {
          acc[student.id] = { roomNumber: '', start: '', duration: '', status: '', notes: '' };
          return acc;
        }, {});
        setAttendanceRecords(initialRecords);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (courseId) {
      fetchEnrolledStudents();
    }
  }, [courseId]);

  const handleInputChange = (studentId, field, value) => {
    setAttendanceRecords((prevRecords) => ({
      ...prevRecords,
      [studentId]: {
        ...prevRecords[studentId],
        [field]: value,
      },
    }));
  };

  const handleSubmitAttendance = async (event) => {
    event.preventDefault();
    try {
      const attendanceData = students.map((student) => ({
        ...attendanceRecords[student.id],
        studentId: student.id,
        courseId: courseId,
      }));
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

  const handleViewAttendance = (studentId) => {
    navigate(`/student-attendance/${studentId}/${courseId}`);
  };

  return (
  
      <form onSubmit={handleSubmitAttendance} className="attendance-form">
      <h1>Student Attendance for Course {courseName}</h1>

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
                <td className="student-name">
                  {student.firstName} {student.lastName}
                </td>
                <td>
                  <input
                    type="text"
                    className="input-field"
                    value={attendanceRecords[student.id]?.roomNumber || ''}
                    onChange={(e) => handleInputChange(student.id, 'roomNumber', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={attendanceRecords[student.id]?.start || ''}
                    onChange={(e) => handleInputChange(student.id, 'start', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="input-field"
                    value={attendanceRecords[student.id]?.duration || ''}
                    onChange={(e) => handleInputChange(student.id, 'duration', e.target.value)}
                    required
                  />
                </td>
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
                <td>
                  <input
                    type="text"
                    className="input-field"
                    value={attendanceRecords[student.id]?.notes || ''}
                    onChange={(e) => handleInputChange(student.id, 'notes', e.target.value)}
                    placeholder="Add notes"
                  />
                </td>
                <td>
                  <button onClick={() => handleViewAttendance(student.id)} className="view-button">
                    View Records
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="form-footer">
          <button type="submit" className="submit-button">Submit Attendance</button>
        </div>
      </form>
 
  );
};

export default StudentAttendance;
