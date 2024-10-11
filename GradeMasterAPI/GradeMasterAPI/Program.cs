
using GradeMasterAPI.DB;
using GradeMasterAPI.Servieces;
using Microsoft.EntityFrameworkCore;

namespace GradeMasterAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //Register Global DB Service With EF
            builder.Services.AddDbContext<GradeMasterDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=GradeMasterEFDb;Integrated Security=True;Connect Timeout=30;"));
            });

            //TODO ADD Other Services Here .. 
            builder.Services.AddSingleton<ICsvLoader, CsvLoader>();

            //who can enter this api have to be from and header'origin'methid , openedapi
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("openapi",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
            });




            var app = builder.Build();
            using (var scope = app.Services.CreateScope())
            {
                try
                {
                    //Get Registered GradeMasterDbContext Service
                    var services = scope.ServiceProvider;
                    var context = services.GetRequiredService<GradeMasterDbContext>();
                    //Initialize DB
                    DbInitializer.Initialize(context);
                }
                catch (Exception ex)
                {


                }
            }





            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("openapi");

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
