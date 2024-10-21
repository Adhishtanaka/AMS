using System.Reflection.PortableExecutable;

namespace AMS_B.Models
{
    public class Seller : Users
    {
        public override string Role => "Seller";

        public Seller() { }

        public static async Task<List<Car>> GetCarsBySellerId(Dbcon dbcon, int sellerId)
        {
            List<Car> cars = new List<Car>();

            await dbcon.Connect();
            string query = $"SELECT * FROM car WHERE seller_id = {sellerId}";

            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {
                    Car car = new(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        reader.GetString(2),
                        reader.GetString(3),
                        reader.GetInt32(4),
                        reader.GetInt32(5),
                        reader.GetInt32(6),
                        reader.GetDecimal(7),
                        reader.GetInt32(8),
                        sellerId
                    );
                    cars.Add(car);
                }
            }

            dbcon.Disconnect();
            return cars;
        }

        public static async Task<List<AuctionDto>> GetAuctionsBySellerId(Dbcon dbcon, int sellerId)
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
        c.seller_id = @SellerId
    ORDER BY 
        a.startdate DESC";

            List<AuctionDto> auctions = new List<AuctionDto>();

            var parameters = new Dictionary<string, object>
{
    { "@SellerId", sellerId }
};

            await dbcon.Connect();
            using (var reader = await dbcon.ExecuteQuery(query,parameters))
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
            dbcon.Disconnect();
            return auctions;
        }
    }
}
