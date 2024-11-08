import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // Import the App component that will contain your routes
import AttendancePage from './AttendancePage';
import StudentCheckPage from './StudentCheckPage';
import EnrollmentsCheckPage from './Admin/EnrollmentsCheckPage';
import StudentPage from './Admin/StudentPage';
import StudentAttendance from './AttendanceComp/StudentAttendance';
import Attendance from './AttendanceComp/Attendance';
import AssignmentCheckPage from './AssignmentCheckPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
