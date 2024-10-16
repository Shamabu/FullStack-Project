import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Admin/Login';  // Import the Login component
import CoursePage from './CourseComp/CoursePage';  // Import CoursePage component
import Details from './DetailsComp/Details';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Default route is login */}
      <Route path="/courses" element={<CoursePage />} /> {/* Route for courses */}
      <Route path="/detailscomp/details" element={<Details />} /> {/* Route for attendance */}
    </Routes>
  );
}

export default App;
