namespace GradeMasterAPI.APiModels
{
    public class EnrollmentDTO
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public DateTime EntrollmentDate { get; set; }
        public int FinalGrade { get; set; }
    }
}
