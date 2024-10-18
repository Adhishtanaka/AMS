using MySql.Data.MySqlClient;
using System.Data.SqlClient;

namespace AMS_B.Models
{
    public class CarType
    {
        public int Id { get; set; }
        public required string TypeName { get; set; }
    }

    public class Manufacturer
    {
        public int Id { get; set; }
        public required string ManufacturerName { get; set; }
    }

    public class Model
    {

        public int ModelId { get; set; }
        public int ManufacturerId { get; set; }
        public required string ModelName { get; set; }
        public string? ManufacturerName { get; set; }
    }

    public class PerformanceClass
    {
         public int Id { get; set; }
         public required string className { get; set; }
    
    }
  
    public class CategoryManager
        {
        public static async Task<List<CarType>> GetCarTypes(Dbcon dbcon)
        {
            var carTypes = new List<CarType>();

            try
            {
                await dbcon.Connect();
                string queryCarType = "SELECT id, type_name FROM car_type";

                using (var reader = await dbcon.ExecuteQuery(queryCarType))
                {
                    while (await reader.ReadAsync())
                    {
                        var carType = new CarType
                        {
                            Id = reader.GetInt32(0),
                            TypeName = reader.GetString(1)
                        };

                        carTypes.Add(carType);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving car types.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }

            return carTypes;
        }

        public static async Task<List<PerformanceClass>> GetPerformenceClass(Dbcon dbcon)
        {
            var PC = new List<PerformanceClass>();

            try
            {
                await dbcon.Connect();
                string queryCarPC = "SELECT * FROM `performance_class`";

                using (var reader = await dbcon.ExecuteQuery(queryCarPC))
                {
                    while (await reader.ReadAsync())
                    {
                        var carPC = new PerformanceClass
                        {
                            Id = reader.GetInt32(0),
                            className = reader.GetString(1)
                        };

                        PC.Add(carPC);
                    }
                }
            }
            catch (Exception ex)
            {

                throw new Exception("An error occurred while retrieving car years.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }

            return PC;
        }

        public static async Task<List<Manufacturer>> GetManufacturers(Dbcon dbcon)
        {
            var manufacturers = new List<Manufacturer>();
            try
            {
                await dbcon.Connect();
                string queryManufacturers = "SELECT id, name FROM manufacturer";

                using (var reader = await dbcon.ExecuteQuery(queryManufacturers))
                {
                    while (await reader.ReadAsync())
                    {
                        var manufacturer = new Manufacturer
                        {
                            Id = reader.GetInt32(0),
                            ManufacturerName = reader.GetString(1)
                        };

                        manufacturers.Add(manufacturer);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving manufacturers.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }

            return manufacturers;
        }

        public static async Task<List<Model>> GetModels(Dbcon dbcon)
        {
            var models = new List<Model>();
            try
            {
                await dbcon.Connect();
                string queryModels = @"
                    SELECT m.model_id, m.model_name,m.manufacturer_id, ma.name AS manufacturer_name
                    FROM model m
                    JOIN manufacturer ma ON m.manufacturer_id = ma.id";

                using (var reader = await dbcon.ExecuteQuery(queryModels))
                {
                    while (await reader.ReadAsync())
                    {
                        var model = new Model
                        {
                            ModelId = reader.GetInt32(0),
                            ModelName = reader.GetString(1),
                            ManufacturerId = reader.GetInt32(2),
                            ManufacturerName = reader.GetString(3)
                        };

                        models.Add(model);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving models.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }

            return models;
        }

        public static async Task AddCarType(Dbcon dbcon, CarType carType)
        {
            try
            {
                await dbcon.Connect();

                string checkCarTypeQuery = @"SELECT COUNT(*) FROM car_type WHERE type_name = @TypeName";
                var parameters = new Dictionary<string, object>
            {
                { "@TypeName", carType.TypeName }
            };

                var carTypeCount = Convert.ToInt64(await dbcon.ExecuteScalar(checkCarTypeQuery, parameters));

                if (carTypeCount > 0)
                {
                    throw new Exception("Car type already exists.");
                }

                string insertCarTypeQuery = @"INSERT INTO car_type (type_name) VALUES (@TypeName)";
                await dbcon.ExecuteNonQuery(insertCarTypeQuery, parameters);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding a car type.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }

        public static async Task AddManufacturer(Dbcon dbcon, Manufacturer manufacturer)
        {
            try
            {
                await dbcon.Connect();

                string checkManufacturerQuery = @"SELECT COUNT(*) FROM manufacturer WHERE name = @ManufacturerName";
                var parameters = new Dictionary<string, object>
            {
                { "@ManufacturerName", manufacturer.ManufacturerName }
            };

                var manufacturerCount = Convert.ToInt64(await dbcon.ExecuteScalar(checkManufacturerQuery, parameters));

                if (manufacturerCount > 0)
                {
                    throw new Exception("Manufacturer already exists.");
                }

                string insertManufacturerQuery = @"INSERT INTO manufacturer (name) VALUES (@ManufacturerName)";
                await dbcon.ExecuteNonQuery(insertManufacturerQuery, parameters);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding a manufacturer.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }

        public static async Task AddModel(Dbcon dbcon, Model model)
        {
            try
            {
                await dbcon.Connect();
                // Now check if the model already exists for this manufacturer
                string checkModelQuery = @"SELECT COUNT(*) FROM model WHERE model_name = @ModelName AND manufacturer_id = @ManufacturerId";
                var parameters = new Dictionary<string, object>
            {
                { "@ModelName", model.ModelName },
                { "@ManufacturerId", model.ManufacturerId }
            };

                var modelCount = Convert.ToInt64(await dbcon.ExecuteScalar(checkModelQuery, parameters));

                if (modelCount > 0)
                {
                    throw new Exception("Model already exists for this manufacturer.");
                }

                string insertModelQuery = @"INSERT INTO model (model_name, manufacturer_id) VALUES (@ModelName, @ManufacturerId)";
                await dbcon.ExecuteNonQuery(insertModelQuery, parameters);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding a model.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }
        public static async Task DeleteCarType(Dbcon dbcon, int id)
        {
            try
            {
                await dbcon.Connect();
                string deleteCarTypeQuery = "DELETE FROM car_type WHERE id = @Id";
                var parameters = new Dictionary<string, object>
            {
                { "@Id", id }
            };

                await dbcon.ExecuteNonQuery(deleteCarTypeQuery, parameters);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting a car type.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }

        public static async Task DeleteManufacturer(Dbcon dbcon, int id)
        {
            try
            {
                await dbcon.Connect();
                string deleteManufacturerQuery = "DELETE FROM manufacturer WHERE id = @Id";
                var parameters = new Dictionary<string, object>
            {
                { "@Id", id }
            };

                await dbcon.ExecuteNonQuery(deleteManufacturerQuery, parameters);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting a manufacturer.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }
        public static async Task DeleteModel(Dbcon dbcon, int id)
        {
            try
            {
                await dbcon.Connect();
                string deleteModelQuery = "DELETE FROM model WHERE model_id = @Id";
                var parameters = new Dictionary<string, object>
            {
                { "@Id", id }
            };

                await dbcon.ExecuteNonQuery(deleteModelQuery, parameters);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting a model.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }
    }
}