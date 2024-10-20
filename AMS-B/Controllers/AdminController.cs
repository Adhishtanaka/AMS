using AMS_B.Models;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

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
        [HttpDelete("DeleteCarType")]
        public async Task<IActionResult> DeleteCarType([FromBody] int carTypeId)
        {
            if (carTypeId <= 0)
            {
                return BadRequest(new { message = "Car Id is Missing." });
            }

            try
            {
                await CategoryManager.DeleteCarType(_dbcon, carTypeId);
                return Ok(new { message = "Car type deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the car type.", error = ex.Message });
            }
        }

        [HttpDelete("DeleteModel")]
        public async Task<IActionResult> DeleteModel ([FromBody] int modelId)
        {
            if (modelId <= 0)
            {
                return BadRequest(new { message = "Car Id is Missing." });
            }

            try
            {
                await CategoryManager.DeleteModel(_dbcon, modelId);
                return Ok(new { message = "model deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the model .", error = ex.Message });
            }
        }
        [HttpDelete("DeleteManufacturer")]
        public async Task<IActionResult> DeleteManufacturer([FromBody] int ManufacturerId)
        {
            if (ManufacturerId <= 0)
            {
                return BadRequest(new { message = "Car Id is Missing." });
            }

            try
            {
                await CategoryManager.DeleteManufacturer(_dbcon, ManufacturerId);
                return Ok(new { message = "Manufacturer deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the Manufacturer .", error = ex.Message });
            }
        }

        [HttpGet("GetRevenue")]
        public async Task<IActionResult> GetRevenue()
        {
            try
            {
                
                var revenue = await GetRevenueDetails.GetRevenue(_dbcon);
                return Ok(revenue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving users.", Error = ex.Message });
            }
        }

        [HttpGet("GetDashboardDetails")]
        public async Task<IActionResult> DashboardDetails()
        {
            try
            {

                var dashboardDetails = await GetDashboardDetails.GetDashboard(_dbcon);
                return Ok(dashboardDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving users.", Error = ex.Message });
            }
        }
        [HttpGet("GetHigherFinalPriceAuctionsDetails")]
        public async Task<IActionResult> HigherFinalPriceAuctionsDetails()
        {
            try
            {

                var dashboardDetails = await GetHigherFinalPriceAuctionsDetails.GetHigherFinalPriceAuctions(_dbcon);
                return Ok(dashboardDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving users.", Error = ex.Message });
            }
        }



    }
}