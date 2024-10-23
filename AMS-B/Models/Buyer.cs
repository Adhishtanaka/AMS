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

        public static async Task<List<BidDto>> GetBidHistory(Dbcon dbcon, int buyerId)
        {
            List<BidDto> bidHistory = new List<BidDto>();

            string query = @"
        SELECT 
            b.bidid AS BidId,
            b.aucid AS AucId,
            b.userid AS UserId,
            b.bidtime AS BidTime,
            b.amount AS Amount,
            us.name AS UserName,
            a.startdate AS AuctionStartDate,
            a.enddate AS AuctionEndDate,
            c.car_title AS CarTitle,
            c.img AS Img,
            m.model_name AS ModelName,
            ma.name AS ManufacturerName,
            c.year AS Year
        FROM 
            bid b
        JOIN 
            auction a ON b.aucid = a.aucid
        JOIN 
            car c ON a.car_id = c.id
        JOIN 
            user us ON b.userid = us.userid
        JOIN 
            model m ON c.model_id = m.model_id
        JOIN 
            manufacturer ma ON m.manufacturer_id = ma.id
        WHERE 
            b.userid = @buyerId
        ORDER BY 
            b.bidtime DESC;";

            var parameters = new Dictionary<string, object> { { "@buyerId", buyerId } };

            await dbcon.Connect();

            
            List<int> aucIds = new List<int>(); 
            using (var reader = await dbcon.ExecuteQuery(query, parameters))
            {
                while (await reader.ReadAsync())
                {
                    BidDto bidDto = new BidDto
                    {
                        BidId = reader.GetInt32(reader.GetOrdinal("BidId")),
                        AucId = reader.GetInt32(reader.GetOrdinal("AucId")),
                        UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                        UserName = reader.GetString(reader.GetOrdinal("UserName")),
                        BidTime = reader.GetDateTime(reader.GetOrdinal("BidTime")),
                        Amount = reader.GetDecimal(reader.GetOrdinal("Amount"))
                    };

                    bidHistory.Add(bidDto);
                    aucIds.Add(bidDto.AucId); 
                }
            }

            foreach (var bid in bidHistory)
            {
                bid.AuctionDetails = await Auction.GetAuctionById(dbcon, bid.AucId);
            }

            await dbcon.Disconnect();
            return bidHistory;
        }

        public static async Task<BidDto> GetBidById(Dbcon dbcon, int bidId)
        {
            string query = @"
        SELECT 
            b.bidid AS BidId,
            b.aucid AS AucId,
            b.userid AS UserId,
            b.bidtime AS BidTime,
            b.amount AS Amount,
            us.name AS UserName,
            a.startdate AS AuctionStartDate,
            a.enddate AS AuctionEndDate,
            c.car_title AS CarTitle,
            c.img AS Img,
            m.model_name AS ModelName,
            ma.name AS ManufacturerName,
            c.year AS Year
        FROM 
            bid b
        JOIN 
            auction a ON b.aucid = a.aucid
        JOIN 
            car c ON a.car_id = c.id
        JOIN 
            user us ON b.userid = us.userid
        JOIN 
            model m ON c.model_id = m.model_id
        JOIN 
            manufacturer ma ON m.manufacturer_id = ma.id
        WHERE 
            b.bidid = @bidId;";

            var parameters = new Dictionary<string, object> { { "@bidId", bidId } };

            await dbcon.Connect();
            try
            {
                using (var reader = await dbcon.ExecuteQuery(query, parameters))
                {
                    if (await reader.ReadAsync())
                    {
                        BidDto bidDto = new BidDto
                        {
                            BidId = reader.GetInt32(reader.GetOrdinal("BidId")),
                            AucId = reader.GetInt32(reader.GetOrdinal("AucId")),
                            UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                            UserName = reader.GetString(reader.GetOrdinal("UserName")),
                            BidTime = reader.GetDateTime(reader.GetOrdinal("BidTime")),
                            Amount = reader.GetDecimal(reader.GetOrdinal("Amount"))
                        };

                        bidDto.AuctionDetails = await Auction.GetAuctionById(dbcon, bidDto.AucId);

                        return bidDto;
                    }
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving bid: {ex.Message}");
                throw;
            }
            finally
            {
                await dbcon.Disconnect();
            }
        }

    }

}