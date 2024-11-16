import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AssignmentApi from '../ApiCalls/AssignmentApi';

const CourseTap = () => {
    const location = useLocation();
    
    const { courseName, courseDescription, courseId } = location.state || {
        courseName: 'No course selected',
        courseDescription: 'No description available',
        courseId: null,
    };

    console.log('Course Details:', { courseName, courseDescription, courseId });

    const [assignments, setAssignments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!courseId) {
                setErrorMessage('Invalid course ID. Cannot fetch assignments.');
                return;
            }

            try {
                console.log(`Fetching assignments for course ID: ${courseId}`);
                const response = await AssignmentApi.getAssignmentsByCourseId(courseId);
                setAssignments(response.data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setErrorMessage('Failed to fetch assignments. Please try again.');
            }
        };

        fetchAssignments();
    }, [courseId]);

    if (!courseId) {
        return <p>Invalid course ID. Please select a valid course.</p>;
    }

    return (
        <div className="course-details-page">
            <h1>{courseName}</h1>
            <section className="course-description">
                <h2>Description</h2>
                <p>{courseDescription}</p>
            </section>

            <section className="course-assignments">
                <h2>Assignments</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {assignments?.length > 0 ? (
                    <ul>
                        {assignments.map((assignment) => (
                            <li key={assignment.id}>
                                <strong>{assignment.title}</strong> - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !errorMessage && <p>No assignments available for this course.</p>
                )}
            </section>
        </div>
    );
};

export default CourseTap;
