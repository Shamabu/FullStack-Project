import React from 'react';
import { useLocation } from 'react-router-dom'; 
import Navbar from './Navbar';
import './Details.css';

function Details() {
    const location = useLocation(); 
    const { courseName, teacherName } = location.state || {}; 

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h2>Course Management</h2>
                
                {/* Always display General Information */}
                <div className="row">
                    <div className="col-md-12">
                        <h3>General</h3>
                        <div className="alert alert-primary">
                            <p>
                                Course name: {courseName || "No course selected"}<br />
                                Instructor: {teacherName || "No instructor selected"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs for different sections */}
                <div className="row">
                    <div className="col-md-12">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a className="nav-link active" id="home-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Course</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Participants</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" id="grades-tab" data-bs-toggle="tab" href="#grades" role="tab" aria-controls="grades" aria-selected="false">Grades</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="nav-link" id="competencies-tab" data-bs-toggle="tab" href="#competencies" role="tab" aria-controls="competencies" aria-selected="false">Competencies</a>
                            </li>
                        </ul>

                        {/* Display the content according to the selected tab */}
                        <div className="tab-content mt-3" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <h4>Course Details</h4>
                                <p>Details of the course will go here.</p>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <h4>Participants</h4>
                                <p>List of participants will go here.</p>
                            </div>
                            <div className="tab-pane fade" id="grades" role="tabpanel" aria-labelledby="grades-tab">
                                <h4>Grades</h4>
                                <p>Grade management will go here.</p>
                            </div>
                            <div className="tab-pane fade" id="competencies" role="tabpanel" aria-labelledby="competencies-tab">
                                <h4>Competencies</h4>
                                <p>Competency details will go here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
