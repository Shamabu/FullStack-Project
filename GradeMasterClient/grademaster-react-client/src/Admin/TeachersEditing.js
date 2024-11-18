//Admin - Add/Delete/Edit Teachers In The System 
import React, { useState, useEffect } from "react";
import TeachersApi from '../ApiCalls/TeachersApi';

function TeachersEditing() {
    // State for all teachers
    const [teachers, setTeachers] = useState([]);

    // State for the current teacher being added/edited
    const [currentTeacher, setCurrentTeacher] = useState({
        id: 0,
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    // State to toggle between add and edit modes
    const [editing, setEditing] = useState(false);

    // Fetch all teachers when the component mounts
    useEffect(() => {
        refreshTeachers();
    }, []);

    // Fetch teachers from the server
    const refreshTeachers = () => {
        TeachersApi.getTeachers()
            .then(response => {
                setTeachers(response.data);
            })
            .catch(error => {
                console.error("Error fetching teachers:", error);
            });
    };

    // Handle input change for form fields
    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentTeacher({ ...currentTeacher, [name]: value });
    };

    // Add a new teacher
    const addTeacher = () => {
        TeachersApi.createTeacher(currentTeacher)
            .then(() => {
                refreshTeachers(); // Refresh the list of teachers
                resetForm(); // Clear the form after adding
            })
            .catch(error => {
                console.error("Error adding teacher:", error);
            });
    };

    // Update an existing teacher
    const updateTeacher = () => {
        TeachersApi.updateTeacher(currentTeacher.id, currentTeacher)
            .then(() => {
                refreshTeachers(); // Refresh the list of teachers
                resetForm(); // Clear the form after updating
                setEditing(false); // Switch back to add mode
            })
            .catch(error => {
                console.error("Error updating teacher:", error);
            });
    };

    // Delete a teacher
    const deleteTeacher = id => {
        TeachersApi.deleteTeacher(id)
            .then(() => {
                refreshTeachers(); // Refresh the list of teachers after deletion
            })
            .catch(error => {
                console.error("Error deleting teacher:", error);
            });
    };

    // Populate the form with teacher details for editing
    const editTeacher = teacher => {
        setCurrentTeacher(teacher);
        setEditing(true);
    };

    // Reset the form fields
    const resetForm = () => {
        setCurrentTeacher({
            id: 0,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
        });
    };

    return (
        <div className="teachers-container">
            <h2>Teachers Management</h2>

            {/* Form for adding/updating teachers */}
            <form
                onSubmit={event => {
                    event.preventDefault();
                    editing ? updateTeacher() : addTeacher();
                }}
                className="teacher-form"
            >
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={currentTeacher.email}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={currentTeacher.password}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={currentTeacher.firstName}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={currentTeacher.lastName}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={currentTeacher.phoneNumber}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editing ? 'Update Teacher' : 'Add Teacher'}
                </button>
                {editing && (
                    <button type="button" onClick={resetForm} className="btn btn-secondary">
                        Cancel Edit
                    </button>
                )}
            </form>

            {/* Table to display the list of teachers */}
            <table className="table table-striped teacher-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.email}</td>
                            <td>{teacher.firstName}</td>
                            <td>{teacher.lastName}</td>
                            <td>{teacher.phoneNumber}</td>
                            <td>
                                <button
                                    onClick={() => editTeacher(teacher)}
                                    className="btn btn-warning btn-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTeacher(teacher.id)}
                                    className="btn btn-danger btn-sm"
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

export default TeachersEditing;
