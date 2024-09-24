using AMS_B.Models;
using Microsoft.AspNetCore.Mvc;

namespace AMS_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly Dbcon _dbcon;
        private readonly CategoryManager _categoryManager;
        public AdminController(Dbcon dbcon, CategoryManager categoryManager)
        {
            _dbcon = dbcon;
            _categoryManager = categoryManager;
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
        [HttpPost("AddCarType")]
        public async Task<IActionResult> AddCarType([FromBody] CarType carType)
        {
            if (carType == null || string.IsNullOrEmpty(carType.TypeName))
            {
                return BadRequest(new { message = "Car type is required." });
            }

            try
            {
                await _categoryManager.AddCarType(_dbcon, carType);
                return Ok(new { message = "Car type added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the car type.", error = ex.Message });
            }
        }

        [HttpPost("AddManufacturerWithModels")]
        public async Task<IActionResult> AddManufacturerWithModels([FromBody] Manufacturer manufacturer)
        {
            if (manufacturer == null || string.IsNullOrEmpty(manufacturer.ManufacturerName) || manufacturer.Models == null || manufacturer.Models.Count == 0)
            {
                return BadRequest(new { message = "Manufacturer and its models are required." });
            }

            try
            {
                await _categoryManager.AddManufacturerWithModels(_dbcon, manufacturer);
                return Ok(new { message = "Manufacturer and models added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the manufacturer and models.", error = ex.Message });
            }
        }


    }
}