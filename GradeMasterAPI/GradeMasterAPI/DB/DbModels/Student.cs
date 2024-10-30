namespace GradeMasterAPI.DB.DbModels
{
    public class Student
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateBirth { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string Adress { get; set; }
        public string Email { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; } 
        public ICollection<AssignmentSubmission> AssignmentSubmissions { get; set; }
        public ICollection<ExamSubmission> ExamSubmissions { get; set; }
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<Grade> FinalGrades {  get; set; }
    }
}
