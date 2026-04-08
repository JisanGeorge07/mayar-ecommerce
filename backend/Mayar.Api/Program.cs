using CloudinaryDotNet;
using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Interfaces;
using Mayar.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Mayar App API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token in the text input below.\n\nExample: **Bearer eyJhbGci...**"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 43))
    )
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["AppSettings:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["AppSettings:Audience"],
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!)),
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Cloudinary config from appsettings
var cloudName = builder.Configuration["Cloudinary:CloudName"];
var apiKey = builder.Configuration["Cloudinary:ApiKey"];
var apiSecret = builder.Configuration["Cloudinary:ApiSecret"];

var account = new Account(cloudName, apiKey, apiSecret);
var cloudinary = new Cloudinary(account);
builder.Services.AddSingleton(cloudinary);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IHeroSlideService, HeroSlideService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductImageService, ProductImageService>();
builder.Services.AddScoped<IProductColorService, ProductColorService>();
builder.Services.AddScoped<IProductSizeService, ProductSizeService>();
builder.Services.AddScoped<IProductFeatureService, ProductFeatureService>();
builder.Services.AddScoped<IProductSpecificationService, ProductSpecificationService>();
builder.Services.AddScoped<IProductCareInstructionService, ProductCareInstructionService>();
builder.Services.AddScoped<IProductVariantService, ProductVariantService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IRecentlyViewedService, RecentlyViewedService>();
builder.Services.AddScoped<INewsLetterService, NewsLetterService>();
builder.Services.AddScoped<IPromoBannerService, PromoBannerService>();
builder.Services.AddScoped<IShopByCategoryService, ShopByCategoryService>();
builder.Services.AddScoped<IAddressService, AddressService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IContentPageService, ContentPageService>();
builder.Services.AddScoped<IAboutService, AboutService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ICouponCodeService, CouponCodeService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();

// Email Service configuration
builder.Services.Configure<EmailSettingsDto>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();

// Register HttpClient for MyFatoorah
builder.Services.AddHttpClient("MyFatoorah");

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [])
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint
app.MapGet("/", () => Results.Ok(new
{
    message = "Mayar API is running",
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

app.Run();