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
        [HttpPost("AddCarType")]
        public async Task<IActionResult> AddCarType([FromBody] CarType carType)
        {
            if (carType == null || string.IsNullOrEmpty(carType.TypeName))
            {
                return BadRequest(new { message = "Car type is required." });
            }

            try
            {
                await CategoryManager.AddCarType(_dbcon, carType);
                return Ok(new { message = "Car type added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the car type.", error = ex.Message });
            }
        }

        [HttpPost("AddCarYear")]
        public async Task<IActionResult> AddCarYear([FromBody] CarYear carYear)
        {
            try
            {
                await CategoryManager.AddYear(_dbcon, carYear);
                return Ok(new { message = "Car year added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the car year.", error = ex.Message });
            }
        }

        [HttpPost("AddManufacturer")]
        public async Task<IActionResult> AddManufacturer([FromBody] Manufacturer manufacturer)
        {
            try
            {
                await CategoryManager.AddManufacturer(_dbcon, manufacturer);
                return Ok(new { message = "Manufacturer added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the manufacturer.", error = ex.Message });
            }
        }

        [HttpPost("AddModel")]
        public async Task<IActionResult> AddModel([FromBody] Model model)
        {
            try
            {
                await CategoryManager.AddModel(_dbcon, model);
                return Ok(new { message = "Model added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the model.", error = ex.Message });
            }
        }

        [HttpDelete("DeleteCarType/{id}")]
        public async Task<IActionResult> DeleteCarType(string id)
        {

            try
            {
                await CategoryManager.DeleteCarType(_dbcon, id);
                return Ok(new { message = "Car type deleted successfully." });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("does not exist"))
                {
                    return NotFound(new { message = ex.Message });
                }
                return StatusCode(500, new { message = "An error occurred while deleting the car type.", error = ex.Message });
            }
        }

    }
}