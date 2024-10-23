import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";  // Import useLocation to access passed data
import EnrollmentsApi from "../ApiCalls/EnrollmentApi";
import StudentsApi from "../ApiCalls/StudentsApi";  // API to get student details
import './Participant.css';

const Participant = () => {
  const location = useLocation();  // Retrieve passed course data from previous page
  const { courseName, courseId } = location.state || { courseName: 'No course selected', courseId: 0 };
  
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);

  // Log the courseId and courseName to ensure they are passed correctly
  useEffect(() => {
    console.log("Course Name:", courseName);
    console.log("Course ID:", courseId);  // This should now print the correct courseId
}, [courseName, courseId]);


  // Fetch enrollments for the selected course
  useEffect(() => {
    if (courseId !== 0) {
      EnrollmentsApi.getEnrollments()
        .then((response) => {
          console.log("Enrollments Response:", response.data);  // Log the response data
          const courseEnrollments = response.data.filter((enrollment) => enrollment.courseId === courseId);
          setEnrollments(courseEnrollments);  // Store only enrollments for the specific course
        })
        .catch((error) => {
          console.error("There was an error fetching enrollments!", error);
        });
    }
  }, [courseId]);

  // Fetch student details based on enrollment data
  useEffect(() => {
    if (enrollments.length > 0) {
      const studentIds = enrollments.map((enrollment) => enrollment.studentId);
      StudentsApi.getStudents()
        .then((response) => {
          console.log("Students Response:", response.data);  // Log the response data
          const filteredStudents = response.data.filter((student) => studentIds.includes(student.id));
          setStudents(filteredStudents);  // Store the students who are enrolled in the course
        })
        .catch((error) => {
          console.error("There was an error fetching students!", error);
        });
    }
  }, [enrollments]);

  return (
    <div>
      <h2>Students Enrolled in {courseName}</h2>
      {enrollments.length === 0 ? (
        <p>No enrollments found for this course.</p>
      ) : (
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Student ID</th>
              <th>Student Name</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => {
              const student = students.find((student) => student.id === enrollment.studentId);  // Find student based on studentId

              return (
                <tr key={enrollment.id}>
                  <td>{enrollment.courseId}</td>
                  <td>{courseName}</td>
                  <td>{student ? student.id : 'Loading...'}</td>
                  <td>{student ? `${student.firstName} ${student.lastName}` : 'Loading...'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Participant;
