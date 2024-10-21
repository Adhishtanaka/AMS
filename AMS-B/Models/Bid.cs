namespace AMS_B.Models
{
    public class Bid
    {
        public int? BidId { get; set; }
        public int AucId { get; set; }
        public int? UserId { get; set; }
        public DateTime? BidTime { get; set; }
        public decimal Amount { get; set; }
    }

    public class BidDto
    {
        public int BidId { get; set; }
        public int AucId { get; set; }
        public AuctionDto AuctionDetails { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public DateTime BidTime { get; set; }
        public decimal Amount { get; set; }
    }

}
