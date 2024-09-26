namespace GradeMasterAPI.DB.DbModels
{
    public class Exam
    {
        public int Id { get; set; }
        public string ExamName { get; set; }
        public string ExamDate { get; set; }
        public int Duration { get; set; }
        public string RoomNumber { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        ICollection<ExamSubmission> ExamSubmissions { get; set; }




    }
}
