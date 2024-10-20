using System.Data.Common;
using System.Data.SqlClient;
using System.Text.RegularExpressions;

namespace AMS_B.Models
{
    public class AdminBanRequest
    {
        public required string Email { get; set; }
        public bool Ban { get; set; }
    }

    public class ManageUser
    {
        public required string Email { get; set; }
        public required string Name { get; set; }
        public required string Role { get; set; }
        public required string Status { get; set; }
        public required string Telephone { get; set; }
    }
    public class RevenueDetails
    {
        public required DateOnly Month { get; set; }  
        public required int Revenue { get; set; }
    }

    public class GetRevenueDetails
    {
        public static async Task<List<RevenueDetails>> GetRevenue(Dbcon dbcon)
        {
            var result = new List<RevenueDetails>();
            try
            {
                await dbcon.Connect();
                string query = @"
                SELECT DATE_FORMAT(TransactionDate, '%Y-%m') AS Month, SUM(FinalPrice) AS TotalRevenue
                FROM Transactions
                WHERE PaymentStatus = 'Completed'
                GROUP BY Month
                ORDER BY Month";

                using (var reader = await dbcon.ExecuteQuery(query))
                {
                    while (reader.Read())
                    {
                        var revenue = new RevenueDetails
                        {
                            
                            Month = DateOnly.Parse(reader.GetString(0)),
                            Revenue = reader.GetInt32(1)
                        };
                        result.Add(revenue);
                    }
                }
                return result;
            }
            catch (SqlException e)
            {
               
                throw new Exception("An error occurred while retrieving revenue details from the DB.", e);
            }
            catch (Exception ex)
            {
                throw new Exception($"An unexpected error occurred: {ex.Message}", ex); 
            }
            finally
            {
                dbcon.Disconnect();
            }
        }
    }

    public class DashboardDetails
    {
        public required int TotalUsers { get; set; }
        public required int TotalSellers { get; set; }
        public required int TotalCopletedTransactions { get; set; }
        public required int TotalFailedTransactions { get; set; }
        public required int TotalRevenue { get; set; }
    }
    public class GetDashboardDetails
    {
        public static async Task<List<DashboardDetails>> GetDashboard(Dbcon dbcon)
        {
            var result = new List<DashboardDetails>();
            try
            {
                await dbcon.Connect();
                string query = @"
                SELECT 
                (SELECT COUNT(*) FROM user) AS TotalUsers,
                (SELECT COUNT(*) FROM user WHERE role = 'Seller') AS TotalSellers,
                (SELECT COUNT(*) FROM transactions WHERE PaymentStatus = 'Completed') AS TotalCompletedTransactions,
                (SELECT COUNT(*) FROM transactions WHERE PaymentStatus = 'Failed') AS TotalFailedTransactions,
                (SELECT SUM(FinalPrice) FROM transactions WHERE PaymentStatus = 'Completed') AS TotalRevenue";

                using (var reader = await dbcon.ExecuteQuery(query))
                {
                    while (reader.Read())
                    {
                        var dashboardDetails = new DashboardDetails
                        {
                            TotalUsers = reader.GetInt32(0),
                            TotalSellers = reader.GetInt32(1),
                            TotalCopletedTransactions = reader.GetInt32(2),
                            TotalFailedTransactions = reader.GetInt32(3),
                            TotalRevenue = reader.GetInt32(4)
                        };
                        result.Add(dashboardDetails);
                    }
                }
                return result;
            }
            catch (SqlException e)
            {
                throw new Exception("An error occurred while retrieving dashboard details from the DB.", e);
            }
            catch (Exception ex)
            {
                throw new Exception($"An unexpected error occurred: {ex.Message}", ex);
            }
            finally
            {
                dbcon.Disconnect();
            }
        }
    }

public class GetHigherFinalPriceAuctionsDetails
    {
        public static async Task<List<HigherFinalPriceAuctionsDetails>> GetHigherFinalPriceAuctions(Dbcon dbcon)
        {
            var result = new List<HigherFinalPriceAuctionsDetails>();
            try
            {
                await dbcon.Connect();
                string query = @"
            SELECT 
                t.TransactionID,
                c.car_title AS CarTitle,
                CONCAT(m.name, ' ', md.model_name) AS CarModel,
                y.year AS CarYear,
                ct.type_name AS CarType,
                pc.class_name AS PerformanceClass,
                buyer.name AS BuyerName,
                seller.name AS SellerName,
                t.FinalPrice,
                t.TransactionDate,
                t.PaymentStatus
            FROM 
                transactions t
            JOIN 
                auction a ON t.AucID = a.aucid
            JOIN 
                car c ON a.car_id = c.id
            JOIN 
                user buyer ON t.BuyerID = buyer.userid
            JOIN 
                user seller ON t.SellerID = seller.userid
            JOIN 
                model md ON c.model_id = md.model_id
            JOIN 
                manufacturer m ON md.manufacturer_id = m.id
            JOIN 
                year y ON c.year_id = y.id
            JOIN 
                car_type ct ON c.car_type_id = ct.id
            JOIN 
                performance_class pc ON c.performance_class_id = pc.id
            WHERE 
                t.PaymentStatus = 'Completed'
            ORDER BY 
                t.FinalPrice DESC
            LIMIT 100;";

                using (var reader = await dbcon.ExecuteQuery(query))
                {
                    while (await reader.ReadAsync())
                    {
                        var higherFinalPriceAuctions = new HigherFinalPriceAuctionsDetails
                        {
                            TransactionID = reader.GetInt32(reader.GetOrdinal("TransactionID")),
                            CarTitle = reader.GetString(reader.GetOrdinal("CarTitle")),
                            CarModel = reader.GetString(reader.GetOrdinal("CarModel")),
                            CarYear = reader.GetInt32(reader.GetOrdinal("CarYear")),
                            CarType = reader.GetString(reader.GetOrdinal("CarType")),
                            PerformanceClass = reader.GetString(reader.GetOrdinal("PerformanceClass")),
                            BuyerName = reader.GetString(reader.GetOrdinal("BuyerName")),
                            SellerName = reader.GetString(reader.GetOrdinal("SellerName")),
                            FinalPrice = reader.GetInt32(reader.GetOrdinal("FinalPrice")),
                            TransactionDate = reader.GetDateTime(reader.GetOrdinal("TransactionDate")),
                            PaymentStatus = reader.GetString(reader.GetOrdinal("PaymentStatus"))
                        };
                        result.Add(higherFinalPriceAuctions);
                    }
                }
                return result;
            }
            catch (DbException e)
            {
                throw new Exception("An error occurred while retrieving higher final price auctions details from the DB.", e);
            }
            catch (Exception ex)
            {
                throw new Exception($"An unexpected error occurred: {ex.Message}", ex);
            }
            finally
            {
                 dbcon.Disconnect();
            }
        }
    }

    public class HigherFinalPriceAuctionsDetails
    {
        public required int TransactionID { get; set; }
        public required string CarTitle { get; set; }
        public required string CarModel { get; set; }
        public required int CarYear { get; set; }
        public required string CarType { get; set; }
        public required string PerformanceClass { get; set; }
        public required string BuyerName { get; set; }
        public required string SellerName { get; set; }
        public required int FinalPrice { get; set; }
        public required DateTime TransactionDate { get; set; }
        public required string PaymentStatus { get; set; }
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
}