using GradeMasterAPI.DB.DbModels;
using System.Data.SqlClient;

namespace GradeMasterAPI.DB
{
    public class StudentsRepository
    {
        private readonly string _connectionString;

        public StudentsRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public StudentsRepository()
        {
            _connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=EFDb;Integrated Security=True;Connect Timeout=30;";
        }
        public List<Student> GetAllStudents()
        {
            List<Student> students = new List<Student>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var query = "SELECT * FROM Students";
                var command = new SqlCommand("SELECT * FROM Student", conn);
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        students.Add(new Student
                        {
                            Id = reader.GetInt32(0),
                            FirstName = reader.GetString(1),
                            LastName = reader.GetString(2),
                            DateBirth = reader.GetDateTime(3),
                            Gender = reader.GetString(4),
                            PhoneNumber = reader.GetString(5),
                            Adress = reader.GetString(6),
                            Email = reader.GetString(7),
                            EnrollmentDate = reader.GetDateTime(8)

                        });
                    }
                }
                return students;
            }
        }
        public Student? GetStudent(int id)
        {
            Student student = null;
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    conn.Open();
                    using (SqlCommand command = new SqlCommand("SELECT * FROM Student WHERE Id = @Id", conn))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                student = new Student
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    DateBirth = reader.GetDateTime(reader.GetOrdinal("DateBirth")),
                                    Gender = reader.GetString(reader.GetOrdinal("Gender")),
                                    PhoneNumber = reader.GetString(reader.GetOrdinal("PhoneNumber")),
                                    Adress = reader.GetString(reader.GetOrdinal("Adress")),
                                    Email = reader.GetString(reader.GetOrdinal("Email")),
                                    EnrollmentDate = reader.GetDateTime(reader.GetOrdinal("EnrollmentDate"))
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
            }
            return student;
        }


        public async Task<string> InsertStudentAsync(Student studentToInsert)
        {
            string errors = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    string query = "INSERT INTO Student (FirstName, LastName, DateBirth, Gender, PhoneNumber, Adress, Email, EnrollmentDate) " +
                                   "VALUES (@FirstName, @LastName, @DateBirth, @Gender, @PhoneNumber, @Adress, @Email, @EnrollmentDate)";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@FirstName", studentToInsert.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", studentToInsert.LastName);
                        cmd.Parameters.AddWithValue("@DateBirth", studentToInsert.DateBirth);
                        cmd.Parameters.AddWithValue("@Gender", studentToInsert.Gender);
                        cmd.Parameters.AddWithValue("@PhoneNumber", studentToInsert.PhoneNumber);
                        cmd.Parameters.AddWithValue("@Adress", studentToInsert.Adress);
                        cmd.Parameters.AddWithValue("@Email", studentToInsert.Email);
                        cmd.Parameters.AddWithValue("@EnrollmentDate", studentToInsert.EnrollmentDate);

                        await conn.OpenAsync();

                        int affectedRows = await cmd.ExecuteNonQueryAsync();

                        if (affectedRows == 0)
                        {
                            errors = "Insert operation did not affect any rows.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                errors = "Exception: " + ex.Message;
            }
            return errors;
        }



        public string UpdateStudent(int id, Student updatedStudent)
        {
            string errors = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    string query = "UPDATE Student SET FirstName = @FirstName, LastName = @LastName, DateBirth = @DateBirth, " +
                                   "Gender = @Gender, PhoneNumber = @PhoneNumber, Adress = @Adress, Email = @Email, EnrollmentDate = @EnrollmentDate " +
                                   "WHERE Id = @Id";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);
                        cmd.Parameters.AddWithValue("@FirstName", updatedStudent.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", updatedStudent.LastName);
                        cmd.Parameters.AddWithValue("@DateBirth", updatedStudent.DateBirth);
                        cmd.Parameters.AddWithValue("@Gender", updatedStudent.Gender);
                        cmd.Parameters.AddWithValue("@PhoneNumber", updatedStudent.PhoneNumber);
                        cmd.Parameters.AddWithValue("@Adress", updatedStudent.Adress);
                        cmd.Parameters.AddWithValue("@Email", updatedStudent.Email);
                        cmd.Parameters.AddWithValue("@EnrollmentDate", updatedStudent.EnrollmentDate);

                        conn.Open();
                        int affectedRows = cmd.ExecuteNonQuery();

                        if (affectedRows == 1)
                        {
                            errors = "Update successful";
                        }
                        else
                        {
                            errors = "Update failed: No records were updated or multiple records were updated";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Exception handling
                errors = "Exception: " + ex.Message;
            }
            return errors;
        }


        public String DeleteStudent(int id)
        {
            string errors = "";
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    string query = "DELETE FROM Student WHERE Id = @Id";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);

                        conn.Open();
                        int affectedRows = cmd.ExecuteNonQuery();
                        if (affectedRows == 0)
                        {
                            errors = "No student found with the provided ID.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                errors = "Exception: " + ex.Message;
            }
            return errors;
        }
    }
}