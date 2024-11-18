import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // Import the App component that will contain your routes
import AttendancePage from './AttendancePage';
import StudentCheckPage from './Admin/StudentCheckPage'; // Admin - Adds Students 
import EnrollmentsCheckPage from './Admin/EnrollmentsCheckPage'; //Admin - Enrolls Student To Course 
import StudentAttendance from './AttendanceComp/StudentAttendance';//navigates from details with course and teacher data
import Attendance from './AttendanceComp/Attendance';
import AdminAssignmentSubmissionPage from './AssignmentSubmissionComp/AssignmentSubmissionPage';//Admin - Student Adds Assignment Submission
import ExamSubmissionAdmin from './ExamComp/ExamSubmissionAdmin';
import AdminExamSubmissionPage from './ExamSubmissionsComp/AdminExamSubmissionPage';
import SubmitAssignmentPage from './Admin/SubmitAssignmentPage';//secondary Assignment Submit Page 
import TeachersEditing from './Admin/TeachersEditing';//Admin - Add/Delete/Edit Teachers In The System
import AssignmentsPage from './AssignmentComp/AssignmentPage'; //Navigates From Dashboard Page , Views/Add Assignments By The Teacher 
import AllSubmissionsPage from './AllSubmissionsPage';//views all submissions
import StatisticsPage from './StatisticsPage';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
