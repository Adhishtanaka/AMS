using AMS_B.Models;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Text.Json;

namespace AMS_B.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly string _stripeSecretKey;

        public PaymentController(IConfiguration configuration)
        {
            _stripeSecretKey = configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = _stripeSecretKey;
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] CheckoutRequest request, Dbcon dbcon)
        {
            AuctionDto auc = await Auction.GetAuctionById(dbcon,request.auc_id);
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = auc.CarTitle 
                        },
                        UnitAmount = (long)auc.CurrentPrice,
                    },
                    Quantity = 1,
                },
            },
                Mode = "payment",
                SuccessUrl = "http://localhost:5173/buyer/Succeed/" + request.auc_id,
                CancelUrl = "http://localhost:5173/buyer/cancle",
            };

            var service = new SessionService();
            Session session = service.Create(options);

            return Ok(new { sessionId = session.Id });
        }       
    }
}

    public class CheckoutRequest
    {
        public int auc_id { get; set; }
       
    }
