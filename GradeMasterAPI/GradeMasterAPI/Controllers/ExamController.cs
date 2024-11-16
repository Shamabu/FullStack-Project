using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModels;
using GradeMasterAPI.APiModels;

namespace GradeMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public ExamController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/Exam
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exam>>> GetExam()
        {
            return await _context.Exam.ToListAsync();
        }

        // GET: api/Exam/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Exam>> GetExam(int id)
        {
            var exam = await _context.Exam.FindAsync(id);

            if (exam == null)
            {
                return NotFound();
            }

            return exam;
        }

        // PUT: api/Exam/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExam(int id, Exam exam)
        {
            if (id != exam.Id)
            {
                return BadRequest();
            }

            _context.Entry(exam).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Exam
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Exam>> PostExam(ExamDTO examDto)
        {
            Exam exam = new Exam()
            {
                Id = examDto.Id,
                ExamName = examDto.ExamName,
                ExamDate = examDto.ExamDate,
                Duration = examDto.Duration,
                RoomNumber = examDto.RoomNumber,
                CourseId = examDto.CourseId
            };
           

            _context.Exam.Add(exam);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExam", new { id = exam.Id }, exam);
        }

        // DELETE: api/Exam/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exam.FindAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            _context.Exam.Remove(exam);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExamExists(int id)
        {
            return _context.Exam.Any(e => e.Id == id);
        }

        // GET: api/Exam/teacher/{teacherId}
        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Exam>>> GetExamsByTeacher(int teacherId)
        {
            var exams = await _context.Exam
                .Where(exam => exam.Course.TeacherId == teacherId)
                .ToListAsync();

            if (!exams.Any())
            {
                return NotFound("No exams found for this teacher.");
            }

            return Ok(exams);
        }
        // GET: api/Exam/course/{courseId}
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetExamsByCourse(int courseId)
        {
            var exams = await _context.Exam
                .Where(e => e.CourseId == courseId)
                .Select(e => new {
                    e.Id,
                    e.ExamName,
                    e.ExamDate 
                }).ToListAsync();

            return Ok(exams);
        }





    }
}
