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
        public async Task<ActionResult<IEnumerable<AssignmentSubmission>>> GetAssignmentSubmission()
        {
            return await _context.AssignmentSubmission.ToListAsync();
        }

        // GET: api/AssignmentSubmission/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssignmentSubmission>> GetAssignmentSubmission(int id)
        {
            var assignmentSubmission = await _context.AssignmentSubmission.FindAsync(id);

            if (assignmentSubmission == null)
            {
                return NotFound();
            }

            return assignmentSubmission;
        }

        // PUT: api/AssignmentSubmission/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssignmentSubmission(int id, AssignmentSubmission assignmentSubmission)
        {
            if (id != assignmentSubmission.Id)
            {
                return BadRequest();
            }

            _context.Entry(assignmentSubmission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssignmentSubmissionExists(id))
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

        // POST: api/AssignmentSubmission
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AssignmentSubmission>> PostAssignmentSubmission(AssignmentSubmissionDTO assignmentSubmissionDto)
        {
            AssignmentSubmission assignmentSubmission = new AssignmentSubmission()
            { 
                Id = assignmentSubmissionDto.Id,
                FilePath = assignmentSubmissionDto.FilePath,
                AssignmentId = assignmentSubmissionDto.AssignmentId,
                StudentId = assignmentSubmissionDto.StudentId,
                SubmittionDate = assignmentSubmissionDto.SubmittionDate,
                Feedback = assignmentSubmissionDto.Feedback,
                Grade = assignmentSubmissionDto.Grade

            };
            _context.AssignmentSubmission.Add(assignmentSubmission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssignmentSubmission", new { id = assignmentSubmission.Id }, assignmentSubmission);
        }

        // DELETE: api/AssignmentSubmission/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignmentSubmission(int id)
        {
            var assignmentSubmission = await _context.AssignmentSubmission.FindAsync(id);
            if (assignmentSubmission == null)
            {
                return NotFound();
            }

            _context.AssignmentSubmission.Remove(assignmentSubmission);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssignmentSubmissionExists(int id)
        {
            return _context.AssignmentSubmission.Any(e => e.Id == id);
        }
    }
}
