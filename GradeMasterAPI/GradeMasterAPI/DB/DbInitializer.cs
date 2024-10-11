using GradeMasterAPI.DB.DbModels;

namespace GradeMasterAPI.DB
{
    public static class DbInitializer
    {
        public static void Initialize(GradeMasterDbContext dbcontext)
        {
            dbcontext.Database.EnsureCreated();
            if (!dbcontext.Teacher.Any())
            {
                Teacher[] teachers = new Teacher[]
                {
                  new Teacher
                  {
                      FirstName = "Albert",
                      LastName = "Einstein",
                      Email = "albert.einstein@gmail.com",
                      PhoneNumber = "040040401",
                      Password = "123123"

                  },
                  new Teacher
                  {
                      FirstName = "Isaac",
                      LastName = "Newton",
                      Email = "isaac.newton@gmail.com",
                      PhoneNumber = "040040402",
                      Password = "123123"
                  }
                };
                dbcontext.Teacher.Add(teachers[0]);
                dbcontext.Teacher.Add(teachers[1]);
                dbcontext.SaveChanges();
            }
            




        }
    }
}
