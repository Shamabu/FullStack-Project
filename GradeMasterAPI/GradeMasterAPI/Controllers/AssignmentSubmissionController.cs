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
    public class AssignmentSubmissionController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public AssignmentSubmissionController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/AssignmentSubmission
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetAssignmentSubmissions()
        {
            try
            {
                var submissions = await _context.AssignmentSubmission.ToListAsync();
                if (submissions == null || !submissions.Any())
                {
                    return NotFound("No submissions found.");
                }
                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // GET: api/AssignmentSubmission/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssignmentSubmission>> GetAssignmentSubmission(int id)
        {
            try
            {
                var assignmentSubmission = await _context.AssignmentSubmission.FindAsync(id);

                if (assignmentSubmission == null)
                {
                    return NotFound($"Submission with ID {id} not found.");
                }

                return Ok(assignmentSubmission);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/AssignmentSubmission/assignment/5
        [HttpGet("assignment/{assignmentId}")]
        public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetSubmissionsByAssignmentId(int assignmentId)
        {
            try
            {
                var submissions = await _context.AssignmentSubmission
                    .Where(submission => submission.AssignmentId == assignmentId)
                    .ToListAsync();

                if (submissions == null || !submissions.Any())
                {
                    return NotFound("No submissions found for this assignment.");
                }

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // PUT: api/AssignmentSubmission/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssignmentSubmission(int id, [FromBody] AssignmentSubmissionDTO updatedSubmissionDto)
        {
            if (updatedSubmissionDto == null)
            {
                return BadRequest("Invalid submission data.");
            }

            try
            {
                var existingSubmission = await _context.AssignmentSubmission.FindAsync(id);
                if (existingSubmission == null)
                {
                    return NotFound($"Submission with ID {id} not found.");
                }

                // Only update the fields that are provided in the request body
                existingSubmission.Grade = updatedSubmissionDto.Grade;
                existingSubmission.Feedback = updatedSubmissionDto.Feedback;

                // Mark the entry as modified
                _context.Entry(existingSubmission).State = EntityState.Modified;

                // Save changes to the database
                await _context.SaveChangesAsync();

                return NoContent(); // Successfully updated
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return StatusCode(500, $"Concurrency error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/AssignmentSubmission
        [HttpPost]
        public async Task<ActionResult<AssignmentSubmission>> CreateAssignmentSubmission([FromBody] AssignmentSubmissionDTO assignmentSubmissionDto)
        {
            if (assignmentSubmissionDto == null)
            {
                return BadRequest("Invalid data.");
            }

            var assignmentSubmission = new AssignmentSubmission()
            {
                FilePath = assignmentSubmissionDto.FilePath,
                AssignmentId = assignmentSubmissionDto.AssignmentId,
                StudentId = assignmentSubmissionDto.StudentId,
                SubmittionDate = assignmentSubmissionDto.SubmittionDate,
                Feedback = assignmentSubmissionDto.Feedback,
                Grade = assignmentSubmissionDto.Grade
            };

            try
            {
                _context.AssignmentSubmission.Add(assignmentSubmission);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAssignmentSubmission), new { id = assignmentSubmission.Id }, assignmentSubmission);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/AssignmentSubmission/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignmentSubmission(int id)
        {
            try
            {
                var assignmentSubmission = await _context.AssignmentSubmission.FindAsync(id);
                if (assignmentSubmission == null)
                {
                    return NotFound($"Submission with ID {id} not found.");
                }

                _context.AssignmentSubmission.Remove(assignmentSubmission);
                await _context.SaveChangesAsync();

                return NoContent(); // Successfully deleted
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/AssignmentSubmission/all
        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllSubmissions()
        {
            try
            {
                var submissions = await _context.AssignmentSubmission.ToListAsync();
                if (!submissions.Any())
                {
                    return NotFound("No submissions found to delete.");
                }

                _context.AssignmentSubmission.RemoveRange(submissions);
                await _context.SaveChangesAsync();

                return Ok("All submissions have been deleted.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to check if submission exists
        private bool AssignmentSubmissionExists(int id)
        {
            return _context.AssignmentSubmission.Any(e => e.Id == id);
        }
        // GET: api/AssignmentSubmission/course/5
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetSubmissionsByCourseId(int courseId)
        {
            try
            {
                var submissions = await _context.AssignmentSubmission
                    .Include(submission => submission.Assignment) // Include the Assignment to access CourseId
                    .Where(submission => submission.Assignment.CourseId == courseId)
                    .ToListAsync();

                if (submissions == null || !submissions.Any())
                {
                    return NotFound($"No submissions found for course with ID {courseId}.");
                }

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("student/{studentId}/course/{courseId}")]
        public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetSubmissionsByStudentAndCourse(int studentId, int courseId)
        {
            var submissions = await _context.AssignmentSubmission
                .Where(sub => sub.StudentId == studentId && sub.Assignment.CourseId == courseId)
                .ToListAsync();

            if (!submissions.Any())
            {
                return NotFound();
            }

            return Ok(submissions);
        }


    }
}
