namespace AMS_B.Models
{
    public class AuctionDto
    {
        public int AuctionId { get; set; }
        public int ProductId { get; set; }
        public decimal InitialPrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int SellerId { get; set; }
        public string SellerName { get; set; }
        public int? BuyerId { get; set; }  
        public string? BuyerName { get; set; }
        public decimal? CurrentPrice { get; set; } 
        public string CarTitle { get; set; }
        public string Img { get; set; }
        public string ModelName { get; set; }
        public string ManufacturerName { get; set; }
        public int Year { get; set; }
        public string Status { get; set; }
    }

    public class Auction
    {
        public int AuctionId { get; set; }
        public int ProductId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Bid_id { get; set; }
        public string Status { get; set; } 

        public Auction(int auctionId, int productId, DateTime startDate, DateTime endDate,int bid_id, string status)
        {
            AuctionId = auctionId;
            ProductId = productId;
            StartDate = startDate;
            EndDate = endDate;
            Bid_id = bid_id;
            Status = status; 
        }

        public static async Task CreateAuction(Dbcon dbcon, Auction auction)
        {
            string query = $"INSERT INTO auction (car_id, startdate, enddate, status) VALUES ({auction.ProductId}, '{auction.StartDate:yyyy-MM-dd HH:mm:ss}', '{auction.EndDate:yyyy-MM-dd HH:mm:ss}', '{auction.Status}')";
            await dbcon.Connect();
            await dbcon.ExecuteNonQuery(query);
            await dbcon.Disconnect();
        }

        public static async Task DeleteAuction(Dbcon dbcon, int auctionId)
        {
            string query = $"DELETE FROM auction WHERE aucid = {auctionId}";
            await dbcon.Connect();
            await dbcon.ExecuteNonQuery(query);
            await dbcon.Disconnect();
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
                        reader.GetInt32(4),
                        reader.GetString(5) 
                    );
                    auctions.Add(auction);
                }
            }

            await dbcon.Disconnect();
            return auctions;
        }

        public static async Task<List<AuctionDto>> GetAllAuctionsDetails(Dbcon dbcon)
        {
            List<AuctionDto> auctions = new List<AuctionDto>();

            string query = @"
    SELECT 
        a.aucid AS AuctionId,
        a.car_id As ProductId, 
        c.price As InitialPrice,
        a.startdate AS StartDate,
        a.enddate AS EndDate,
        a.status AS Status,
        c.seller_id AS SellerId,
        us.name AS SellerName,
        b.userid AS BuyerId,
        ub.name AS BuyerName,
        b.amount AS CurrentPrice,
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
        user us ON c.seller_id = us.userid
    LEFT JOIN 
        bid b ON a.bid_id = b.bidid
    LEFT JOIN 
        user ub ON b.userid = ub.userid
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
                        AuctionId = reader.GetInt32(reader.GetOrdinal("AuctionId")),
                        ProductId = reader.GetInt32(reader.GetOrdinal("ProductId")),
                        InitialPrice = reader.GetDecimal(reader.GetOrdinal("InitialPrice")),
                        StartDate = reader.GetDateTime(reader.GetOrdinal("StartDate")),
                        EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        SellerId = reader.GetInt32(reader.GetOrdinal("SellerId")),
                        SellerName = reader.GetString(reader.GetOrdinal("SellerName")),
                        BuyerId = reader.IsDBNull(reader.GetOrdinal("BuyerId")) ? null : reader.GetInt32(reader.GetOrdinal("BuyerId")),
                        BuyerName = reader.IsDBNull(reader.GetOrdinal("BuyerName")) ? null : reader.GetString(reader.GetOrdinal("BuyerName")),
                        CurrentPrice = reader.IsDBNull(reader.GetOrdinal("CurrentPrice")) ? null : reader.GetDecimal(reader.GetOrdinal("CurrentPrice")),
                        CarTitle = reader.GetString(reader.GetOrdinal("CarTitle")),
                        Img = reader.GetString(reader.GetOrdinal("Img")),
                        ModelName = reader.GetString(reader.GetOrdinal("ModelName")),
                        ManufacturerName = reader.GetString(reader.GetOrdinal("ManufacturerName")),
                        Year = reader.GetInt32(reader.GetOrdinal("Year"))
                    }; 
                    auctions.Add(auction);
                }
            }

            await dbcon.Disconnect();
            return auctions;
        }

        public static async Task<AuctionDto> GetAuctionById(Dbcon dbcon, int auctionId)
        {
            string query = @"
    SELECT 
        a.aucid AS AuctionId,
        a.car_id As ProductId,
        c.price As InitialPrice,
        a.startdate AS StartDate,
        a.enddate AS EndDate,
        a.status AS Status,
        c.seller_id AS SellerId,
        us.name AS SellerName,
        b.userid AS BuyerId,
        ub.name AS BuyerName,
        b.amount AS CurrentPrice,
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
        user us ON c.seller_id = us.userid
    LEFT JOIN 
        bid b ON a.bid_id = b.bidid
    LEFT JOIN 
        user ub ON b.userid = ub.userid
    JOIN 
        model m ON c.model_id = m.model_id
    JOIN 
        manufacturer ma ON m.manufacturer_id = ma.id
    WHERE 
        a.aucid = @auctionId";

            var parameters = new Dictionary<string, object>
{
    { "@auctionId", auctionId }
};

            await dbcon.Connect();
            using (var reader = await dbcon.ExecuteQuery(query,parameters))
            {
                if (await reader.ReadAsync())
                {
                    AuctionDto auction = new AuctionDto
                    {
                        AuctionId = reader.GetInt32(reader.GetOrdinal("AuctionId")),
                        ProductId = reader.GetInt32(reader.GetOrdinal("ProductId")),
                        InitialPrice = reader.GetDecimal(reader.GetOrdinal("InitialPrice")),
                        StartDate = reader.GetDateTime(reader.GetOrdinal("StartDate")),
                        EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        SellerId = reader.GetInt32(reader.GetOrdinal("SellerId")),
                        SellerName = reader.GetString(reader.GetOrdinal("SellerName")),
                        BuyerId = reader.IsDBNull(reader.GetOrdinal("BuyerId")) ? null : reader.GetInt32(reader.GetOrdinal("BuyerId")),
                        BuyerName = reader.IsDBNull(reader.GetOrdinal("BuyerName")) ? null : reader.GetString(reader.GetOrdinal("BuyerName")),
                        CurrentPrice = reader.IsDBNull(reader.GetOrdinal("CurrentPrice")) ? null : reader.GetDecimal(reader.GetOrdinal("CurrentPrice")),
                        CarTitle = reader.GetString(reader.GetOrdinal("CarTitle")),
                        Img = reader.GetString(reader.GetOrdinal("Img")),
                        ModelName = reader.GetString(reader.GetOrdinal("ModelName")),
                        ManufacturerName = reader.GetString(reader.GetOrdinal("ManufacturerName")),
                        Year = reader.GetInt32(reader.GetOrdinal("Year"))
                    };
                    await dbcon.Disconnect();
                    return auction;
                }
                await reader.CloseAsync();
            }
            await dbcon.Disconnect();
            throw new KeyNotFoundException($"Auction with ID {auctionId} not found");
        }
    }
}
