namespace GradeMasterAPI.APiModels
{
    public class ExamSubmissionDTO
    {
        public int Id { get; set; }
        public string ExamFilePath { get; set; }
        public int ExamId { get; set; }
        public int StudentId { get; set; }
        public DateTime SubmittionDate { get; set; }
        public string Feedback { get; set; }
        public int Grade { get; set; }
    }
}
