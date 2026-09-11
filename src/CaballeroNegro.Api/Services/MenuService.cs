using System.Text.Json;
using CaballeroNegro.Api.Models;

namespace CaballeroNegro.Api.Services;

/// <summary>
/// Lee la carta desde <c>Data/menu.json</c> una sola vez al arrancar.
/// Cuando la carta pase a base de datos, solo cambia esta clase.
/// </summary>
public sealed class MenuService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly Menu _menu;

    public MenuService(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "menu.json");
        using var stream = File.OpenRead(path);
        var menu = JsonSerializer.Deserialize<Menu>(stream, JsonOptions)
            ?? throw new InvalidOperationException($"No se pudo leer la carta en {path}.");

        // Contrato para el cliente: toda categoría trae `items`, aunque sus productos vayan en `groups`.
        _menu = menu with
        {
            Categories = menu.Categories.Select(c => c with { Items = c.Items ?? [] }).ToList(),
        };
    }

    public Menu GetMenu() => _menu;

    public Category? GetCategory(string id) =>
        _menu.Categories.FirstOrDefault(c => string.Equals(c.Id, id, StringComparison.OrdinalIgnoreCase));
}
