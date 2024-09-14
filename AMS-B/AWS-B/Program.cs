using AWS_B.model;
namespace AWS_B
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSingleton<Dbcon>();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", builder => builder.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader());
            });

            var app = builder.Build();
            app.UseCors("AllowReactApp");

            app.MapPost("/api/login", async (HttpContext httpContext, Dbcon dbcon) =>
            {
                var request = await httpContext.Request.ReadFromJsonAsync<UserLoginRequest>();
                if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return Results.BadRequest(new { Message = "Invalid login request." });
                }
                User user;
                var userrole = await User.checkjobRole(dbcon, request.Email);

                if (userrole == "Buyer")
                {
                    user = new Buyer { Email = request.Email, Password = request.Password };
                }
                else
                {
                    user = new Seller { Email = request.Email, Password = request.Password };
                }

                var token = await user.Login(dbcon);
                if (token != null)
                {
                    return Results.Ok(new { AccessToken = token });
                }
                else
                {
                    return Results.Unauthorized();
                }

            });

            app.MapPost("/api/register", async (HttpContext httpContext, Dbcon dbcon) =>
            {
                var request = await httpContext.Request.ReadFromJsonAsync<UserRegisterRequest>();
                if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Telephone) || string.IsNullOrEmpty(request.Address) || string.IsNullOrEmpty(request.Role))
                {
                    return Results.BadRequest(new { Message = "Invalid Register request." });
                }

                User user = request.Role.ToLower() switch
                {
                    "seller" => new Seller(),
                    "buyer" => new Buyer(),
                    _ => throw new ArgumentException("Invalid role specified")
                };

                user.Name = request.Name;
                user.Email = request.Email;
                user.Password = request.Password;
                user.Telephone = request.Telephone;
                user.Address = request.Address;

                bool success = await user.Register(dbcon);
                if (success)
                {
                    return Results.Ok(new { Message = "Registration success" });
                }
                else
                {
                    return Results.BadRequest(new { Message = "Registration failed." });
                }
            });

            app.MapGet("/api/validate-token", (HttpContext context) =>
            {
                var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var isValid = User.ValidateToken(token);
                return Results.Ok(isValid);
            });

            app.MapPut("/api/Admin/BanUser", async (HttpContext httpContext, Dbcon dbcon) =>
            {
                var request = await httpContext.Request.ReadFromJsonAsync<AdminBanRequest>();
                if (request == null || string.IsNullOrEmpty(request.Email))
                {
                    return Results.BadRequest(new { Message = "Invalid Ban request." });
                }

                // Determine if we are banning or unbanning the user
                bool ban = request.Ban; // Add this field in the AdminBanRequest model

                Admin admin = new Admin();
                admin.Email = request.Email;
                bool success = await admin.BanUser(dbcon, ban);
                if (success)
                {
                    return Results.Ok(new { Message = ban ? "User Banned successfully" : "User Unbanned successfully" });
                }
                else
                {
                    return Results.BadRequest(new { Message = ban ? "User Ban failed." : "User Unban failed." });
                }
            });

            app.MapGet("/api/Admin/ManageAllUsers", async (HttpContext httpContext, Dbcon dbcon) =>
            {
                try
                {
                    Admin admin = new Admin();
                    var users = await admin.ManageAllUsers(dbcon);
                    return Results.Ok(users);
                }
                catch (Exception ex)
                {
                    // Log the exception (optional) and handle it as needed
                    return Results.BadRequest(new { Message = ex.Message });
                }
            });

            app.Run();
        }
    }
}

