using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        // GET: api/ExamSubmission/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamSubmission>> GetExamSubmission(int id)
        {
            var examSubmission = await _context.ExamSubmission.FindAsync(id);

            if (examSubmission == null)
            {
                return NotFound($"Exam submission with ID {id} not found.");
            }

            return Ok(examSubmission);
        }

        // GET: api/ExamSubmission/exam/{examId}
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
                    return NotFound($"No submissions found for exam with ID {examId}.");
                }

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/ExamSubmission/{id}
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

            // Update fields
            examSubmission.Grade = examSubmissionDto.Grade;
            examSubmission.Feedback = examSubmissionDto.Feedback;

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

            return NoContent();
        }

        // POST: api/ExamSubmission
        [HttpPost]
        public async Task<ActionResult<ExamSubmission>> PostExamSubmission(ExamSubmissionDTO examSubmissionDto)
        {
            if (string.IsNullOrEmpty(examSubmissionDto.ExamFilePath))
            {
                return BadRequest("The ExamFilePath field is required.");
            }

            if (examSubmissionDto.SubmittionDate == default(DateTime))
            {
                return BadRequest("The SubmittionDate field is required.");
            }

            var examSubmission = new ExamSubmission
            {
                ExamFilePath = examSubmissionDto.ExamFilePath,
                ExamId = examSubmissionDto.ExamId,
                StudentId = examSubmissionDto.StudentId,
                SubmittionDate = examSubmissionDto.SubmittionDate,
                Feedback = examSubmissionDto.Feedback,
                Grade = examSubmissionDto.Grade
            };

            _context.ExamSubmission.Add(examSubmission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExamSubmission", new { id = examSubmission.Id }, examSubmission);
        }

        // DELETE: api/ExamSubmission/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExamSubmission(int id)
        {
            var examSubmission = await _context.ExamSubmission.FindAsync(id);
            if (examSubmission == null)
            {
                return NotFound($"Exam submission with ID {id} not found.");
            }

            _context.ExamSubmission.Remove(examSubmission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Helper method to check if an exam submission exists
        private bool ExamSubmissionExists(int id)
        {
            return _context.ExamSubmission.Any(e => e.Id == id);
        }

        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<ExamSubmission>>> GetSubmissionsByCourseId(int courseId)
        {
            var submissions = await _context.ExamSubmission
                .Where(sub => sub.Exam.CourseId == courseId)
                .ToListAsync();

            if (!submissions.Any())
            {
                return NotFound();
            }

            return Ok(submissions);
        }

    }
}
