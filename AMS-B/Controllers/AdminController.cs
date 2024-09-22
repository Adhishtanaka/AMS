using AMS_B.Models;
using Microsoft.AspNetCore.Mvc;

namespace AMS_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly Dbcon _dbcon;

        public AdminController(Dbcon dbcon)
        {
            _dbcon = dbcon;
        }

        [HttpPut("BanUser")] 
        public async Task<IActionResult> BanUser([FromBody] AdminBanRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { Message = "Invalid Ban request." });
            }

            try
            {
                Admin admin = new Admin { Email = request.Email };
                bool success = await admin.BanUser(_dbcon, request.Ban);

                if (success)
                {
                    return Ok(new { Message = request.Ban ? "User Banned successfully" : "User Unbanned successfully" });
                }
                else
                {
                    return BadRequest(new { Message = request.Ban ? "User Ban failed." : "User Unban failed." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing the ban request.", Error = ex.Message });
            }
        }

        [HttpGet("ManageAllUsers")]
        public async Task<IActionResult> ManageAllUsers([FromQuery] string nameFilter = "")
        {
            try
            {
                Admin admin = new Admin();
                var users = await admin.ManageAllUsers(_dbcon, nameFilter);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving users.", Error = ex.Message });
            }
        }
    }
}