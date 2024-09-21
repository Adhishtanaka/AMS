namespace AMS_B.Models 
{ 
    public class Car
    {
        public int ProductId { get; set; }
        public string PName { get; set; }
        public string PDescription { get; set; }
        public decimal Price { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public string ImageUrls { get; set; }

        public Car(int pid, string pName, string pDescription, decimal price, int userId, int categoryId, string imageUrls)
        {
            ProductId = pid;
            PName = pName;
            PDescription = pDescription;
            Price = price;
            UserId = userId;
            CategoryId = categoryId;
            ImageUrls = imageUrls;
        }

        public static async Task<List<Car>> GetAllCars(Dbcon dbcon)
        {
            List<Car> cars = new List<Car>();
            await dbcon.Connect();
            string query = "SELECT * FROM product";

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
                            reader.GetString(6)
                        );
                    cars.Add(car);
                }
            }

            dbcon.Disconnect();
            return cars;
        }

        public static async Task<Car?> GetCar(Dbcon dbcon, int carId)
        {
            await dbcon.Connect();
            string query = $"SELECT * FROM product WHERE productid = {carId}";

            using (var reader = await dbcon.ExecuteQuery(query))
            {
                if (await reader.ReadAsync())
                {
                    Car car = new(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        reader.GetString(2),
                        reader.GetDecimal(3),
                        reader.GetInt32(4),
                        reader.GetInt32(5),
                        reader.GetString(6)
                    );
                    dbcon.Disconnect();
                    return car;
                }

            }


            dbcon.Disconnect();
            return null;
        }

        public static async Task AddCar(Dbcon dbcon, Car car)
        {
            await dbcon.Connect();
            string query = $"INSERT INTO product (pname, pdescription, price, userid, catid, pimg) " +
                           $"VALUES ('{car.PName}', '{car.PDescription}', {car.Price}, {car.UserId}, {car.CategoryId}, '{car.ImageUrls}')";

            await dbcon.ExecuteNonQuery(query);
            dbcon.Disconnect();
        }

        public static async Task DeleteCar(Dbcon dbcon, int carId)
        {
            await dbcon.Connect();
            string query = $"DELETE FROM product WHERE productid = {carId}";

            await dbcon.ExecuteNonQuery(query);
            dbcon.Disconnect();
        }
    }
}
