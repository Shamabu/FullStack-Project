namespace GradeMasterAPI.APiModels
{
    public class CourseDTO
    {
        public int Id { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }
        public int TeacherId { get; set; }
    }
}
