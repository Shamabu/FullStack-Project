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

    // Edit/create flag
    const [editing, setEditing] = useState(false);

    // Fetch teachers on component mount
    useEffect(() => {
        refreshTeachers();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentTeacher({ ...currentTeacher, [name]: value });
    };

    // Fetch all teachers
    const refreshTeachers = () => {
        TeachersApi.getTeachers().then(response => {
            setTeachers(response.data);
        });
    };

    // Add new teacher
    const addTeacher = () => {
        TeachersApi.createTeacher(currentTeacher).then(response => {
            refreshTeachers();
            // Reset current teacher
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

    // Update teacher
    const updateTeacher = () => {
        TeachersApi.updateTeacher(currentTeacher.id, currentTeacher).then(response => {
            refreshTeachers();
            // Reset current teacher
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

    // Delete teacher by ID
    const deleteTeacher = (id) => {
        TeachersApi.deleteTeacher(id).then(() => {
            refreshTeachers();
        });
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
                <button type="submit" className="btn btn-primary m-3">
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
                    {/* Map through teachers to create rows */}
                    {teachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.email}</td>
                            <td>{teacher.firstName}</td>
                            <td>{teacher.lastName}</td>
                            <td>{teacher.phoneNumber}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        setCurrentTeacher(teacher); // Set the selected teacher's data in currentTeacher state

                                        setEditing(true);
                                    }}
                                    className="btn btn-warning m-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTeacher(teacher.id)}
                                    className="btn btn-danger m-1"
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
