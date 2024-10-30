import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Admin/Login';  // Import the Login component
import CoursePage from './CourseComp/CoursePage';  // Import CoursePage component
import Details from './DetailsComp/Details';
import Participant from './DetailsComp/Participants';
import Attendance from './AttendanceComp/Attendance';
import AttendanceCoursePage from './DetailsComp/AttendanceCoursePage';
import StudentAttendance from './AttendanceComp/StudentAttendance';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Default route is login */}
      <Route path="/courses" element={<CoursePage />} /> {/* Route for courses */}
      <Route path="/detailscomp/details" element={<Details />} /> {/* Route for attendance */}
      <Route path="/attendancecomp/attendance" element={<Attendance />} />
      <Route path="/attendance" element={<StudentAttendance />} />
    </Routes>
  );
}

export default App;