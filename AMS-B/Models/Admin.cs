
using System.Data.SqlClient;

namespace AMS_B.Models
{
    public class AdminBanRequest
    {
        public required string Email { get; set; }
        public bool Ban { get; set; }
    }

    public class CarType
    {
        public required string TypeName { get; set; }
    }
    public class Manufacturer
    {
        public required string ManufacturerName { get; set; }
        public required List<Model> Models { get; set; } // Changed from string to List<Model>
    }
    public class Model
    {
        public required string ModelName { get; set; }
    }
    

    public class ManageUser
    {
        public required string Email { get; set; }
        public required string Name { get; set; }
        public required string Role { get; set; }
        public required string Status { get; set; }
        public required string Telephone { get; set; }
    }

    public class Admin : Users
    {
        public override string Role => "Admin";

        public async Task<List<ManageUser>> ManageAllUsers(Dbcon dbcon, string nameFilter = "")
        {
            var users = new List<ManageUser>();
            try
            {
                await dbcon.Connect();
                string query = "SELECT email, name, role, status, tp FROM user";
                if (!string.IsNullOrEmpty(nameFilter))
                {
                    query += $" WHERE name LIKE '{nameFilter}%'";
                }

                using (var reader = await dbcon.ExecuteQuery(query))
                {
                    while (reader.Read())
                    {
                        var manageUser = new ManageUser
                        {
                            Email = !reader.IsDBNull(0) ? reader.GetString(0) : string.Empty,
                            Name = !reader.IsDBNull(1) ? reader.GetString(1) : string.Empty,
                            Role = !reader.IsDBNull(2) ? reader.GetString(2) : string.Empty,
                            Status = !reader.IsDBNull(3) ? reader.GetString(3) : string.Empty,
                            Telephone = !reader.IsDBNull(4) ? reader.GetString(4) : string.Empty
                        };
                        users.Add(manageUser);
                    }
                }

                return users;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving users.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }


        public async Task<bool> BanUser(Dbcon dbcon, bool ban)
        {
            try
            {
                await dbcon.Connect();

                string checkQuery = $"SELECT COUNT(*) FROM user WHERE email = '{Email}'";
                bool emailExists;
                using (var checkReader = await dbcon.ExecuteQuery(checkQuery))
                {
                    emailExists = checkReader.Read() && checkReader.GetInt32(0) > 0;
                }

                if (!emailExists)
                {
                    dbcon.Disconnect();
                    return false;
                }

                string newStatus = ban ? "Banned" : "Active";
                string updateQuery = $"UPDATE user SET status = '{newStatus}' WHERE email = '{Email}'";
                int affectedRows = await dbcon.ExecuteNonQuery(updateQuery);

                return affectedRows > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the user's status.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }

        }


    }
    public class CategoryManager
    {
        public async Task<List<CarType>> GetCarTypes(Dbcon dbcon)
        {
            var carTypes = new List<CarType>();

            try
            {
                await dbcon.Connect();
                string queryCarType = "SELECT type_name FROM car_type";

                using (var reader = await dbcon.ExecuteQuery(queryCarType))
                {
                    while (reader.Read())
                    {
                        var carType = new CarType
                        {
                            TypeName = !reader.IsDBNull(0) ? reader.GetString(0) : string.Empty,
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

        public async Task<List<Manufacturer>> GetManufacturersWithModels(Dbcon dbcon)
        {
            var manufacturers = new List<Manufacturer>();

            try
            {
                await dbcon.Connect();

                string query = @"SELECT m.name AS ManufacturerName, mo.model_name AS ModelName FROM manufacturer m LEFT JOIN model mo ON m.id = mo.manufacturer_id";

                using (var reader = await dbcon.ExecuteQuery(query))
                {
                    var manufacturerDict = new Dictionary<string, Manufacturer>();

                    while (reader.Read())
                    {
                        var manufacturerName = !reader.IsDBNull(0) ? reader.GetString(0) : string.Empty;
                        var modelName = !reader.IsDBNull(1) ? reader.GetString(1) : string.Empty;

                        if (!manufacturerDict.ContainsKey(manufacturerName))
                        {
                            var manufacturer = new Manufacturer
                            {
                                ManufacturerName = manufacturerName,
                                Models = new List<Model>()
                            };

                            manufacturerDict[manufacturerName] = manufacturer;
                            manufacturers.Add(manufacturer);
                        }
                        if (!string.IsNullOrEmpty(modelName))
                        {
                            manufacturerDict[manufacturerName].Models.Add(new Model
                            {
                                ModelName = modelName
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving manufacturers and models.", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }

            return manufacturers;
        }

        public async Task AddCarType(Dbcon dbcon, CarType carType)
        {
            try
            {
                await dbcon.Connect();

                // Check if the car type already exists
                string checkCarTypeQuery = @"SELECT COUNT(*) FROM car_type WHERE type_name = @TypeName";
                var parameters = new Dictionary<string, object>
        {
            { "@TypeName", carType.TypeName }
        };

                var carTypeCount = (long)await dbcon.ExecuteScalar(checkCarTypeQuery, parameters);

                if (carTypeCount > 0)
                {
                    throw new Exception("Car type already exists.");
                }

                // SQL Insert query to add a new car type if it does not exist
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
        public async Task AddManufacturerWithModels(Dbcon dbcon, Manufacturer manufacturer)
        {
            try
            {
                await dbcon.Connect();

                // Check if the manufacturer already exists
                string checkManufacturerQuery = @"SELECT id FROM manufacturer WHERE name = @ManufacturerName";
                var parameters = new Dictionary<string, object>
        {
            { "@ManufacturerName", manufacturer.ManufacturerName }
        };

                var manufacturerIdObj = await dbcon.ExecuteScalar(checkManufacturerQuery, parameters);
                long manufacturerId;

                if (manufacturerIdObj != null)
                {
                    // Manufacturer already exists, retrieve its ID (cast to long explicitly)
                    manufacturerId = Convert.ToInt64(manufacturerIdObj);
                }
                else
                {
                    // Insert the manufacturer if it doesn't exist and get the LAST_INSERT_ID
                    string insertManufacturerQuery = @"INSERT INTO manufacturer (name) VALUES (@ManufacturerName); 
                                               SELECT LAST_INSERT_ID();";
                    var lastInsertIdObj = await dbcon.ExecuteScalar(insertManufacturerQuery, parameters);

                    // Handle the UInt64 result from LAST_INSERT_ID
                    manufacturerId = Convert.ToInt64(lastInsertIdObj);
                }

                // Insert each model related to the manufacturer
                foreach (var model in manufacturer.Models)
                {
                    // Check if the model already exists for this manufacturer
                    string checkModelQuery = @"SELECT COUNT(*) FROM model WHERE model_name = @ModelName AND manufacturer_id = @ManufacturerId";
                    var modelParameters = new Dictionary<string, object>
            {
                { "@ModelName", model.ModelName },
                { "@ManufacturerId", manufacturerId }
            };

                    var modelCount = (long)await dbcon.ExecuteScalar(checkModelQuery, modelParameters);

                    if (modelCount == 0)
                    {
                        // Insert the model if it doesn't exist
                        string insertModelQuery = @"INSERT INTO model (model_name, manufacturer_id) 
                                            VALUES (@ModelName, @ManufacturerId)";
                        await dbcon.ExecuteNonQuery(insertModelQuery, modelParameters);
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Capture SQL related issues
                throw new Exception($"SQL error occurred: {sqlEx.Message}. Query: ", sqlEx);
            }
            catch (Exception ex)
            {
                // Log exception with details for debugging
                throw new Exception($"An error occurred while adding the manufacturer '{manufacturer.ManufacturerName}' and models. Error: {ex.Message}", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }



    }

}

