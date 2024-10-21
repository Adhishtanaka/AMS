using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AMS_B.Models
{
    public class Buyer : Users
    {
        public override string Role => "Buyer";

        public static async Task<bool> PlaceBid(Dbcon dbcon, Bid bid)
        {
            await dbcon.Connect();

            string insertBidQuery = $@"
        INSERT INTO bid (aucid, userid, bidtime, amount)
        VALUES ({bid.AucId}, {bid.UserId}, '{bid.BidTime:yyyy-MM-dd HH:mm:ss}', {bid.Amount});";

            try
            {
                int bid_id = await dbcon.ExecuteNonQuery(insertBidQuery);

                string updateAuctionQuery = $@"
            UPDATE auction
            SET bid_id = {bid_id}
            WHERE aucid = {bid.AucId};";

                await dbcon.ExecuteNonQuery(updateAuctionQuery);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                await dbcon.Disconnect();
            }
        }



        public static async Task<List<BidViewModel>> GetBidHistory(Dbcon dbcon, int auctionId)
        {
            List<BidViewModel> bidHistory = new List<BidViewModel>();
            string query = $@"
                SELECT b.bidid, b.userid, u.name, b.bidtime, b.amount
                FROM bid b
                JOIN user u ON b.userid = u.userid
                WHERE b.aucid = {auctionId}
                ORDER BY b.bidtime DESC";
            await dbcon.Connect();
            using (var reader = await dbcon.ExecuteQuery(query))
            {
                while (await reader.ReadAsync())
                {
                    BidViewModel bid = new BidViewModel
                    {
                        BidId = reader.GetInt32(0),
                        UserId = reader.GetInt32(1),
                        UserName = reader.GetString(2),
                        BidTime = reader.GetDateTime(3),
                        Amount = reader.GetDecimal(4)
                    };
                    bidHistory.Add(bid);
                }
            }
            dbcon.Disconnect();
            return bidHistory;
        }
    }

    public class BidViewModel
    {
        public int BidId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public DateTime BidTime { get; set; }
        public decimal Amount { get; set; }
    }
}