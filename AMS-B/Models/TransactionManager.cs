using MySql.Data.MySqlClient;
namespace AMS_B.Models
{
    public class TransactionsDTO
    {
        public required int TransactionID { get; set; }
        public required int AucID { get; set; }
        public required AuctionDto AuctionDto { get; set; }
        public required DateTime Date { get; set; }
    }

    public class UpdateTransactionRequest
    {
        public int AucId { get; set; }
    }


    public class Transactions
    {
        public required int TransactionID { get; set; }
        public required int AucID { get; set; }
        public required DateTime Date { get; set; }
        public required int BuyerID { get; set; }
        public required int SellerID { get; set; }

        public static async Task<List<TransactionsDTO>> GetTransactionsbysellerId(Dbcon db, int SellerID)
        {
            var result = new List<TransactionsDTO>();
            try
            {
                await db.Connect();

                string query = @"
            SELECT 
                t.TransactionID,
                t.AucID,
                t.TransactionDate
            FROM Transactions t
            JOIN auction a ON t.AucID = a.aucid
            WHERE t.SellerID = @SellerID
            ORDER BY t.TransactionDate DESC";

                var parameters = new Dictionary<string, object>
        {
            { "@SellerID", SellerID }
        };

                var transactions = new List<(int TransactionID, int AucID, DateTime Date)>();

                using (var reader = await db.ExecuteQuery(query, parameters))
                {
                    while (await reader.ReadAsync())
                    {
                        transactions.Add((
                            reader.GetInt32("TransactionID"),
                            reader.GetInt32("AucID"),
                            reader.GetDateTime("TransactionDate")
                        ));
                    }
                    await reader.CloseAsync();
                }

                // Get unique auction IDs
                var auctionIds = transactions.Select(t => t.AucID).Distinct().ToList();

                // Get all auctions in a single batch
                var auctions = new Dictionary<int, AuctionDto>();
                foreach (var auctionId in auctionIds)
                {
                    var auction = await Auction.GetAuctionById(db, auctionId);
                    auctions[auctionId] = auction;
                }

                // Combine the data
                foreach (var trans in transactions)
                {
                    result.Add(new TransactionsDTO
                    {
                        TransactionID = trans.TransactionID,
                        AucID = trans.AucID,
                        Date = trans.Date,
                        AuctionDto = auctions[trans.AucID]
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting seller transactions: {ex.Message}");
            }
            finally
            {
                await db.Disconnect();
            }
            return result;
        }
        public static async Task<List<TransactionsDTO>> GetTransactionbyBuyerId(Dbcon db, int BuyerID)
        {
            var result = new List<TransactionsDTO>();
            try
            {
                await db.Connect();

                // First, get all transactions for this buyer
                string query = @"
            SELECT 
                t.TransactionID,
                t.AucID,
                t.TransactionDate
            FROM Transactions t
            JOIN auction a ON t.AucID = a.aucid
            WHERE t.BuyerID = @BuyerID
            ORDER BY t.TransactionDate DESC";

                var parameters = new Dictionary<string, object>
        {
            { "@BuyerID", BuyerID }
        };

                var transactions = new List<(int TransactionID, int AucID, DateTime Date)>();

                using (var reader = await db.ExecuteQuery(query, parameters))
                {
                    while (await reader.ReadAsync())
                    {
                        transactions.Add((
                            reader.GetInt32("TransactionID"),
                            reader.GetInt32("AucID"),
                            reader.GetDateTime("TransactionDate")
                        ));
                    }
                    await reader.CloseAsync();
                }

                // Get unique auction IDs
                var auctionIds = transactions.Select(t => t.AucID).Distinct().ToList();

                // Get all auctions in a single batch
                var auctions = new Dictionary<int, AuctionDto>();
                foreach (var auctionId in auctionIds)
                {
                    var auction = await Auction.GetAuctionById(db, auctionId);
                    auctions[auctionId] = auction;
                }

                // Combine the data
                foreach (var trans in transactions)
                {
                    result.Add(new TransactionsDTO
                    {
                        TransactionID = trans.TransactionID,
                        AucID = trans.AucID,
                        Date = trans.Date,
                        AuctionDto = auctions[trans.AucID]
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting buyer transactions: {ex.Message}");
            }
            finally
            {
                await db.Disconnect();
            }
            return result;
        }

        public static async Task<List<TransactionsDTO>> GetAllTransactions(Dbcon db)
        {
            var result = new List<TransactionsDTO>();
            try
            {
                await db.Connect();

                // First, get all transactions
                string query = @"
            SELECT 
                t.TransactionID,
                t.AucID,
                t.TransactionDate
            FROM Transactions t
            JOIN auction a ON t.AucID = a.aucid
            ORDER BY t.TransactionDate DESC";

                var transactions = new List<(int TransactionID, int AucID, DateTime Date)>();

                using (var reader = await db.ExecuteQuery(query))
                {
                    while (await reader.ReadAsync())
                    {
                        transactions.Add((
                            reader.GetInt32("TransactionID"),
                            reader.GetInt32("AucID"),
                            reader.GetDateTime("TransactionDate")
                        ));
                    }
                    await reader.CloseAsync();
                }

                // Now get all unique auction IDs
                var auctionIds = transactions.Select(t => t.AucID).Distinct().ToList();

                // Get all auctions in a single query
                var auctions = new Dictionary<int, AuctionDto>();
                foreach (var auctionId in auctionIds)
                {
                    var auction = await Auction.GetAuctionById(db, auctionId);
                    auctions[auctionId] = auction;
                }

                // Combine the data
                foreach (var trans in transactions)
                {
                    result.Add(new TransactionsDTO
                    {
                        TransactionID = trans.TransactionID,
                        AucID = trans.AucID,
                        Date = trans.Date,
                        AuctionDto = auctions[trans.AucID]
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting all transactions: {ex.Message}");
            }
            finally
            {
                await db.Disconnect();
            }
            return result;
        }

        public static async Task CreateTransaction(Dbcon db, int auctionId)
        {
            try
            {
                await db.Connect();

                var auction = await Auction.GetAuctionById(db, auctionId);
                if (auction.BuyerId == null)
                {
                    throw new Exception("Cannot create transaction: No buyer found for this auction");
                }

                string query = @"
                    INSERT INTO Transactions 
                    (AucID, BuyerID, SellerID, TransactionDate) 
                    VALUES 
                    (@AucID, @BuyerID, @SellerID, @TransactionDate)";

                var parameters = new Dictionary<string, object>
                {
                    { "@AucID", auctionId },
                    { "@BuyerID", auction.BuyerId },
                    { "@SellerID", auction.SellerId },
                    { "@TransactionDate", DateTime.Now }
                };

                await db.ExecuteNonQuery(query, parameters);

                string updateAuctionQuery = @"
                    UPDATE auction 
                    SET status = 'completed' 
                    WHERE aucid = @AuctionId";

                var auctionParameters = new Dictionary<string, object>
                {
                    { "@AuctionId", auctionId }
                };

                await db.ExecuteNonQuery(updateAuctionQuery, auctionParameters);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating transaction: {ex.Message}");
            }
            finally
            {
                await db.Disconnect();
            }
        }
    }
}