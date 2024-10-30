using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GradeMasterAPI.APiModels;

namespace GradeMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public StudentController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/Student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.ToListAsync();
        }

        // GET: api/Student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var Student = await _context.Students.FindAsync(id);//SELECT WHERE

            if (Student == null)
            {
                return NotFound();
            }

            return Student;
        }

            // POST: api/Student
        [HttpPost]
            public async Task<ActionResult<Student>> PostTeacher(StudentsDTO studentDto)
            {
                Student student = new Student()
                {
                    Id = studentDto.Id,
                    FirstName = studentDto.FirstName,
                    LastName = studentDto.LastName,
                    DateBirth = studentDto.DateBirth,
                    Gender = studentDto.Gender,
                    PhoneNumber = studentDto.PhoneNumber,
                    Adress = studentDto.Adress,
                    Email = studentDto.Email,
                    EnrollmentDate = studentDto.EnrollmentDate
                };
                _context.Students.Add(student);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetStudent", new { id = student.Id }, student);
            }

        // PUT: api/Student/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            if (id != student.Id)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudentsByCourseId(int courseId)
        {
            // Assuming there is an Enrollment or a relationship that links Students to Courses
            var students = await _context.Enrollment
                                         .Where(e => e.CourseId == courseId)
                                         .Select(e => e.Student)  // Assuming Enrollment has a navigation property 'Student'
                                         .ToListAsync();

            if (students == null || students.Count == 0)
            {
                return NotFound($"No students found for course with ID {courseId}.");
            }

            return Ok(students);
        }

        // DELETE: api/Student/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
