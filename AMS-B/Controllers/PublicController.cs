using AMS_B.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AMS_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        [HttpGet("GetCarById")]
        public async Task<IActionResult> GetCarById([FromQuery] int carId, [FromServices] Dbcon dbcon)
        {
            if (carId <= 0)
            {
                return BadRequest(new { Message = "Invalid car ID." });
            }

            var car = await Car.GetCar(dbcon, carId);
            if (car == null)
            {
                return NotFound(new { Message = "Car not found." });
            }

            return Ok(car);
        }


        private readonly CategoryManager _categoryManager;
        private readonly Dbcon _dbcon;

        public PublicController(CategoryManager categoryManager, Dbcon dbcon)
        {
            
            _categoryManager = categoryManager;
            _dbcon = dbcon;
        }

        [HttpGet("Cartype")]
        public async Task<IActionResult> GetCarType()
        {
            try
            {
                var carTypes = await _categoryManager.GetCarTypes(_dbcon);
                return Ok(carTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving car types.", error = ex.Message });
            }
        }

        [HttpGet("ManufacturersWithModels")]
        public async Task<IActionResult> GetManufacturersWithModels()
        {
            try
            {
                var manufacturersWithModels = await _categoryManager.GetManufacturersWithModels(_dbcon);
                return Ok(manufacturersWithModels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving manufacturers and their models.", error = ex.Message });

            }
        }

            }}
        [HttpGet("GetAuctionById")]
        public async Task<IActionResult> GetAuctionById([FromQuery] int auctionId, [FromServices] Dbcon dbcon)
        {
            if (auctionId <= 0)
            {
                return BadRequest(new { Message = "Invalid auction ID." });
            }

            var auction = await Auction.GetAuctionById(dbcon, auctionId);
            if (auction == null)
            {
                return NotFound(new { Message = "Auction not found." });
            }

            return Ok(auction);
        }

    }
}
