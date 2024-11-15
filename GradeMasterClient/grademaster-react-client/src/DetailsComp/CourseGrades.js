import React, { useEffect, useState } from 'react';
import AttendanceApi from '../ApiCalls/AttendanceApi';
import StudentsApi from '../ApiCalls/StudentsApi';
import AssignmentSubmissionApi from '../ApiCalls/AssignmentSubmissionApi';
import ExamSubmissionApi from '../ApiCalls/ExamSubmissionApi';

const ATTENDANCE_WEIGHT = 0.1; // 10%
const ASSIGNMENT_WEIGHT = 0.2; // 20%
const EXAM_WEIGHT = 0.7;       // 70%

function CourseGrades({ courseId }) {
    const [students, setStudents] = useState([]);
    const [gradesData, setGradesData] = useState([]);

    useEffect(() => {
        const fetchStudentsAndGrades = async () => {
            try {
                const studentsResponse = await StudentsApi.getStudentsByCourseId(courseId);
                const studentsData = studentsResponse.data;
                setStudents(studentsData);

                const grades = await Promise.all(studentsData.map(async (student) => {
                    const attendanceGrade = await calculateAttendanceGrade(student.id, courseId);
                    const assignmentsGrade = await calculateAssignmentsGrade(student.id, courseId);
                    const examGrade = await calculateExamGrade(student.id, courseId);

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

                setGradesData(grades);
            } catch (error) {
                console.error("Error fetching students or grades:", error);
            }
        };

        if (courseId) {
            fetchStudentsAndGrades();
        }
    }, [courseId]);

    async function calculateAttendanceGrade(studentId, courseId) {
        try {
            const response = await AttendanceApi.getAttendancesByStudentAndCourse(studentId, courseId);
            const attendanceRecords = response.data;

            if (attendanceRecords.length !== 4) return 0;

            const presentCount = attendanceRecords.filter(record => record.status === "Present").length;
            return (presentCount / 4) * 100;
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
            return totalGrade / 3;
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

            return examSubmission.grade;
        } catch (error) {
            console.error("Error calculating exam grade:", error);
            return 0;
        }
    }

    return (
        <div>
            <h4>Grades for Course ID: {courseId}</h4>
            <table className="grades-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Attendance Grade</th>
                        <th>Assignments Grade</th>
                        <th>Exam Grade</th>
                        <th>Final Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {gradesData.map((grade) => (
                        <tr key={grade.student.id}>
                            <td>{grade.student.id}</td>
                            <td>{grade.student.firstName} {grade.student.lastName}</td>
                            <td>{grade.attendanceGrade.toFixed(2)}</td>
                            <td>{grade.assignmentsGrade.toFixed(2)}</td>
                            <td>{grade.examGrade.toFixed(2)}</td>
                            <td>{grade.finalGrade.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseGrades;
