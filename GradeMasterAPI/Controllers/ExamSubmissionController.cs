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
    public class ExamSubmissionController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public ExamSubmissionController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/ExamSubmission
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamSubmission>>> GetExamSubmission()
        {
            return await _context.ExamSubmission.ToListAsync();
        }

        // GET: api/ExamSubmission/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamSubmission>> GetExamSubmission(int id)
        {
            var examSubmission = await _context.ExamSubmission.FindAsync(id);

            if (examSubmission == null)
            {
                return NotFound();
            }

            return examSubmission;
        }

        // PUT: api/ExamSubmission/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExamSubmission(int id, ExamSubmission examSubmission)
        {
            if (id != examSubmission.Id)
            {
                return BadRequest();
            }

            _context.Entry(examSubmission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamSubmissionExists(id))
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

        // POST: api/ExamSubmission
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ExamSubmission>> PostExamSubmission(ExamSubmissionDTO examSubmissionDto)
        {
            ExamSubmission examSubmission = new ExamSubmission()
            {
                Id = examSubmissionDto.Id,
                ExamFilePath = examSubmissionDto.ExamFilePath,
                ExamId = examSubmissionDto.ExamId,
                StudentId = examSubmissionDto.StudentId,
                SubmittionDate = examSubmissionDto.SubmittionDate,
                Feedback = examSubmissionDto.Feedback,
                Grade = examSubmissionDto.Grade,
            };

            _context.ExamSubmission.Add(examSubmission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExamSubmission", new { id = examSubmission.Id }, examSubmission);
        }

        // DELETE: api/ExamSubmission/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExamSubmission(int id)
        {
            var examSubmission = await _context.ExamSubmission.FindAsync(id);
            if (examSubmission == null)
            {
                return NotFound();
            }

            _context.ExamSubmission.Remove(examSubmission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExamSubmissionExists(int id)
        {
            return _context.ExamSubmission.Any(e => e.Id == id);
        }
    }
}
