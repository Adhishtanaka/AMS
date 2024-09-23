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
