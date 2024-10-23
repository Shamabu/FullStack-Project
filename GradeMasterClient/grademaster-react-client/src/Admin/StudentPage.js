import React, { useState, useEffect } from "react";
import StudentsApi from "../ApiCalls/StudentsApi"; // Adjust path accordingly

// Component for CRUD operations using server calls for Students
function StudentPage() {
  // State for all students
  const [students, setStudents] = useState([]);

  // State for current student
  const [currentStudent, setCurrentStudent] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
  });

  // Edit / create
  const [editing, setEditing] = useState(false);

  // Fetch students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch all students from the API and update state
  const fetchStudents = () => {
    StudentsApi.getStudents()
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching students!", error);
      });
  };

  // Handle input change for form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  // Add a new student
  const addStudent = () => {
    StudentsApi.createStudent(currentStudent)
      .then(() => {
        fetchStudents();
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding student!", error.response);
      });
  };

  // Update an existing student
  const updateStudent = () => {
    StudentsApi.updateStudent(currentStudent.id, currentStudent)
      .then(() => {
        fetchStudents();
        resetForm();
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error updating student!", error.response);
      });
  };

  // Delete a student by ID
  const deleteStudent = (id) => {
    StudentsApi.deleteStudent(id)
      .then(() => {
        fetchStudents();
      })
      .catch((error) => {
        console.error("Error deleting student!", error.response);
      });
  };

  // Edit student by setting current student and switching to editing mode
  const editStudent = (student) => {
    setCurrentStudent(student);
    setEditing(true);
  };

  // Reset form fields after adding or editing
  const resetForm = () => {
    setCurrentStudent({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
    });
    setEditing(false);
  };

  return (
    <div className="container">
      <h2>{editing ? "Edit Student" : "Add Student"}</h2>

      {/* Add/Edit Student Form */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          editing ? updateStudent() : addStudent();
        }}
      >
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={currentStudent.firstName}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={currentStudent.lastName}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={currentStudent.email}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editing ? "Update Student" : "Add Student"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Display list of students */}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.email}</td>
              <td>
                <button
                  onClick={() => editStudent(student)}
                  className="btn btn-warning ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStudent(student.id)}
                  className="btn btn-danger ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentPage;
