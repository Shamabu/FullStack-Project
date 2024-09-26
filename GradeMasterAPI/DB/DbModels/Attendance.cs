namespace GradeMasterAPI.DB.DbModels
{
    public class Attendance
    {
        public int Id { get; set; } 
        public string RoomNumber { get; set; }  
        public DateTime Start {  get; set; }
        public int Duration { get; set; }
        public string Status { get; set; } 
        public string Notes { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public Student Student { get; set; }
        public Course Course { get; set; }


    }
}
