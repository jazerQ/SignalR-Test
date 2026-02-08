using SignalR.Back.Hubs;

var builder = WebApplication.CreateBuilder(args);

/* Установим Redis */
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

/* Установим CORS */
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

app.UseCors();

app.MapHub<ChatHub>("/chat");

app.Run();