namespace GradeMasterAPI.APiModels
{
    public class AssignmentDTO
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public int Description { get; set; }
        public DateTime DueDate { get; set; }
    }
}
