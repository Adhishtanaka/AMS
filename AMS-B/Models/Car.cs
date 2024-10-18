namespace AMS_B.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string CarTitle { get; set; }
        public string CarDescription { get; set; }
        public string? Img { get; set; }
        public int ModelId { get; set; }
        public int PerformanceClassId { get; set; }
        public int Year { get; set; }
        public decimal Price { get; set; }
        public int CarTypeId { get; set; }
        public int SellerId { get; set; }

        public Car()
        {
        }

        public Car(int id, string carTitle, string carDescription, string img, int modelId, int performanceClassId, int year, decimal price, int carTypeId, int sellerId)
        {
            Id = id;
            CarTitle = carTitle;
            CarDescription = carDescription;
            Img = img;
            ModelId = modelId;
            PerformanceClassId = performanceClassId;
            Year = year;
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
                        reader.GetString(3),
                        reader.GetInt32(4),
                        reader.GetInt32(5),
                        reader.GetInt32(6),
                        reader.GetDecimal(7),
                        reader.GetInt32(8),
                        reader.GetInt32(9)
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
                        reader.GetString(3),
                        reader.GetInt32(4),
                        reader.GetInt32(5),
                        reader.GetInt32(6),
                        reader.GetDecimal(7),
                        reader.GetInt32(8),
                        reader.GetInt32(9)
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
            string query = $"INSERT INTO car (car_title,car_description, img, model_id, performance_class_id, year, price, car_type_id, seller_id) " +
                           $"VALUES ('{car.CarTitle}','{car.CarDescription}', '{car.Img}', {car.ModelId}, {car.PerformanceClassId}, {car.Year}, {car.Price}, {car.CarTypeId}, {car.SellerId})";

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