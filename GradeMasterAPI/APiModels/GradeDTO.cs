namespace GradeMasterAPI.APiModels
{
    public class GradeDTO
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int FinalGrade { get; set; }
        public int SubmissionGrade { get; set; }
        public float Attendence { get; set; }
    }
}
