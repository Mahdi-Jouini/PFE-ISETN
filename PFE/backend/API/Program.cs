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

builder.Services.AddTransient<IRequestHandler<GetByIDGeneric<Utilisateur>, Utilisateur>,
    GetGenericByIDHandler<Utilisateur>>();

// If you explicitly registered the handler for Utilisateur (closed version), you can do:
builder.Services.AddTransient<
    MediatR.IRequestHandler<GetAllGeneric<Utilisateur>, IEnumerable<Domain.Models.Utilisateur>>,
    GetAllGenericHandler<Utilisateur>>();

builder.Services.AddTransient<IRequestHandler<PostGeneric<Utilisateur>, string>, PostGenericHandler<Utilisateur>>();



// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MapperProfiles));

//CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
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
});
builder.Services.AddScoped<API.Services.TokenService>();

// Add controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
//app.UseCors("AllowAngular"); 
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
