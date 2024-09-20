using AMS_B.Middleware;
using AMS_B.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<Dbcon>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder => builder
        .WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseMiddleware<RBMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();
