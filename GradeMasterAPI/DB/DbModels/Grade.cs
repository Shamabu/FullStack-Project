namespace GradeMasterAPI.DB.DbModels
{
    public class Grade
    {
        public int Id { get; set; } 
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int FinalGrade {  get; set; }
        public int SubmissionGrade {  get; set; }
        public float Attendence {  get; set; }
        public Student Student { get; set; }
        public Course Course { get; set; }

    }
}
