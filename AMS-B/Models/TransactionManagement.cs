using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace AMS_B.Models
{
    public class TransactionDetails
    {
        public required int TransactionID { get; set; }
        public required int AucID { get; set; }
        public required string BuyerName { get; set; }
        public required string SellerName { get; set; }
        public required int FinalPrice { get; set; }
        public required string Status { get; set; }
        public required DateTime Date { get; set; }
    }

    public class DisplayTransaction
    {
        public static async Task<List<TransactionDetails>> GetTransactionDetails(Dbcon db, int? SellerID, string? Status)
        {
            var result = new List<TransactionDetails>();
            try
            {
                await db.Connect();

                string query = @"
                    SELECT 
                        Transactions.TransactionID,
                        Transactions.AucID,
                        Buyer.name AS BuyerName,
                        Seller.name AS SellerName,
                        Transactions.FinalPrice,
                        Transactions.PaymentStatus,
                        Transactions.TransactionDate
                    FROM Transactions
                    JOIN User AS Buyer ON Transactions.BuyerID = Buyer.UserID AND Buyer.Role = 'buyer'
                    JOIN User AS Seller ON Transactions.SellerID = Seller.UserID AND Seller.Role = 'seller'
                ";

                if (SellerID.HasValue || !string.IsNullOrEmpty(Status))
                {
                    query += " WHERE 1 = 1";

                    if (SellerID.HasValue)
                    {
                        query += " AND Transactions.SellerID = @SellerID";
                    }

                    if (!string.IsNullOrEmpty(Status))
                    {
                        query += " AND Transactions.PaymentStatus = @Status";
                    }
                }

                var parameters = new Dictionary<string, object>();
                if (SellerID.HasValue)
                {
                    parameters.Add("@SellerID", SellerID.Value);
                }
                if (!string.IsNullOrEmpty(Status))
                {
                    parameters.Add("@Status", Status);
                }

                using (var reader = await db.ExecuteQuery(query, parameters))
                {
                    while (reader.Read())
                    {
                        var transactionDetails = new TransactionDetails
                        {
                            TransactionID = reader.GetInt32(0),
                            AucID = reader.GetInt32(1),
                            BuyerName = reader.GetString(2),
                            SellerName = reader.GetString(3),
                            FinalPrice = reader.GetInt32(4),
                            Status = reader.GetString(5),
                            Date = reader.GetDateTime(6)
                        };
                        result.Add(transactionDetails);
                    }
                }

                return result;
            }
            catch (MySqlException ex)
            {
                throw new Exception("An error occurred while retrieving transaction details.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving transaction details.", ex);
            }
            finally
            {
                db.Disconnect();
            }
        }
    }
}
