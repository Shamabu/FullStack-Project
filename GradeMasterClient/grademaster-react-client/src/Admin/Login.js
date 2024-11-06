import React, { useState } from "react";
import TeachersApi from '../ApiCalls/TeachersApi';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);  // New loading state
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);  // Set loading state

        try {
            const response = await TeachersApi.getTeachers();
            const teacher = response.data.find(t => t.email === email && t.password === password);
            
            if (teacher) {
                setIsLoggedIn(true);
                setLoading(false);  // End loading state
                setEmail(''); // Reset form fields
                setPassword('');
                navigate('/dashboard', { state: { teacher } });  // Redirect on successful login
            } else {
                setError("Invalid credentials, please try again.");
                setLoading(false);  // End loading state
            }
        } catch (err) {
            setError("Failed to log in. Please try again later.");
            setLoading(false);  // End loading state
        }
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
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                </div>
            ) : (
                <div>Redirecting...</div>  // Optionally you can remove this as navigation is handled immediately
            )}
        </div>
    );
}

export default Login;
