import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Admin/Login';  // Import the Login component
import CoursePage from './CourseComp/CoursePage';  // Import CoursePage component
import Details from './DetailsComp/Details';
import Participant from './DetailsComp/Participants';
import Attendance from './AttendanceComp/Attendance';
import AttendanceCoursePage from './DetailsComp/AttendanceCoursePage';
import StudentAttendance from './AttendanceComp/StudentAttendance';
import StudentAttendanceRecord from './AttendanceComp/StudentAttendanceRecord';
import AssignmentsPage from './AssignmentComp/AssignmentPage';
import DashboardPage from './DashboardComp/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Default route is login */}
      <Route path="/courses" element={<CoursePage />} /> {/* Route for courses */}
      <Route path="/detailscomp/details" element={<Details />} /> {/* Route for attendance */}
      <Route path="/attendancecomp/attendance" element={<Attendance />} />
      <Route path="/attendance" element={<StudentAttendance />} />
      <Route path="/course/:courseId" element={<Details />} />
      <Route path="/attendance/:courseId" element={<AttendanceCoursePage />} />
      <Route path="/student-attendance/:studentId/:courseId" element={<StudentAttendanceRecord />} />
      <Route path="/coursepage" element={<CoursePage />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/" element={<CoursePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />


    </Routes>
  );
}

export default App;