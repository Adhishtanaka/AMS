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
                options.AddPolicy("AllowReactApp", builder => builder
                    .WithOrigins("http://localhost:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            var app = builder.Build();
            app.UseCors("AllowReactApp");

            app.MapPost("/api/login", AuthenticationController.Login);
            app.MapPost("/api/register", AuthenticationController.Register);
            app.MapGet("/api/validate-token", AuthenticationController.ValidateToken);
            app.MapPut("/api/Admin/BanUser", AdminController.BanUser);
            app.MapGet("/api/Admin/ManageAllUsers", AdminController.ManageAllUsers);
            app.MapGet("/api/seller/cars", SellerController.GetCarsBySellerId);
            app.MapGet("/api/seller/auctions", SellerController.GetAuctionsBySellerId);
            app.MapDelete("/api/seller/car/delete", SellerController.DeleteCar);
            app.MapPut("/api/seller/car/update", SellerController.UpdateCar);
            app.MapPost("/api/seller/auction/create", SellerController.CreateAuction);
            app.MapDelete("/api/seller/auction/delete", SellerController.DeleteAuction);
            app.MapPut("/api/seller/auction/update", SellerController.UpdateAuction);

            app.Run();
        }
    }
}
