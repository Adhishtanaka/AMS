using AWS_B.model;


namespace AWS_B
{
    public static class SellerController
    {
        public static async Task<IResult> GetCarsBySellerId(HttpContext httpContext, Dbcon dbcon)
        {
            if (!int.TryParse(httpContext.Request.Query["sellerId"], out int sellerId))
            {
                return Results.BadRequest(new { Message = "Invalid seller ID." });
            }

            List<Car> cars = await Seller.GetCarsBySellerId(dbcon, sellerId);
            if (cars == null || cars.Count == 0)
            {
                return Results.NotFound(new { Message = "No cars found for this seller." });
            }

            return Results.Ok(cars);
        }

        public static async Task<IResult> GetAuctionsBySellerId(HttpContext httpContext, Dbcon dbcon)
        {
            if (!int.TryParse(httpContext.Request.Query["sellerId"], out int sellerId))
            {
                return Results.BadRequest(new { Message = "Invalid seller ID." });
            }

            List<Auction> auctions = await Seller.GetAuctionsBySellerId(dbcon, sellerId);
            if (auctions == null || auctions.Count == 0)
            {
                return Results.NotFound(new { Message = "No auctions found for this seller." });
            }

            return Results.Ok(auctions);
        }

        public static async Task<IResult> AddCar(HttpContext httpContext, Dbcon dbcon)
        {
            var car = await httpContext.Request.ReadFromJsonAsync<Car>();
            if (car == null)
            {
                return Results.BadRequest(new { Message = "Invalid car data." });
            }

            if (!int.TryParse(httpContext.Request.Query["sellerId"], out int sellerId) || car.UserId != sellerId)
            {
                return Results.Forbid();
            }

            await Car.AddCar(dbcon, car);
            return Results.Ok(new { Message = "Car added successfully." });
        }

        public static async Task<IResult> DeleteCar(HttpContext httpContext, Dbcon dbcon)
        {
            if (!int.TryParse(httpContext.Request.Query["carId"], out int carId) ||
                !int.TryParse(httpContext.Request.Query["sellerId"], out int sellerId))
            {
                return Results.BadRequest(new { Message = "Invalid car ID or seller ID." });
            }

            var car = await Car.GetCar(dbcon, carId);
            if (car == null || car.UserId != sellerId)
            {
                return Results.Forbid();
            }

            await Car.DeleteCar(dbcon, carId);
            return Results.Ok(new { Message = "Car deleted successfully." });
        }

        public static async Task<IResult> UpdateCar(HttpContext httpContext, Dbcon dbcon)
        {
            var car = await httpContext.Request.ReadFromJsonAsync<Car>();
            if (car == null || car.ProductId <= 0)
            {
                return Results.BadRequest(new { Message = "Invalid car data." });
            }

            var existingCar = await Car.GetCar(dbcon, car.ProductId);
            if (existingCar == null || existingCar.UserId != car.UserId)
            {
                return Results.Forbid();
            }

            await Car.UpdateCar(dbcon, car);
            return Results.Ok(new { Message = "Car updated successfully." });
        }

        public static async Task<IResult> CreateAuction(HttpContext httpContext, Dbcon dbcon)
        {
            var auction = await httpContext.Request.ReadFromJsonAsync<Auction>();
            if (auction == null)
            {
                return Results.BadRequest(new { Message = "Invalid auction data." });
            }

            var car = await Car.GetCar(dbcon, auction.ProductId);
            if (car == null || car.UserId != auction.ProductId)
            {
                return Results.Forbid();
            }

            await Auction.createAuction(dbcon, auction);
            return Results.Ok(new { Message = "Auction created successfully." });
        }

        public static async Task<IResult> DeleteAuction(HttpContext httpContext, Dbcon dbcon)
        {
            if (!int.TryParse(httpContext.Request.Query["auctionId"], out int auctionId) ||
                !int.TryParse(httpContext.Request.Query["sellerId"], out int sellerId))
            {
                return Results.BadRequest(new { Message = "Invalid auction ID or seller ID." });
            }

            var auction = await Auction.GetAuctionById(dbcon, auctionId);
            if (auction == null)
            {
                return Results.NotFound(new { Message = "Auction not found." });
            }

            var car = await Car.GetCar(dbcon, auction.ProductId);
            if (car == null || car.UserId != sellerId)
            {
                return Results.Forbid();
            }

            await Auction.DeleteAuction(dbcon, auctionId);
            return Results.Ok(new { Message = "Auction deleted successfully." });
        }

        public static async Task<IResult> UpdateAuction(HttpContext httpContext, Dbcon dbcon)
        {
            var auction = await httpContext.Request.ReadFromJsonAsync<Auction>();
            if (auction == null || auction.AuctionId <= 0)
            {
                return Results.BadRequest(new { Message = "Invalid auction data." });
            }

            var car = await Car.GetCar(dbcon, auction.ProductId);
            if (car == null || car.UserId != auction.ProductId)
            {
                return Results.Forbid();
            }

            await Auction.UpdateAuction(dbcon, auction);
            return Results.Ok(new { Message = "Auction updated successfully." });
        }
    }
}
