using Microsoft.EntityFrameworkCore;
using GradeMasterAPI.DB.DbModels;

namespace GradeMasterAPI.DB
{
    public class GradeMasterDbContext:DbContext
    {
        public GradeMasterDbContext(DbContextOptions<GradeMasterDbContext> options):base(options)
        {
            
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=EFDb;Integrated Security=True;Connect Timeout=30;");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public DbSet<DbModels.Student> Students { get; set; }
        public DbSet<DbModels.Teacher> Teacher { get; set; }
        public DbSet<DbModels.Course> Course { get; set; }
        public DbSet<GradeMasterAPI.DB.DbModels.Exam> Exam { get; set; } = default!;
        public DbSet<GradeMasterAPI.DB.DbModels.Grade> Grade { get; set; } = default!;
        public DbSet<GradeMasterAPI.DB.DbModels.ExamSubmission> ExamSubmission { get; set; } = default!;
        public DbSet<GradeMasterAPI.DB.DbModels.Enrollment> Enrollment { get; set; } = default!;
        public DbSet<GradeMasterAPI.DB.DbModels.Assignment> Assignment { get; set; } = default!;
        public DbSet<GradeMasterAPI.DB.DbModels.Attendance> Attendance { get; set; } = default!;
        public DbSet<GradeMasterAPI.DB.DbModels.AssignmentSubmission> AssignmentSubmission { get; set; } = default!;


    }
}
