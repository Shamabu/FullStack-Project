import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CourseApi from "./ApiCalls/CourseApi";
import GradeApi from "./ApiCalls/GradeApi";
import StudentsApi from "./ApiCalls/StudentsApi";
import "./StatisticsPage.css";

const StatisticsPage = () => {
  const location = useLocation();
  const { courseId } = location.state || {};

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [statistics, setStatistics] = useState({
    averageGrade: 0,
    highestGrade: 0,
    lowestGrade: 0,
    gradeDistribution: {},
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {
        setErrorMessage("No course ID provided. Please select a valid course.");
        setLoading(false);
        return;
      }

      try {
        // Fetch course details
        const courseResponse = await CourseApi.getCourse(courseId);
        setCourse(courseResponse.data);

        // Fetch students enrolled in the course
        const studentsResponse = await StudentsApi.getStudentsByCourseId(courseId);
        setStudents(studentsResponse.data);

        // Fetch grades for the course
        const gradesResponse = await GradeApi.getGradesByCourse(courseId);

        // Filter grades for enrolled students only
        const filteredGrades = gradesResponse.data.filter((grade) =>
          studentsResponse.data.some((student) => student.id === grade.studentId)
        );
        setGrades(filteredGrades);

        // Calculate statistics
        calculateStatistics(filteredGrades);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage(
          "Failed to fetch data. Please ensure the course and grades exist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const calculateStatistics = (gradesData) => {
    if (!gradesData || gradesData.length === 0) {
      setStatistics({
        averageGrade: 0,
        highestGrade: 0,
        lowestGrade: 0,
        gradeDistribution: {},
      });
      return;
    }
  
    // Filter grades to ensure each student is counted only once
    const uniqueGrades = gradesData.filter(
      (grade, index, self) =>
        self.findIndex((g) => g.studentId === grade.studentId) === index
    );
  
    const totalGrades = uniqueGrades.map((g) => g.finalGrade);
    const highestGrade = Math.max(...totalGrades);
    const lowestGrade = Math.min(...totalGrades);
    const averageGrade = (
      totalGrades.reduce((sum, grade) => sum + grade, 0) / uniqueGrades.length
    ).toFixed(2);
  
    // Calculate grade distribution
    const gradeDistribution = uniqueGrades.reduce((distribution, grade) => {
      const range = `${Math.floor(grade.finalGrade / 10) * 10}-${
        Math.floor(grade.finalGrade / 10) * 10 + 9
      }`;
      if (!distribution[range]) {
        distribution[range] = 0;
      }
      distribution[range] += 1;
      return distribution;
    }, {});
  
    setStatistics({
      averageGrade,
      highestGrade,
      lowestGrade,
      gradeDistribution,
    });
  };
  

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  return (
    <div className="statistics-page">
      <h1>Course Statistics</h1>

      {/* Display Course Details */}
      {course && (
        <div className="course-details">
          <h2>{course.courseName}</h2>
          <p>{course.courseDescription}</p>
        </div>
      )}

      {/* Display General Statistics */}
      <div className="statistics-summary">
        <h2>Statistics Summary</h2>
        <p>
          <strong>Average Grade:</strong> {statistics.averageGrade}
        </p>
        <p>
          <strong>Highest Grade:</strong> {statistics.highestGrade}
        </p>
        <p>
          <strong>Lowest Grade:</strong> {statistics.lowestGrade}
        </p>
      </div>

      {/* Display Grade Distribution */}
      <div className="grade-distribution">
        <h2>Grade Distribution</h2>
        {Object.keys(statistics.gradeDistribution).length > 0 ? (
          <ul>
            {Object.entries(statistics.gradeDistribution).map(
              ([range, count]) => (
                <li key={range}>
                  <strong>{range}:</strong> {count} students
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No grade data available.</p>
        )}
      </div>

      {/* Display Grades Table */}
      <div className="grades-section">
        <h2>Student Grades</h2>
        {students.length > 0 && grades.length > 0 ? (
          <table className="grades-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentGrade = grades.find(
                  (g) => g.studentId === student.id
                );
                return (
                  <tr key={student.id}>
                    <td>{`${student.firstName} ${student.lastName}`}</td>
                    <td>{studentGrade ? studentGrade.finalGrade : "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No students or grades available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
