// src/Comps/SignIn.js
import React, { useState } from 'react';
import './SignIn.css';

const SignIn = ({onAddUser}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');

    const handleSubmit = (event) => {
        event.preventDefault();
        onAddUser({email,password,userType});
        // Handle sign-in logic here
        console.log(`Email: ${email}, Password: ${password}, User Type: ${userType}`);
    };
    

    return (
        <div className="sign-in-container">
            <h2>Grade Master Sign In</h2>
            <form onSubmit={handleSubmit} className="sign-in-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userType">Sign in as:</label>
                    <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
