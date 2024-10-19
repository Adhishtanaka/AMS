﻿using AMS_B.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AMS_B.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly Dbcon _dbcon;

        public PublicController(Dbcon dbcon)
        {
            _dbcon = dbcon;
        }

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


        [HttpGet("GetAllCarTypes")]
        public async Task<IActionResult> GetAllCarTypes()
        {
            try
            {
                var carTypes = await CategoryManager.GetCarTypes(_dbcon);
                return Ok(carTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving car types.", error = ex.Message });
            }
        }

        [HttpGet("GetAllManufacturers")]
        public async Task<IActionResult> GetAllManufacturers()
        {
            try
            {
                var manufacturers = await CategoryManager.GetManufacturers(_dbcon);
                return Ok(manufacturers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving manufacturers.", error = ex.Message });
            }
        }

        [HttpGet("GetAllModels")]
        public async Task<IActionResult> GetAllModels()
        {
            try
            {
                var models = await CategoryManager.GetModels(_dbcon);
                return Ok(models);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving models.", error = ex.Message });
            }
        }

        [HttpGet("GetAllCarPC")]
        public async Task<IActionResult> GetAllPC()
        {
            try
            {
                var carPC = await CategoryManager.GetPerformenceClass(_dbcon);
                return Ok(carPC);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An error occurred while retrieving car Performence Class.", error = ex.Message });
            }
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

        [HttpGet("GetALLAuctionDetails")]
        public async Task<IActionResult> GetALLAuction([FromServices] Dbcon dbcon)
        {
            

            List<AuctionDto> auctions = await Auction.GetAllAuctionsDetails(dbcon);
            if (auctions == null)
            {
                return NotFound(new { Message = "Auctions not found." });
            }

            return Ok(auctions);
        }

        [HttpGet("TransactionDetails")]
        public async Task<IActionResult> DisplayTransactionDetails([FromQuery] int? SellerId, [FromQuery] string? status)
        {
            try
            {

                var transactionDetails = await DisplayTransaction.GetTransactionDetails(_dbcon, SellerId, string.IsNullOrEmpty(status) ? null : status);

                return Ok(transactionDetails);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex}");
                return StatusCode(500, new { Message = "An error occurred while retrieving transaction details.", Error = ex.Message });
            }
        }
    }
}