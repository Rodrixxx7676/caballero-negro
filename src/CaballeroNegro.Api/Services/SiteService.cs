using System.Text.Json;
using CaballeroNegro.Api.Models;

namespace CaballeroNegro.Api.Services;

/// <summary>Lee Data/site.json una sola vez al arrancar.</summary>
public sealed class SiteService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly Site _site;

    public SiteService(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "site.json");
        using var stream = File.OpenRead(path);
        _site = JsonSerializer.Deserialize<Site>(stream, JsonOptions)
            ?? throw new InvalidOperationException($"No se pudo leer {path}.");
    }

    public Site GetSite() => _site;
}
