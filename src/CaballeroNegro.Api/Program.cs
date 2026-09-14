using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using CaballeroNegro.Api.Models;
using CaballeroNegro.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Elastic Beanstalk (.NET en Linux) expone el puerto en la variable PORT.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddSingleton<MenuService>();
builder.Services.AddSingleton<SiteService>();

// Chatbot: la clave llega por user-secrets (local) o variable OpenAI__ApiKey (Beanstalk).
builder.Services.Configure<OpenAiOptions>(builder.Configuration.GetSection(OpenAiOptions.Section));
builder.Services.AddHttpClient<ChatService>();

// Protege el presupuesto de OpenAI: 10 mensajes por minuto por IP.
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("chat", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "anon",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1) }));
});
builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

var app = builder.Build();

app.UseRateLimiter();
app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");

api.MapGet("/health", () => Results.Ok(new { status = "ok" }));

api.MapGet("/menu", (MenuService menu) => Results.Ok(menu.GetMenu()));

api.MapGet("/menu/{categoryId}", (string categoryId, MenuService menu) =>
    menu.GetCategory(categoryId) is { } category
        ? Results.Ok(category)
        : Results.NotFound(new { message = $"No existe la categoría '{categoryId}'." }));

api.MapGet("/site", (SiteService site) => Results.Ok(site.GetSite()));

api.MapGet("/chat/status", (ChatService chat) => Results.Ok(new { available = chat.IsAvailable }));

api.MapPost("/chat", async (ChatRequest request, ChatService chat, CancellationToken ct) =>
{
    if (!chat.IsAvailable)
        return Results.Json(new { message = "El asistente no está disponible por ahora." }, statusCode: 503);

    if (request.Messages is not { Count: > 0 } || request.Messages[^1].Role != "user")
        return Results.BadRequest(new { message = "Envía al menos un mensaje del usuario." });

    try
    {
        var reply = await chat.ReplyAsync(request.Messages, ct);
        return Results.Ok(new ChatResponse(reply));
    }
    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
    {
        return Results.Json(new { message = "No pude conectar con el asistente. Intenta de nuevo en un momento." }, statusCode: 502);
    }
}).RequireRateLimiting("chat");

// Cualquier ruta que no sea /api la resuelve el cliente React (SPA).
app.MapFallbackToFile("index.html");

app.Run();
