using System.Reflection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Data.Context;
using Domain.Handler;
using Domain.Interface;
using GestionUtilisateur.Data.Repository;
using API.Mapper;
using Domain.Queries;
using Domain.Commands;
using MediatR;
using Domain.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using API.Services;
using System.Text.Json.Serialization;
using API.Hubs;


var builder = WebApplication.CreateBuilder(args);
// Add DbContext to the container
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions => sqlOptions.MigrationsAssembly("API")));
// Register the repository implementation (open generic registration)
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
// Add MediatR scanning for both assemblies
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()); // API assembly
});
builder.Services
    .RegisterGenericHandlerFor<User>()
    .RegisterGenericHandlerFor<Project>()
    .RegisterGenericHandlerFor<Member>()
    .RegisterGenericHandlerFor<Sprint>()
    .RegisterGenericHandlerFor<Ticket>()
    .RegisterGenericHandlerFor<TicketMember>()
    .RegisterGenericHandlerFor<FilesAttachment>()
    .RegisterGenericHandlerFor<Message>() // Message handler registration
    .RegisterGenericHandlerFor<Notification>() // Add Notification handler registration
    .RegisterGenericHandlerFor<UserNotification>(); // Add UserNotification handler registration

// Add SignalR
builder.Services.AddSignalR();

// Register notification service
builder.Services.AddScoped<IProjectNotification, NotificationService>();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MapperProfiles));
//CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Added for SignalR support
    });
});
// JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };

    // Configure JWT Bearer for SignalR
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // If the request is for the chat hub or notification hub, get the token from the query string
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/chatHub") || path.StartsWithSegments("/notificationHub")))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});
// Add in-memory caching
builder.Services.AddMemoryCache();
builder.Services.AddScoped<OtpService>();
builder.Services.AddScoped<API.Services.TokenService>();
// Add controllers and Swagger
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
    .WithOrigins("http://localhost:4200")
    .AllowCredentials()); // Add AllowCredentials for SignalR
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub"); // Chat hub endpoint
app.MapHub<NotificationHub>("/notificationHub"); // Add Notification hub endpoint
app.Run();