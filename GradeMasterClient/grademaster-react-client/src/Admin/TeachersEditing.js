import React, { useState, useEffect } from "react";
import TeachersApi from '../ApiCalls/TeachersApi';

// Component for CRUD operations using server calls
function TeachersEditing() {
    // State for all teachers
    const [teachers, setTeachers] = useState([]);

    // State for current teacher
    const [currentTeacher, setCurrentTeacher] = useState({
        id: 0,
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    // Edit / create
    const [editing, setEditing] = useState(false);

    // Fetch teachers when component mounts
    useEffect(() => {
        refreshTeachers();
    }, []);

    // Fetch all teachers from the API and update state
    const refreshTeachers = () => {
        TeachersApi.getTeachers().then(response => {
            setTeachers(response.data);
        });
    };

    // Handle input change for form fields
    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentTeacher({ ...currentTeacher, [name]: value });
    };

    // Add a new teacher
    const addTeacher = () => {
        TeachersApi.createTeacher(currentTeacher).then(() => {
            refreshTeachers();
            setCurrentTeacher({
                id: 0,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: ''
            });
        });
    };

    // Update an existing teacher
    const updateTeacher = () => {
        TeachersApi.updateTeacher(currentTeacher.id, currentTeacher).then(() => {
            refreshTeachers();
            setCurrentTeacher({
                id: 0,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: ''
            });
            setEditing(false);
        });
    };

    // Delete a teacher by id
    const deleteTeacher = id => {
        TeachersApi.deleteTeacher(id).then(() => {
            refreshTeachers();
        });
    };

    // Edit teacher by setting current teacher and switching to editing mode
    const editTeacher = teacher => {
        setCurrentTeacher(teacher);
        setEditing(true);
    };

    return (
        <div className="container">
            <h2>Teachers</h2>
            <form
                onSubmit={event => {
                    event.preventDefault();
                    editing ? updateTeacher() : addTeacher();
                }}
            >
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={currentTeacher.email}
                        onChange={handleInputChange}
                        className="form-control"
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
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editing ? 'Update' : 'Add'}
                </button>
            </form>
            <table className="table table-striped">
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
                                    className="btn btn-warning"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTeacher(teacher.id)}
                                    className="btn btn-danger"
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
