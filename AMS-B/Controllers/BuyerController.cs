using AMS_B.Models;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AMS_B.Controllers
{
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

        [HttpGet("GetActiveAuctions")]
        public async Task<IActionResult> GetActiveAuctions([FromServices] Dbcon dbcon)
        {
            var auctions = await Buyer.GetActiveAuctions(dbcon);
            return Ok(auctions);
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
        public async Task<IActionResult> GetBidHistory([FromQuery] int auctionId, [FromServices] Dbcon dbcon)
        {
            var bidHistory = await Buyer.GetBidHistory(dbcon, auctionId);
            return Ok(bidHistory);
        }
    }
}
