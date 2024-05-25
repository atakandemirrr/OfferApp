using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using OfferApp.Models;
using System.Globalization;
using System.Reflection;



    

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DataConnection")));


builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "NetCoreMvc.Auth";
        options.LoginPath = "/Login/LoginProcedures";
        options.AccessDeniedPath = "/Panel/PanelPage";
    });

//Role için eklendi
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});


// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

var culture = new CultureInfo("tr-TR");
culture.NumberFormat.NumberDecimalSeparator = ".";
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=LoginProcedures}/{id?}");

app.Run();
