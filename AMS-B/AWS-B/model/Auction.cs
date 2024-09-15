namespace AWS_B.model
{
    public class Auction
    {
        public int AuctionId { get; set; }
        public int ProductId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public Auction(int auctionId, int productId, DateTime startDate, DateTime endDate)
        {
            AuctionId = auctionId;
            ProductId = productId;
            StartDate = startDate;
            EndDate = endDate;
        }


        public static async Task createAuction(Dbcon dbcon, Auction auction)
        {
            string query = $"INSERT INTO auction (productid, startdate, enddate) VALUES ({auction.ProductId}, {auction.StartDate}, {auction.EndDate})";
            await dbcon.Connect();
            await dbcon.ExecuteNonQuery(query);
            dbcon.Disconnect();
        }

        public static async Task DeleteAuction(Dbcon dbcon, int auctionId)
        {
            string query = $"DELETE FROM auction WHERE aucid = {auctionId}";
            await dbcon.Connect();
            await dbcon.ExecuteNonQuery(query);
            dbcon.Disconnect();
        }

        public static async Task UpdateAuction(Dbcon dbcon, Auction auction)
        {
            string query = $"UPDATE auction SET productid = {auction.ProductId}, startdate = {auction.StartDate}, enddate = {auction.EndDate} WHERE aucid = {auction.AuctionId}";
            await dbcon.Connect();
            await dbcon.ExecuteNonQuery(query);
            dbcon.Disconnect();
        }

        public static async Task<List<Auction>> GetAllAuctions(Dbcon dbcon)
        {
            List<Auction> auctions = new List<Auction>();

            string query = "SELECT * FROM auction";
            await dbcon.Connect();
            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {
                    Auction auction = new(
                        reader.GetInt32(0),
                        reader.GetInt32(1),
                        reader.GetDateTime(2),
                        reader.GetDateTime(3)
                    );
                    auctions.Add(auction);
                }
            }

            dbcon.Disconnect();
            return auctions;
        }

        public static async Task<Auction?> GetAuctionById(Dbcon dbcon, int auctionId)
        {
            await dbcon.Connect();
            string query = $"SELECT * FROM auction WHERE aucid = {auctionId}";

            using (var reader = await dbcon.ExecuteQuery(query))
            {
                if (await reader.ReadAsync())
                {
                    Auction auction = new(
                        reader.GetInt32(0),
                        reader.GetInt32(1),
                        reader.GetDateTime(2),
                        reader.GetDateTime(3)
                    );
                    dbcon.Disconnect();
                    return auction;
                }

            }
            dbcon.Disconnect();
            return null;
        }


    }
}
