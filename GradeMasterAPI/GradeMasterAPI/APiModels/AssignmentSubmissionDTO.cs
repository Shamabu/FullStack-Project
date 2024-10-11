namespace GradeMasterAPI.APiModels
{
    public class AssignmentSubmissionDTO
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public DateTime SubmittionDate { get; set; }
        public string Feedback { get; set; }
        public int Grade { get; set; }

    }
}
