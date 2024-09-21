using AMS_B.Models;
using Microsoft.AspNetCore.Mvc;


namespace AMS_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        private readonly string _imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "car-images");

        private int GetSellerId()
        {
            var claim = User.FindFirst("id");
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        [HttpGet("GetCarsBySellerId")]
        public async Task<IActionResult> GetCarsBySellerId([FromServices] Dbcon dbcon)
        {
            int sellerId = GetSellerId();
            if (sellerId <= 0)
            {
                return BadRequest(new { Message = "Invalid seller ID." });
            }

            List<Car> cars = await Seller.GetCarsBySellerId(dbcon, sellerId);
            if (cars == null || cars.Count == 0)
            {
                return NotFound(new { Message = "No cars found for this seller." });
            }

            return Ok(cars);
        }

        [HttpGet("GetAuctionsBySellerId")]
        public async Task<IActionResult> GetAuctionsBySellerId([FromServices] Dbcon dbcon)
        {
            int sellerId = GetSellerId();
            if (sellerId <= 0)
            {
                return BadRequest(new { Message = "Invalid seller ID." });
            }

            List<Auction> auctions = await Seller.GetAuctionsBySellerId(dbcon, sellerId);
            if (auctions == null || auctions.Count == 0)
            {
                return NotFound(new { Message = "No auctions found for this seller." });
            }

            return Ok(auctions);
        }

        [HttpPost("AddCar")]
        public async Task<IActionResult> AddCar([FromForm] Car car, [FromForm] List<IFormFile> images, [FromServices] Dbcon dbcon)
        {
            int sellerId = GetSellerId();
            if (car == null || car.UserId != sellerId)
            {
                return Forbid();
            }
            if (!Directory.Exists(_imageFolder))
            {
                Directory.CreateDirectory(_imageFolder);
            }
            List<string> imageUrls = new List<string>();

            foreach (var image in images)
            {
                if (image.Length > 0)
                {
                    string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    string filePath = Path.Combine(_imageFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }
                    string imageUrl = Path.Combine("car-images", uniqueFileName);
                    imageUrls.Add(imageUrl);
                }
            }

            car.ImageUrls = string.Join(",", imageUrls);
            await Car.AddCar(dbcon, car);
            return Ok(new { Message = "Car added successfully." });
        }

        [HttpDelete("DeleteCar")]
        public async Task<IActionResult> DeleteCar([FromQuery] int carId, [FromServices] Dbcon dbcon)
        {
            int sellerId = GetSellerId();
            if (carId <= 0 || sellerId <= 0)
            {
                return BadRequest(new { Message = "Invalid car ID or seller ID." });
            }

            var car = await Car.GetCar(dbcon, carId);
            if (car == null || car.UserId != sellerId)
            {
                return Forbid();
            }

            await Car.DeleteCar(dbcon, carId);
            return Ok(new { Message = "Car deleted successfully." });
        }

        [HttpPost("CreateAuction")]
        public async Task<IActionResult> CreateAuction([FromBody] Auction auction, [FromServices] Dbcon dbcon)
        {
            int sellerId = GetSellerId();
            if (auction == null)
            {
                return BadRequest(new { Message = "Invalid auction data." });
            }

            var car = await Car.GetCar(dbcon, auction.ProductId);
            if (car == null || car.UserId != sellerId)
            {
                return Forbid();
            }

            await Auction.createAuction(dbcon, auction);
            return Ok(new { Message = "Auction created successfully." });
        }

        [HttpDelete("DeleteAuction")]
        public async Task<IActionResult> DeleteAuction([FromQuery] int auctionId, [FromServices] Dbcon dbcon)
        {
            int sellerId = GetSellerId();
            if (auctionId <= 0 || sellerId <= 0)
            {
                return BadRequest(new { Message = "Invalid auction ID or seller ID." });
            }

            var auction = await Auction.GetAuctionById(dbcon, auctionId);
            if (auction == null)
            {
                return NotFound(new { Message = "Auction not found." });
            }

            var car = await Car.GetCar(dbcon, auction.ProductId);
            if (car == null || car.UserId != sellerId)
            {
                return Forbid();
            }

            await Auction.DeleteAuction(dbcon, auctionId);
            return Ok(new { Message = "Auction deleted successfully." });
        }
    }
}