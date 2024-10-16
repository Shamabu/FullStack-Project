import React, { useState, useEffect } from 'react';
import AttendanceApi from './ApiCalls/AttendanceApi';  // Make sure the file exists in the same directory

function AttendancePage() {
    const [attendances, setAttendances] = useState([]); // State to hold attendance data
    const [newAttendance, setNewAttendance] = useState({
        roomNumber: '',
        start: '',
        duration: '',
        status: '',
        notes: '',
        studentId: '',
        courseId: ''
    });

    // Fetch all attendance records when the component mounts
    useEffect(() => {
        AttendanceApi.getAttendances()
            .then((response) => {
                setAttendances(response.data);  // Set the state with the response data
            })
            .catch((error) => {
                console.error('There was an error fetching the attendances!', error);
            });
    }, []);

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAttendance((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        AttendanceApi.createAttendance(newAttendance)
            .then(() => {
                alert('Attendance added successfully!');
                setNewAttendance({
                    roomNumber: '',
                    start: '',
                    duration: '',
                    status: '',
                    notes: '',
                    studentId: '',
                    courseId: ''
                });
                // Refresh the attendance list
                return AttendanceApi.getAttendances();
            })
            .then((response) => {
                setAttendances(response.data);  // Update the attendance list
            })
            .catch((error) => {
                console.error('There was an error adding the attendance!', error);
            });
    };

    return (
        <div className="container">
            <h2>Attendance Records</h2>

            {/* Attendance Form */}
            <div className="mb-4">
                <h4>Add New Attendance</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="roomNumber"
                            placeholder="Room Number"
                            value={newAttendance.roomNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="datetime-local"
                            className="form-control"
                            name="start"
                            placeholder="Start Time"
                            value={newAttendance.start}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            className="form-control"
                            name="duration"
                            placeholder="Duration (in minutes)"
                            value={newAttendance.duration}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="status"
                            placeholder="Status (e.g. Present, Absent)"
                            value={newAttendance.status}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="notes"
                            placeholder="Notes"
                            value={newAttendance.notes}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            className="form-control"
                            name="studentId"
                            placeholder="Student ID"
                            value={newAttendance.studentId}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            className="form-control"
                            name="courseId"
                            placeholder="Course ID"
                            value={newAttendance.courseId}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Attendance</button>
                </form>
            </div>

            {/* Display Attendance Records */}
            <h4>Attendance List</h4>
            {attendances.length === 0 ? (
                <p>No attendance records available.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Room Number</th>
                            <th>Start</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th>Student ID</th>
                            <th>Course ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.map((attendance) => (
                            <tr key={attendance.id}>
                                <td>{attendance.id}</td>
                                <td>{attendance.roomNumber}</td>
                                <td>{new Date(attendance.start).toLocaleString()}</td>
                                <td>{attendance.duration} minutes</td>
                                <td>{attendance.status}</td>
                                <td>{attendance.notes}</td>
                                <td>{attendance.studentId}</td>
                                <td>{attendance.courseId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AttendancePage;
