import React, { useState, useEffect } from 'react';
import AttendanceApi from '../ApiCalls/AttendanceApi';
import StudentsApi from '../ApiCalls/StudentsApi'; // For fetching students
import { useLocation } from 'react-router-dom';

function Attendance() {
    const [attendances, setAttendances] = useState([]);
    const [students, setStudents] = useState([]);
    const [newAttendance, setNewAttendance] = useState({
        roomNumber: '',
        start: '',
        duration: 0,
        status: '',
        notes: '',
        studentId: 0,
        courseId: 0,
    });

    const location = useLocation();  // Get courseId from location
    const { courseId, courseName } = location.state;

    useEffect(() => {
        fetchStudents();
        fetchAttendances();
    }, []);

    const fetchStudents = () => {
        StudentsApi.getStudentsByCourseId(courseId).then(response => {
            setStudents(response.data);
        });
    };

    const fetchAttendances = () => {
        AttendanceApi.getAttendances().then(response => {
            const courseAttendances = response.data.filter(att => att.courseId === courseId);
            setAttendances(courseAttendances);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAttendance({ ...newAttendance, [name]: value });
    };

    const handleAddAttendance = () => {
        AttendanceApi.createAttendance(newAttendance).then(() => {
            fetchAttendances();
            resetForm();
        });
    };

    const resetForm = () => {
        setNewAttendance({
            roomNumber: '',
            start: '',
            duration: 0,
            status: '',
            notes: '',
            studentId: 0,
            courseId: courseId,
        });
    };

    return (
        <div className="container">
            <h2>Attendance for {courseName}</h2>

            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleAddAttendance();
                }}
            >
                <div className="form-group">
                    <label>Room Number</label>
                    <input
                        type="text"
                        name="roomNumber"
                        value={newAttendance.roomNumber}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Start Date/Time</label>
                    <input
                        type="datetime-local"
                        name="start"
                        value={newAttendance.start}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input
                        type="number"
                        name="duration"
                        value={newAttendance.duration}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select
                        name="status"
                        value={newAttendance.status}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={newAttendance.notes}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Student</label>
                    <select
                        name="studentId"
                        value={newAttendance.studentId}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    >
                        <option value="0">Select Student</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Attendance</button>
            </form>

            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Start Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Student</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map(attendance => (
                        <tr key={attendance.id}>
                            <td>{attendance.roomNumber}</td>
                            <td>{new Date(attendance.start).toLocaleString()}</td>
                            <td>{attendance.duration} minutes</td>
                            <td>{attendance.status}</td>
                            <td>{attendance.notes}</td>
                            <td>{students.find(s => s.id === attendance.studentId)?.firstName} {students.find(s => s.id === attendance.studentId)?.lastName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Attendance;
