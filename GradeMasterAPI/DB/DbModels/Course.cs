namespace GradeMasterAPI.DB.DbModels
{
    public class Course
    {
        public int Id { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }
        public int TeacherId { get; set; }

        #region --Navigation Properties--
        public Teacher Teacher { get; set; }
        public ICollection<Exam> Exams { get; set; } = new List<Exam>();
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
        public ICollection<Enrollment> Enrollments { get; set;} = new List<Enrollment>();


        #endregion
    }
}
