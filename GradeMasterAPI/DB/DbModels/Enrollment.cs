namespace GradeMasterAPI.DB.DbModels
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public DateTime EntrollmentDate { get; set; }
        public int FinalGrade { get; set; }
        public Student Student { get; set; }
        public Course Course { get; set; }


    }
}
