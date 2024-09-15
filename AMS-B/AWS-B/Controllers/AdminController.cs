using AWS_B.model;

namespace AWS_B
{
    public static class AdminController
    {
        public static async Task<IResult> BanUser(HttpContext httpContext, Dbcon dbcon)
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

        public static async Task<IResult> ManageAllUsers(HttpContext httpContext, Dbcon dbcon)
        {

                string nameFilter = httpContext.Request.Query["nameFilter"].ToString();
                Admin admin = new Admin();
                var users = await admin.ManageAllUsers(dbcon, nameFilter);
                return Results.Ok(users);
        }
    }
}
