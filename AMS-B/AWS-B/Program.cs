using AWS_B.model;
namespace AWS_B
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSingleton<Dbcon>();
            var app = builder.Build();

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
                app.Run();


        }
    }
}
