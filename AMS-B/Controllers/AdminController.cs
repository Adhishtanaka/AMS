using AMS_B.Models;
using Microsoft.AspNetCore.Mvc;


namespace AMS_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        [HttpPost("BanUser")]
        public async Task<IResult> BanUser(HttpContext httpContext, Dbcon dbcon)
        {
            var request = await httpContext.Request.ReadFromJsonAsync<AdminBanRequest>();
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return Results.BadRequest(new { Message = "Invalid Ban request." });
            }

            bool ban = request.Ban;
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
        }

        [HttpGet("ManageAllUsers")]
        public async Task<IResult> ManageAllUsers(HttpContext httpContext, Dbcon dbcon)
        {
            string nameFilter = httpContext.Request.Query["nameFilter"].ToString();
            Admin admin = new Admin();
            var users = await admin.ManageAllUsers(dbcon, nameFilter);
            return Results.Ok(users);
        }
    }
}