import React, { useState } from "react";
import TeachersApi from '../ApiCalls/TeachersApi';
import CoursePage from '../CourseComp/CoursePage';  // Import CoursePage

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInTeacher, setLoggedInTeacher] = useState(null);  // Store logged-in teacher details

    const handleLogin = (event) => {
        event.preventDefault();

        // Clear previous error before new login attempt
        setError('');

        // Attempt to find the teacher based on email and password
        TeachersApi.getTeachers().then(response => {
            const teacher = response.data.find(t => t.email === email && t.password === password);
            
            if (teacher) {
                // If login is successful, store the teacher's details and set loggedIn state to true
                setLoggedInTeacher(teacher);  
                setIsLoggedIn(true);
            } else {
                setError("Invalid credentials, please try again.");
            }
        }).catch(() => {
            setError("Failed to log in. Please try again later.");
        });
    };

    return (
        <div className="container">
            {!isLoggedIn ? (
                <div>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                </div>
            ) : (
                <div>
                    <h2>Welcome, {loggedInTeacher.firstName}!</h2>
                    {/* Render the CoursePage component only if the teacher is logged in */}
                    <CoursePage teacher={loggedInTeacher} setLoggedInTeacher={setLoggedInTeacher} />
                </div>
            )}
        </div>
    );
}

export default Login;
