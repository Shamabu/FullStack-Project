import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AttendanceApi from '../ApiCalls/AttendanceApi';
import CourseApi from '../ApiCalls/CourseApi';
import StudentsApi from '../ApiCalls/StudentsApi';
import AssignmentSubmissionApi from '../ApiCalls/AssignmentSubmissionApi';
import ExamSubmissionApi from '../ApiCalls/ExamSubmissionApi';

import './GradesPage.css';

const ATTENDANCE_WEIGHT = 0.1; // 10%
const ASSIGNMENT_WEIGHT = 0.2; // 20%
const EXAM_WEIGHT = 0.7;       // 70%

function GradesPage() {
    const location = useLocation();
    const { teacher } = location.state || {};
    const [courses, setCourses] = useState([]);
    const [gradesData, setGradesData] = useState({});

    useEffect(() => {
        const fetchCoursesAndStudents = async () => {
            try {
                const coursesResponse = await CourseApi.getCoursesByTeacher(teacher?.id);
                const coursesData = coursesResponse.data;
                setCourses(coursesData);

                const newGradesData = {};
                for (const course of coursesData) {
                    const studentsResponse = await StudentsApi.getStudentsByCourseId(course.id);
                    const students = studentsResponse.data;

                    const courseGrades = await Promise.all(students.map(async (student) => {
                        const attendanceGrade = await calculateAttendanceGrade(student.id, course.id);
                        const assignmentsGrade = await calculateAssignmentsGrade(student.id, course.id);
                        const examGrade = await calculateExamGrade(student.id, course.id);

                        const finalGrade = (attendanceGrade * ATTENDANCE_WEIGHT) +
                                           (assignmentsGrade * ASSIGNMENT_WEIGHT) +
                                           (examGrade * EXAM_WEIGHT);

                        return {
                            student,
                            attendanceGrade,
                            assignmentsGrade,
                            examGrade,
                            finalGrade,
                        };
                    }));

                    newGradesData[course.id] = courseGrades;
                }
                setGradesData(newGradesData);
            } catch (error) {
                console.error("Error fetching courses or students:", error);
            }
        };

        if (teacher && teacher.id) {
            fetchCoursesAndStudents();
        }
    }, [teacher]);

    async function calculateAttendanceGrade(studentId, courseId) {
        try {
            const response = await AttendanceApi.getAttendancesByStudentAndCourse(studentId, courseId);
            const attendanceRecords = response.data;

            if (attendanceRecords.length !== 4) return 0;

            const presentCount = attendanceRecords.filter(record => record.status === "Present").length;
            return (presentCount / 4) * 100; // Average attendance grade
        } catch (error) {
            console.error('Error calculating attendance grade:', error);
            return 0;
        }
    }

    async function calculateAssignmentsGrade(studentId, courseId) {
        try {
            const response = await AssignmentSubmissionApi.getSubmissionsByStudentAndCourse(studentId, courseId);
            const submissions = response.data;

            if (submissions.length !== 3) return 0;

            const totalGrade = submissions.reduce((sum, submission) => sum + (submission.grade || 0), 0);
            return totalGrade / 3; // Average assignment grade
        } catch (error) {
            console.error("Error calculating assignments grade:", error);
            return 0;
        }
    }

    async function calculateExamGrade(studentId, courseId) {
        try {
            const response = await ExamSubmissionApi.getSubmissionsByCourseId(courseId);
            const examSubmission = response.data.find(submission => submission.studentId === studentId);

            if (!examSubmission || !examSubmission.grade) return 0;

            return examSubmission.grade; // Average exam grade
        } catch (error) {
            console.error("Error calculating exam grade:", error);
            return 0;
        }
    }

    const saveFinalGrade = (studentId, courseId, finalGrade) => {
        console.log(`Saving final grade ${finalGrade} for student ${studentId} in course ${courseId}`);
    };

    if (!teacher) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grades-container">
            <h2>Grades Overview for {teacher.firstName} {teacher.lastName}</h2>
            {courses.map((course) => (
                <div key={course.id} className="course-card">
                    <h3 className="course-name">{course.name} (Course ID: {course.id})</h3>
                    <table className="grades-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Attendance Grade (Avg %)</th>
                                <th>Assignments Grade (Avg %)</th>
                                <th>Exam Grade (Avg %)</th>
                                <th>Final Grade (Weighted %)</th>
                                <th>Save</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradesData[course.id]?.map((grade) => (
                                <tr key={grade.student.id}>
                                    <td>{grade.student.id}</td>
                                    <td>{grade.student.firstName} {grade.student.lastName}</td>
                                    <td>{grade.attendanceGrade.toFixed(2)}</td>
                                    <td>{grade.assignmentsGrade.toFixed(2)}</td>
                                    <td>{grade.examGrade.toFixed(2)}</td>
                                    <td>{grade.finalGrade.toFixed(2)}</td>
                                    <td>
                                        <button
                                            onClick={() => saveFinalGrade(grade.student.id, course.id, grade.finalGrade)}
                                            disabled={!grade.finalGrade}
                                        >
                                            Save Final Grade
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default GradesPage;
