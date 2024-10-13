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
            return await _context.Students
                                 .Include(s => s.Enrollments)
                                 .Include(s => s.AssignmentSubmissions)
                                 .Include(s => s.ExamSubmissions)
                                 .Include(s => s.Attendances)
                                 .Include(s => s.FinalGrades)
                                 .ToListAsync();
        }

        // GET: api/Student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students
                                         .Include(s => s.Enrollments)
                                         .Include(s => s.AssignmentSubmissions)
                                         .Include(s => s.ExamSubmissions)
                                         .Include(s => s.Attendances)
                                         .Include(s => s.FinalGrades)
                                         .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        // POST: api/Student
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(StudentsDTO studentDto)
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
