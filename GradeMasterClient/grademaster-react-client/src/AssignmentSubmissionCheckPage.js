import React, { useState, useEffect } from 'react';
import AssignmentSubmissionApi from './ApiCalls/AssignmentSubmissionApi';

const AssignmentSubmissionPage = () => {
  const [courses, setCourses] = useState([]);  // List of courses
  const [selectedCourseId, setSelectedCourseId] = useState('');  // Selected course ID
  const [submissions, setSubmissions] = useState([]);  // List of assignment submissions

  // Fetch all courses (assuming you have an API for this)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://localhost:7185/api/courses');  // Replace with actual URL
        const data = await response.json();
        setCourses(data);  // Set the courses in state
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch assignment submissions when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      const fetchSubmissions = async () => {
        try {
          const response = await AssignmentSubmissionApi.getAllAssignmentsSubmissions(selectedCourseId);
          setSubmissions(response.data);  // Set submissions in state
        } catch (error) {
          console.error('Error fetching assignments for course:', error);
        }
      };

      fetchSubmissions();
    }
  }, [selectedCourseId]);  // Trigger when selectedCourseId changes

  const handleCourseChange = (event) => {
    setSelectedCourseId(event.target.value);  // Set the selected course ID
  };

  return (
    <div>
      <h2>Assignment Submissions</h2>
      
      {/* Course Dropdown */}
      <label htmlFor="course-select">Select Course:</label>
      <select
        id="course-select"
        value={selectedCourseId}
        onChange={handleCourseChange}
      >
        <option value="">--Select a Course--</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      {/* Display assignments based on the selected course */}
      {selectedCourseId && submissions.length > 0 ? (
        <div>
          <h3>Assignments for Course: {courses.find(course => course.id === selectedCourseId)?.name}</h3>
          <ul>
            {submissions.map(submission => (
              <li key={submission.id}>
                <h4>{submission.assignmentTitle}</h4>
                <p>Submitted By: {submission.studentName}</p>
                <p>Status: {submission.status}</p>
                <p>Grade: {submission.grade}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        selectedCourseId && <p>No assignments found for this course.</p>
      )}
    </div>
  );
};

export default AssignmentSubmissionPage;
