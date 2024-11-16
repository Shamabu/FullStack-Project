import React, { useState } from "react";
import TeachersApi from "../ApiCalls/TeachersApi";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await TeachersApi.getTeachers();
            const teacher = response.data.find(
                (t) => t.email === email && t.password === password
            );

            if (teacher) {
                setIsLoggedIn(true);
                setLoading(false);
                setEmail("");
                setPassword("");
                navigate("/dashboard", { state: { teacher } });
            } else {
                setError("Invalid credentials, please try again.");
                setLoading(false);
            }
        } catch (err) {
            setError("Failed to log in. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="background-decor">
                <img src="/assets/classroom.png" alt="Classroom Background" />
            </div>
            <div className="login-box">
                <h1 className="login-header">Welcome Back!</h1>
                <p className="login-subtext">Ready to learn something new?</p>
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
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
}

export default Login;
