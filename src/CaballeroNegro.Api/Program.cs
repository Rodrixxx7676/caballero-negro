using System.Text.Json.Serialization;
using CaballeroNegro.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Elastic Beanstalk (.NET en Linux) expone el puerto en la variable PORT.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddSingleton<MenuService>();
builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");

api.MapGet("/health", () => Results.Ok(new { status = "ok" }));

api.MapGet("/menu", (MenuService menu) => Results.Ok(menu.GetMenu()));

api.MapGet("/menu/{categoryId}", (string categoryId, MenuService menu) =>
    menu.GetCategory(categoryId) is { } category
        ? Results.Ok(category)
        : Results.NotFound(new { message = $"No existe la categoría '{categoryId}'." }));

// Cualquier ruta que no sea /api la resuelve el cliente React (SPA).
app.MapFallbackToFile("index.html");

app.Run();
