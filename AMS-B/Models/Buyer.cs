namespace AMS_B.Models
{
    public class Buyer : Users
    {
        public override string Role => "Buyer";
       

        public static async Task<List<AuctionViewModel>> GetActiveAuctions(Dbcon dbcon)
        {
            List<AuctionViewModel> auctions = new List<AuctionViewModel>();

            string query = @"
                SELECT a.aucid, a.car_id, a.startdate, a.enddate, a.current_price, a.status,
                       c.car_title, c.img, c.price
                FROM auction a
                JOIN car c ON a.car_id = c.id
                WHERE a.status = 'Active' AND a.enddate > NOW()";

            await dbcon.Connect();
            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {
                    AuctionViewModel auction = new AuctionViewModel
                    {
                        AuctionId = reader.GetInt32(0),
                        CarId = reader.GetInt32(1),
                        StartDate = reader.GetDateTime(2),
                        EndDate = reader.GetDateTime(3),
                        CurrentPrice = reader.GetDecimal(4),
                        Status = reader.GetString(5),
                        CarTitle = reader.GetString(6),
                        CarImage = reader.GetString(7),
                        StartingPrice = reader.GetInt32(8)
                    };
                    auctions.Add(auction);
                }
            }
            dbcon.Disconnect();

            return auctions;
        }

        public static async Task<bool> PlaceBid(Dbcon dbcon, Bid bid)
        {
            await dbcon.Connect();
            string insertBidQuery = $@"
                INSERT INTO bid (aucid, userid, bidtime, amount)
                VALUES ({bid.AucId}, {bid.UserId}, '{bid.BidTime:yyyy-MM-dd HH:mm:ss}', {bid.Amount})";

            string updateAuctionQuery = $@"
                UPDATE auction
                SET current_price = {bid.Amount}
                WHERE aucid = {bid.AucId} AND current_price < {bid.Amount}";

            try
            {
                await dbcon.ExecuteNonQuery(insertBidQuery);
                await dbcon.ExecuteNonQuery(updateAuctionQuery);
                dbcon.Disconnect();
                return true;
            }
            catch
            {
                dbcon.Disconnect();
                return false;
            }
        }

        public static async Task<List<BidViewModel>> GetBidHistory(Dbcon dbcon, int auctionId)
        {
            List<BidViewModel> bidHistory = new List<BidViewModel>();

            string query = $@"
                SELECT b.bidid, b.userid, u.name, b.bidtime, b.amount
                FROM bid b
                JOIN user u ON b.userid = u.userid
                WHERE b.aucid = {auctionId}
                ORDER BY b.bidtime DESC";

            await dbcon.Connect();
            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {
                    BidViewModel bid = new BidViewModel
                    {
                        BidId = reader.GetInt32(0),
                        UserId = reader.GetInt32(1),
                        UserName = reader.GetString(2),
                        BidTime = reader.GetDateTime(3),
                        Amount = reader.GetDecimal(4)
                    };
                    bidHistory.Add(bid);
                }
            }
            dbcon.Disconnect();

            return bidHistory;
        }
    }

    public class AuctionViewModel
    {
        public int AuctionId { get; set; }
        public int CarId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal CurrentPrice { get; set; }
        public string Status { get; set; }
        public string CarTitle { get; set; }
        public string CarImage { get; set; }
        public int StartingPrice { get; set; }
    }

    public class BidViewModel
    {
        public int BidId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public DateTime BidTime { get; set; }
        public decimal Amount { get; set; }
    }

    public class Bid
    {
        public int BidId { get; set; }
        public int AucId { get; set; }
        public int UserId { get; set; }
        public DateTime BidTime { get; set; }
        public decimal Amount { get; set; }
    }

}
