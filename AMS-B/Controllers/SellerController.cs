using AMS_B.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI;
using System.Security.Claims;


namespace AMS_B.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        private readonly string _imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "car-images");

        private int GetSellerId()
        {
            var idClaim = User.FindFirst("id");
            if (idClaim == null)
            {
                idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            }

            return idClaim != null ? int.Parse(idClaim.Value) : 0;  
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

            List<AuctionDto> auctions = await Seller.GetAuctionsBySellerId(dbcon, sellerId);
            if (auctions == null || auctions.Count == 0)
            {
                return NotFound(new { Message = "No auctions found for this seller." });
            }

            return Ok(auctions);
        }

        [HttpPost("AddCar")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddCar([FromForm] Car car, [FromForm] List<IFormFile> images, [FromServices] Dbcon dbcon)
        {
            int sellerId = GetSellerId();
            if (sellerId <= 0)
            {
                return BadRequest(new { Message = "Invalid seller ID." });
            }

            string carImagesFolder = Path.Combine(_imageFolder, "car-images");
            if (!Directory.Exists(carImagesFolder))
            {
                Directory.CreateDirectory(carImagesFolder);
            }

            List<string> imageUrls = new List<string>();
            foreach (var image in images)
            {
                if (image.Length > 0)
                {
                    string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    string filePath = Path.Combine(carImagesFolder, uniqueFileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }
                    string imageUrl = $"car-images/{uniqueFileName}";
                    imageUrls.Add(imageUrl);
                }
            }

            car.Img = string.Join(",", imageUrls);
            car.SellerId = sellerId;
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
            if (car == null || car.SellerId != sellerId)
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
            if (car == null || car.SellerId != sellerId)
            {
                return Forbid();
            }

            var existingAuction = await Auction.GetAllAuctions(dbcon);
            if (existingAuction.Any(a => a.ProductId == auction.ProductId && a.Status == "Active"))
            {
                return Conflict(new { Message = "An active auction already exists for this car." });
            }
            await Auction.CreateAuction(dbcon, auction);
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
            if (car == null || car.SellerId != sellerId)
            {
                return Forbid();
            }
            
            await Auction.DeleteAuction(dbcon, auctionId);
            return Ok(new { Message = "Auction deleted successfully." });
        }

        [HttpGet("getSellerTransactions")]
        public async Task<IActionResult> GetTransactionsBySellerId([FromServices] Dbcon dbcon)
        {


            try
            {
                var transactions = await Transactions.GetTransactionsbysellerId(dbcon, 7);
                if (transactions == null || !transactions.Any())
                {
                    return NotFound(new { message = "No transactions found for this seller." });
                }
                return Ok(transactions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving transactions: {ex.Message}" });
            }
        }
    }
}