import React, { useState, useEffect } from "react";
import EnrollmentsApi from "../ApiCalls/EnrollmentApi";

const EnrollmentsCheckPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [newEnrollment, setNewEnrollment] = useState({
    studentId: "",
    courseId: "",
    finalGrade: "",
    enrollmentDate: "",
  });
  const [editEnrollmentId, setEditEnrollmentId] = useState(null);
  const [editEnrollment, setEditEnrollment] = useState({
    studentId: "",
    courseId: "",
    finalGrade: "",
    enrollmentDate: "",
  });

  // Fetch all enrollments on component mount
  useEffect(() => {
    EnrollmentsApi.getEnrollments()
      .then((response) => {
        setEnrollments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching enrollments!", error);
      });
  }, []);

  // Create a new enrollment
  const createEnrollment = () => {
    EnrollmentsApi.createEnrollment(newEnrollment)
      .then(() => {
        // Fetch updated enrollments
        EnrollmentsApi.getEnrollments()
          .then((response) => {
            setEnrollments(response.data);
            setNewEnrollment({
              studentId: "",
              courseId: "",
              finalGrade: "",
              enrollmentDate: "",
            });
          })
          .catch((error) => console.error("Error fetching enrollments", error));
      })
      .catch((error) => console.error("Error creating enrollment", error));
  };

  // Edit an existing enrollment
  const handleEditEnrollment = (id) => {
    const enrollmentToEdit = enrollments.find((e) => e.id === id);
    setEditEnrollmentId(id);
    setEditEnrollment(enrollmentToEdit);
  };

  // Update an enrollment
  const updateEnrollment = () => {
    EnrollmentsApi.updateEnrollment(editEnrollmentId, editEnrollment)
      .then(() => {
        // Fetch updated enrollments
        EnrollmentsApi.getEnrollments()
          .then((response) => {
            setEnrollments(response.data);
            setEditEnrollmentId(null);
            setEditEnrollment({
              studentId: "",
              courseId: "",
              finalGrade: "",
              enrollmentDate: "",
            });
          })
          .catch((error) => console.error("Error fetching enrollments", error));
      })
      .catch((error) => console.error("Error updating enrollment", error));
  };

  // Delete an enrollment
  const deleteEnrollment = (id) => {
    EnrollmentsApi.deleteEnrollment(id)
      .then(() => {
        // Fetch updated enrollments
        EnrollmentsApi.getEnrollments()
          .then((response) => {
            setEnrollments(response.data);
          })
          .catch((error) => console.error("Error fetching enrollments", error));
      })
      .catch((error) => console.error("Error deleting enrollment", error));
  };

  return (
    <div>
      <h1>Enrollments</h1>

      <div>
        <h2>Create New Enrollment</h2>
        <input
          type="number"
          placeholder="Student ID"
          value={newEnrollment.studentId}
          onChange={(e) => setNewEnrollment({ ...newEnrollment, studentId: e.target.value })}
        />
        <input
          type="number"
          placeholder="Course ID"
          value={newEnrollment.courseId}
          onChange={(e) => setNewEnrollment({ ...newEnrollment, courseId: e.target.value })}
        />
        <input
          type="number"
          placeholder="Final Grade"
          value={newEnrollment.finalGrade}
          onChange={(e) => setNewEnrollment({ ...newEnrollment, finalGrade: e.target.value })}
        />
        <input
          type="date"
          value={newEnrollment.enrollmentDate}
          onChange={(e) => setNewEnrollment({ ...newEnrollment, enrollmentDate: e.target.value })}
        />
        <button onClick={createEnrollment}>Create Enrollment</button>
      </div>

      <div>
        <h2>Edit Enrollment</h2>
        {editEnrollmentId && (
          <>
            <input
              type="number"
              placeholder="Student ID"
              value={editEnrollment.studentId}
              onChange={(e) => setEditEnrollment({ ...editEnrollment, studentId: e.target.value })}
            />
            <input
              type="number"
              placeholder="Course ID"
              value={editEnrollment.courseId}
              onChange={(e) => setEditEnrollment({ ...editEnrollment, courseId: e.target.value })}
            />
            <input
              type="number"
              placeholder="Final Grade"
              value={editEnrollment.finalGrade}
              onChange={(e) => setEditEnrollment({ ...editEnrollment, finalGrade: e.target.value })}
            />
            <input
              type="date"
              value={editEnrollment.enrollmentDate}
              onChange={(e) => setEditEnrollment({ ...editEnrollment, enrollmentDate: e.target.value })}
            />
            <button onClick={updateEnrollment}>Update Enrollment</button>
          </>
        )}
      </div>

      <div>
        <h2>Current Enrollments</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Course ID</th>
              <th>Final Grade</th>
              <th>Enrollment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.id}</td>
                <td>{enrollment.studentId}</td>
                <td>{enrollment.courseId}</td>
                <td>{enrollment.finalGrade}</td>
                <td>{enrollment.enrollmentDate}</td>
                <td>
                  <button onClick={() => handleEditEnrollment(enrollment.id)}>Edit</button>
                  <button onClick={() => deleteEnrollment(enrollment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentsCheckPage;
