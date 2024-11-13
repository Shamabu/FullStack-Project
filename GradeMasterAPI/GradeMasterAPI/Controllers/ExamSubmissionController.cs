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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExamSubmission(int id, ExamSubmissionDTO examSubmissionDto)
        {
            if (id != examSubmissionDto.Id)
            {
                return BadRequest("ID mismatch.");
            }

            var examSubmission = await _context.ExamSubmission.FindAsync(id);
            if (examSubmission == null)
            {
                return NotFound($"Exam submission with ID {id} not found.");
            }

            // Validate required fields and proceed with the update
            examSubmission.Grade = examSubmissionDto.Grade;
            examSubmission.Feedback = examSubmissionDto.Feedback;

            // Optional: Update ExamFilePath and SubmittionDate if needed
            if (!string.IsNullOrEmpty(examSubmissionDto.ExamFilePath))
            {
                examSubmission.ExamFilePath = examSubmissionDto.ExamFilePath;
            }

            if (examSubmissionDto.SubmittionDate != default(DateTime))
            {
                examSubmission.SubmittionDate = examSubmissionDto.SubmittionDate;
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

            return NoContent(); // Return NoContent when the update is successful
        }

        // POST: api/ExamSubmission
        [HttpPost]
        public async Task<ActionResult<ExamSubmission>> PostExamSubmission(ExamSubmissionDTO examSubmissionDto)
        {
            // Validation for required fields
            if (string.IsNullOrEmpty(examSubmissionDto.ExamFilePath))
            {
                return BadRequest("The ExamFilePath field is required.");
            }

            if (examSubmissionDto.SubmittionDate == default(DateTime))
            {
                return BadRequest("The SubmittionDate field is required.");
            }

            ExamSubmission examSubmission = new ExamSubmission()
            {
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

        // Helper method to check if exam submission exists
        private bool ExamSubmissionExists(int id)
        {
            return _context.ExamSubmission.Any(e => e.Id == id);
        }

        // GET: api/ExamSubmission/exam/5
        [HttpGet("exam/{examId}")]
        public async Task<ActionResult<IEnumerable<ExamSubmission>>> GetSubmissionsByExamId(int examId)
        {
            try
            {
                var submissions = await _context.ExamSubmission
                    .Where(submission => submission.ExamId == examId)
                    .ToListAsync();

                if (submissions == null || !submissions.Any())
                {
                    return NotFound("No submissions found for this exam.");
                }

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
