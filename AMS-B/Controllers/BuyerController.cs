using AMS_B.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AMS_B.Controllers
{
    [Authorize(Roles = "Buyer")]
    [Route("api/[controller]")]
    [ApiController]
    public class BuyerController : ControllerBase
    {
        private int GetBuyerId()
        {
            var idClaim = User.FindFirst("id");
            if (idClaim == null)
            {
                idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            }

            return idClaim != null ? int.Parse(idClaim.Value) : 0;
        }


        [HttpPost("PlaceBid")]
        public async Task<IActionResult> PlaceBid([FromBody] Bid bid, [FromServices] Dbcon dbcon)
        {
            int buyerId = GetBuyerId();
            if (buyerId <= 0)
            {
                return BadRequest(new { Message = "Invalid buyer ID." });
            }

            bid.UserId = buyerId;
            bid.BidTime = DateTime.Now;

            var result = await Buyer.PlaceBid(dbcon, bid);
            if (result)
            {
                return Ok(new { Message = "Bid placed successfully." });
            }
            else
            {
                return BadRequest(new { Message = "Failed to place bid. Please try again." });
            }
        }

        [HttpGet("GetBidHistory")]
        public async Task<IActionResult> GetBidHistory([FromServices] Dbcon dbcon)
        {
            int buyer_id = GetBuyerId();
            if (buyer_id <= 0)
            {
                return BadRequest(new { Message = "Invalid buyer ID." });
            }
            List<BidDto> bidHistory = await Buyer.GetBidHistory(dbcon, buyer_id);
            return Ok(bidHistory);
        }

        [HttpPost("updatetransaction")]
        public async Task<IActionResult> UpdateTransaction([FromBody] UpdateTransactionRequest request,Dbcon dbcon)
        {
            if (request.AucId <= 0)
            {
                return BadRequest(new { message = "Invalid auction ID." });
            }

            try
            {
                await Transactions.CreateTransaction(dbcon, request.AucId);
                return Ok(new { message = "Transaction updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getBuyersTransactions")]
        public async Task<IActionResult> GetTransactionsByBuyerId([FromServices] Dbcon dbcon)
        {
            try
            {
                int buyerId = GetBuyerId();
                if (buyerId <= 0)
                {
                    return BadRequest(new { Message = "Invalid buyer ID." });
                }
                var transactions = await Transactions.GetTransactionbyBuyerId(dbcon,buyerId);
                if (transactions == null || !transactions.Any())
                {
                    return Ok(transactions);
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