import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the course ID
import EnrollmentsApi from "../ap/EnrollmentsApi";
import StudentsApi from "../ApiCalls/StudentsApi";

const CourseParticipantsPage = () => {
  const { courseId } = useParams(); // Get course ID from URL
  const [participants, setParticipants] = useState([]);
  
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // Get all enrollments for this course
        const response = await EnrollmentsApi.getEnrollments(); 
        const enrollments = response.data;

        // Filter the enrollments to find the students enrolled in this course
        const courseParticipants = enrollments.filter(enrollment => enrollment.courseId === parseInt(courseId));
        
        // Fetch the student details for each participant
        const studentPromises = courseParticipants.map(enrollment => 
          StudentsApi.getStudent(enrollment.studentId)
        );
        const studentsResponse = await Promise.all(studentPromises);
        
        // Set the participants to the state
        setParticipants(studentsResponse.map(res => res.data));
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [courseId]);  // Dependency array: when courseId changes, useEffect runs again

  return (
    <div>
      <h1>Participants</h1>
      <ul>
        {participants.map(participant => (
          <li key={participant.id}>
            {participant.firstName} {participant.lastName} {/* Adjust according to your data */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseParticipantsPage;
