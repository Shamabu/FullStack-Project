using GradeMasterAPI.DB;
using GradeMasterAPI.DB.DbModels;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GradeMasterAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        // GET: api/<StudentsController>
        [HttpGet]
        public IActionResult Get()
        {
            StudentsRepository studentsRepo = new StudentsRepository();
            List<Student> students = studentsRepo.GetAllStudents();
            return Ok(students);
        }

        // GET api/Students/5

        [HttpGet("{id}")]
        public ActionResult<Student> GetDetails(int id)
        {
            StudentsRepository studentsRepo = new StudentsRepository();
            Student student = studentsRepo.GetStudent(id);
            if (student != null)
            {
                return Ok(student);
            }
            else
            {
                return BadRequest("Student Not Found");
            }
        }

        // POST api/<StudentsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Student studentInput)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                StudentsRepository studentRepo = new StudentsRepository();
                string error = await studentRepo.InsertStudentAsync(studentInput);

                if (string.IsNullOrEmpty(error))
                {
                    return Ok("Student inserted successfully.");
                }
                else
                {
                    return BadRequest(error);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
            }
        }


        // PUT api/<StudentsController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Student studentInput)
        {
            StudentsRepository studentRepo = new StudentsRepository();
            string error = studentRepo.UpdateStudent(id, studentInput);
            if (error == string.Empty)
            {
                return Ok("Updated");
            }
            return Ok(error);
        }

        // DELETE api/<StudentsController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            StudentsRepository studentsRepo = new StudentsRepository();
            string error = studentsRepo.DeleteStudent(id);
            if (error != null)
            {
                return Ok("Deleted!");
            }
            else
            {
                return BadRequest("Student Not Found");
            }
        }
    }
}
