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

            // Configure Swagger for OpenAPI documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Register Global DB Service with EF
            builder.Services.AddDbContext<GradeMasterDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=GradeMasterEFDb;Integrated Security=True;Connect Timeout=30;"));
            });

            // Add other services here
            builder.Services.AddSingleton<ICsvLoader, CsvLoader>();

            // Configure CORS policy for open API
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

            // Ensure the database is initialized and ready
            using (var scope = app.Services.CreateScope())
            {
                try
                {
                    // Get registered GradeMasterDbContext service
                    var services = scope.ServiceProvider;
                    var context = services.GetRequiredService<GradeMasterDbContext>();
                    // Initialize DB
                    DbInitializer.Initialize(context);
                }
                catch (Exception ex)
                {
                    // Log the error if DB initialization fails
                    var logger = app.Services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while initializing the DB.");
                }
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Enable HTTPS redirection and CORS policy
            app.UseHttpsRedirection();
            app.UseCors("openapi");

            app.UseAuthorization();

            // Map controller routes
            app.MapControllers();

            // Run the app
            app.Run();
        }
    }
}
