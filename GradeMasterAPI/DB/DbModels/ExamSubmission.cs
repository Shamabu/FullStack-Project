namespace GradeMasterAPI.DB.DbModels
{
    public class ExamSubmission
    {
        public int Id { get; set; }
        public string ExamFilePath { get; set; }
        public int ExamId { get; set; }
        public int StudentId { get; set; }
        public DateTime SubmittionDate { get; set; }
        public string Feedback { get; set; }
        public int Grade { get; set; }
        public Exam Exam { get; set; }
        public Student Student { get; set; }
    }
}
