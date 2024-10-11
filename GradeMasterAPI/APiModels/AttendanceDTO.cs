namespace GradeMasterAPI.APiModels
{
    public class AttendanceDTO
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public DateTime Start { get; set; }
        public int Duration { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
    }
}
