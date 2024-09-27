 namespace AWS_B.model
 {
    public class Bid
    {
        public int BidId { get; set; }
        public int AuctionId { get; set; }
        public int BuyerId { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime BidTime { get; set; }
    

 private static List<Bid> Bids = new List<Bid>();

        // Method to place a bid
        public void PlaceBid()
        {
            // Add the bid to the list with a timestamp
            this.Timestamp = DateTime.Now;
            Bids.Add(this);
        }

        // Static method to view bid history for a specific auction
        public static List<Bid> ViewBidHistory(int auctionId)
        {
            return Bids.Where(b => b.AuctionId == auctionId).OrderBy(b => b.Timestamp).ToList();
        }

        // Static method to get the highest bid for a specific auction
        public static float GetHighestBid(int auctionId)
        {
            var highestBid = Bids.Where(b => b.AuctionId == auctionId)
                                 .OrderByDescending(b => b.Amount)
                                 .FirstOrDefault();

            return highestBid != null ? highestBid.Amount : 0;
        }
    }
}
    