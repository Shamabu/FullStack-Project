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
    public class GradeController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public GradeController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/Grade
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Grade>>> GetGrade()
        {
            return await _context.Grade.ToListAsync();
        }

        // GET: api/Grade/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Grade>> GetGrade(int id)
        {
            var grade = await _context.Grade.FindAsync(id);

            if (grade == null)
            {
                return NotFound();
            }

            return grade;
        }

        // PUT: api/Grade/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrade(int id, Grade grade)
        {
            if (id != grade.Id)
            {
                return BadRequest();
            }

            _context.Entry(grade).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GradeExists(id))
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

        // POST: api/Grade
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Grade>> PostGrade(GradeDTO gradeDto)
        {
            if (!await _context.Course.AnyAsync(c => c.Id == gradeDto.CourseId))
            {
                return BadRequest($"Invalid CourseId: {gradeDto.CourseId}");
            }

            Grade grade = new Grade()
            {
                StudentId = gradeDto.StudentId,
                CourseId = gradeDto.CourseId,
                FinalGrade = gradeDto.FinalGrade,
                SubmissionGrade = gradeDto.SubmissionGrade,
                Attendence = gradeDto.Attendence
            };
            _context.Grade.Add(grade);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGrade", new { id = grade.Id }, grade);
        }


        // DELETE: api/Grade/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGrade(int id)
        {
            var grade = await _context.Grade.FindAsync(id);
            if (grade == null)
            {
                return NotFound();
            }

            _context.Grade.Remove(grade);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GradeExists(int id)
        {
            return _context.Grade.Any(e => e.Id == id);
        }
    }
}
