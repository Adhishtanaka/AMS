namespace AMS_B.Models
{
    public class Seller : Users
    {
        public override string Role => "Seller";

        public Seller()
        {

        }

        public static async Task<List<Car>> GetCarsBySellerId(Dbcon dbcon, int userId)
        {
            List<Car> cars = new List<Car>();

            await dbcon.Connect();
            string query = $"SELECT * FROM product WHERE userid = {userId}";


            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {

                    Car car = new(
                            reader.GetInt32(0),
                            reader.GetString(1),
                            reader.GetString(2),
                            reader.GetDecimal(3),
                            reader.GetInt32(4),
                            reader.GetInt32(5),
                            reader.GetInt32(6),
                            reader.GetString(7)
                        );
                    cars.Add(car);
                }
            }

            dbcon.Disconnect();
            return cars;
        }

        public static async Task<List<Auction>> GetAuctionsBySellerId(Dbcon dbcon, int sellerId)
        {
            await dbcon.Connect();

            string productQuery = $"SELECT productid FROM product WHERE userid = {sellerId}";
            List<int> productIds = new List<int>();

            using (var productReader = await dbcon.ExecuteQuery(productQuery))
            {
                while (await productReader.ReadAsync())
                {
                    productIds.Add(productReader.GetInt32(0));
                }
            }

            if (productIds.Count == 0)
            {
                dbcon.Disconnect();
                return new List<Auction>();
            }

            string auctionQuery = $"SELECT * FROM auction WHERE productid IN ({string.Join(",", productIds)})";
            List<Auction> auctions = new List<Auction>();

            using (var auctionReader = await dbcon.ExecuteQuery(auctionQuery))
            {
                while (await auctionReader.ReadAsync())
                {
                    Auction auction = new Auction(
                        auctionReader.GetInt32(0),
                        auctionReader.GetInt32(1),
                        auctionReader.GetDateTime(2),
                        auctionReader.GetDateTime(3)
                    );
                    auctions.Add(auction);
                }
            }

            dbcon.Disconnect();
            return auctions;
        }



    }
}

