import React, { useState, useEffect } from "react";
import StudentApi from "./ApiCalls/StudentsApi";

function StudentCheckPage() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    dateBirth: "",
    gender: "",
    phoneNumber: "",
    adress: "",
    email: "",
    enrollmentDate: ""
  });

  const [fetchedStudent, setFetchedStudent] = useState(null);

  // Fetch all students on component mount
  useEffect(() => {
    StudentApi.getStudents()
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  // Fetch a student by ID
  const handleGetStudent = () => {
    if (studentId) {
      StudentApi.getStudent(studentId)
        .then((response) => {
          setFetchedStudent(response.data);
        })
        .catch((error) => {
          console.error("Error fetching student:", error);
        });
    }
  };

  // Handle form change for new student
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  // Create a new student
  const handleCreateStudent = () => {
    StudentApi.createStudent(newStudent)
      .then((response) => {
        alert("Student created successfully!");
        // Optionally, you can re-fetch students to update the list
        setStudents([...students, response.data]);
      })
      .catch((error) => {
        console.error("Error creating student:", error);
      });
  };

  return (
    <div>
      <h2>Student API Test</h2>

      <h3>All Students</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{`${student.firstName} ${student.lastName}`}</li>
        ))}
      </ul>

      <h3>Get Student by ID</h3>
      <input
        type="text"
        placeholder="Enter student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button onClick={handleGetStudent}>Get Student</button>
      {fetchedStudent && (
        <div>
          <h4>Student Details:</h4>
          <p>First Name: {fetchedStudent.firstName}</p>
          <p>Last Name: {fetchedStudent.lastName}</p>
          <p>Email: {fetchedStudent.email}</p>
          {/* Add more fields as needed */}
        </div>
      )}

      <h3>Create New Student</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={newStudent.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={newStudent.lastName}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dateBirth"
          value={newStudent.dateBirth}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={newStudent.gender}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={newStudent.phoneNumber}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="adress"
          placeholder="Address"
          value={newStudent.adress}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="enrollmentDate"
          value={newStudent.enrollmentDate}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateStudent}>Create Student</button>
      </form>
    </div>
  );
}

export default StudentCheckPage;
