namespace AMS_B.Models
{
    public class AuctionDto
    {
        public int AuctionId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Current_Price { get; set; }
        public string CarTitle { get; set; }
        public string Img { get; set; }
        public string ModelName { get; set; }          // Added ModelName
        public string ManufacturerName { get; set; }  // Added ManufacturerName
        public int Year { get; set; }                 // Added Year
    }


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

            string query = "SELECT * FROM auction WHERE enddate >= CURDATE()";
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

        public static async Task<List<AuctionDto>> GetAllAuctionsDetails(Dbcon dbcon)
        {
            List<AuctionDto> auctions = new List<AuctionDto>();

            string query = @"
    SELECT 
        a.aucid AS AuctionId, 
        a.startdate AS StartDate, 
        a.enddate AS EndDate, 
        a.current_price AS Current_Price, 
        c.car_title AS CarTitle, 
        c.img AS Img,
        m.model_name AS ModelName,
        ma.name AS ManufacturerName,
        c.year AS Year
    FROM 
        auction a 
    JOIN 
        car c ON a.car_id = c.id 
    JOIN 
        model m ON c.model_id = m.model_id
    JOIN 
        manufacturer ma ON m.manufacturer_id = ma.id
    WHERE 
        a.enddate >= CURDATE()";

            await dbcon.Connect();

            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {
                    AuctionDto auction = new AuctionDto
                    {
                        AuctionId = reader.GetInt32(0),
                        StartDate = reader.GetDateTime(1),
                        EndDate = reader.GetDateTime(2),
                        Current_Price = reader.GetDecimal(3),
                        CarTitle = reader.GetString(4),
                        Img = reader.GetString(5),
                        ModelName = reader.GetString(6),               // Read ModelName
                        ManufacturerName = reader.GetString(7),       // Read ManufacturerName
                        Year = reader.GetInt32(8)                      // Read Year
                    };

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
