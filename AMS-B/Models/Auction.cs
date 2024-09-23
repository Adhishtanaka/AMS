namespace AMS_B.Models
{
    public class Auction
    {
        public int AuctionId { get; set; }
        public int ProductId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public decimal Current_Price { get; set; }
        public string Status { get; set; } 

        public Auction(int auctionId, int productId, DateTime startDate, DateTime endDate,decimal current_Price, string status)
        {
            AuctionId = auctionId;
            ProductId = productId;
            StartDate = startDate;
            EndDate = endDate;
            Current_Price = current_Price;
            Status = status; 
        }

        public static async Task CreateAuction(Dbcon dbcon, Auction auction)
        {
            string query = $"INSERT INTO auction (car_id, startdate, enddate,current_price, status) VALUES ({auction.ProductId}, '{auction.StartDate:yyyy-MM-dd HH:mm:ss}', '{auction.EndDate:yyyy-MM-dd HH:mm:ss}', '{auction.Current_Price}', '{auction.Status}')";
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
                        reader.GetDateTime(3),
                        reader.GetDecimal(4),
                        reader.GetString(5) 
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
                        reader.GetDateTime(3),
                        reader.GetDecimal(4),
                        reader.GetString(5)
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
