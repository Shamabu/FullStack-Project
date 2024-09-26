using GradeMasterAPI.DB.DbModels;

namespace GradeMasterAPI.APiModels
{
    public class ExamDTO
    {
        public int Id { get; set; }
        public string ExamName { get; set; }
        public string ExamDate { get; set; }
        public int Duration { get; set; }
        public string RoomNumber { get; set; }
        public int CourseId { get; set; }
    }
}
