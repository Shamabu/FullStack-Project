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
using static Azure.Core.HttpHeader;

namespace GradeMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly GradeMasterDbContext _context;

        public AttendanceController(GradeMasterDbContext context)
        {
            _context = context;
        }

        // GET: api/Attendance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendance()
        {
            return await _context.Attendance.ToListAsync();
        }

        // GET: api/Attendance/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id)
        {
            var attendance = await _context.Attendance.FindAsync(id);

            if (attendance == null)
            {
                return NotFound();
            }

            return attendance;
        }

        // PUT: api/Attendance/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttendance(int id, Attendance attendance)
        {
            if (id != attendance.Id)
            {
                return BadRequest();
            }

            _context.Entry(attendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendanceExists(id))
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

        // POST: api/Attendance
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attendance>> PostAttendance(AttendanceDTO attendanceDto)
        {
            Attendance attendance = new Attendance()
            {
                Id  = attendanceDto.Id,
                RoomNumber = attendanceDto.RoomNumber,
                Start = attendanceDto.Start,
                Duration = attendanceDto.Duration,
                Status = attendanceDto.Status,
                Notes = attendanceDto.Notes,
                StudentId = attendanceDto.StudentId,
                CourseId = attendanceDto.CourseId
            };
            _context.Attendance.Add(attendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendance", new { id = attendance.Id }, attendance);
        }

        // DELETE: api/Attendance/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            var attendance = await _context.Attendance.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendance.Remove(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/Attendance/student/{studentId}
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendanceByStudentId(int studentId)
        {
            var attendanceRecords = await _context.Attendance
                .Where(a => a.StudentId == studentId)
                .Include(a => a.Course) // Include Course details if you need them
                .ToListAsync();

            if (attendanceRecords == null || !attendanceRecords.Any())
            {
                return NotFound();
            }

            return attendanceRecords;
        }

        private bool AttendanceExists(int id)
        {
            return _context.Attendance.Any(e => e.Id == id);
        }
    }
}
