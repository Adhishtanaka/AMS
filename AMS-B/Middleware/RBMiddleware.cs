namespace AMS_B.Middleware
{
    public class RBMiddleware
    {
        private readonly RequestDelegate _next;

        public RBMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var userRoleClaim = context.User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
            var path = context.Request.Path.Value;

            if (path.StartsWith("/seller", StringComparison.OrdinalIgnoreCase) && userRoleClaim != "seller")
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden; // Forbidden
                await context.Response.WriteAsync("Access denied. Seller role required.");
                return;
            }

            if (path.StartsWith("/buyer", StringComparison.OrdinalIgnoreCase) && userRoleClaim != "buyer")
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden; // Forbidden
                await context.Response.WriteAsync("Access denied. Buyer role required.");
                return;
            }

            if (path.StartsWith("/admin", StringComparison.OrdinalIgnoreCase) && userRoleClaim != "admin")
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden; // Forbidden
                await context.Response.WriteAsync("Access denied. Admin role required.");
                return;
            }

            await _next(context); // Call the next middleware
        }
    }
}
