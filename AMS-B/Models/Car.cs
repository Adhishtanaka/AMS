namespace AMS_B.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string CarDescription { get; set; }
        public string Img { get; set; }
        public int ManufacturerId { get; set; }
        public int PerformanceClassId { get; set; }
        public int YearId { get; set; }
        public decimal Price { get; set; }
        public int CarTypeId { get; set; }
        public int SellerId { get; set; }

        public Car(int id, string carDescription, string img, int manufacturerId, int performanceClassId, int yearId, decimal price, int carTypeId, int sellerId)
        {
            Id = id;
            CarDescription = carDescription;
            Img = img;
            ManufacturerId = manufacturerId;
            PerformanceClassId = performanceClassId;
            YearId = yearId;
            Price = price;
            CarTypeId = carTypeId;
            SellerId = sellerId;
        }

        public static async Task<List<Car>> GetAllCars(Dbcon dbcon)
        {
            List<Car> cars = new List<Car>();
            await dbcon.Connect();
            string query = "SELECT * FROM car";

            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {
                    Car car = new(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        reader.GetString(2),
                        reader.GetInt32(3),
                        reader.GetInt32(4),
                        reader.GetInt32(5),
                        reader.GetDecimal(6),
                        reader.GetInt32(7),
                        reader.GetInt32(8)
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
            string query = $"SELECT * FROM car WHERE id = {carId}";

            using (var reader = await dbcon.ExecuteQuery(query))
            {
                if (await reader.ReadAsync())
                {
                    Car car = new(
                        reader.GetInt32(0),
                        reader.GetString(1),
                        reader.GetString(2),
                        reader.GetInt32(3),  
                        reader.GetInt32(4),  
                        reader.GetInt32(5),
                        reader.GetDecimal(6),
                        reader.GetInt32(7),  
                        reader.GetInt32(8)   
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
            string query = $"INSERT INTO car (car_description, img, manufacturer_id, performance_class_id, year_id, price, car_type_id, seller_id) " +
                           $"VALUES ('{car.CarDescription}', '{car.Img}', {car.ManufacturerId}, {car.PerformanceClassId}, {car.YearId}, {car.Price}, {car.CarTypeId}, {car.SellerId})";

            await dbcon.ExecuteNonQuery(query);
            dbcon.Disconnect();
        }

        public static async Task DeleteCar(Dbcon dbcon, int carId)
        {
            await dbcon.Connect();
            string query = $"DELETE FROM car WHERE id = {carId}";

            await dbcon.ExecuteNonQuery(query);
            dbcon.Disconnect();
        }
    }
}
