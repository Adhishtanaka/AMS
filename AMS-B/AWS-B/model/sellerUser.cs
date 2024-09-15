namespace AWS_B.model
{
    public class Seller : User
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
    }
}

