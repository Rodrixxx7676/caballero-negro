namespace CaballeroNegro.Api.Models;

/// <summary>Carta completa tal como la consume el cliente React.</summary>
public sealed record Menu(Restaurant Restaurant, IReadOnlyList<Category> Categories);

public sealed record Restaurant(
    string Name,
    string Tagline,
    string Welcome,
    IReadOnlyList<string> Description,
    string Currency);

/// <summary>
/// Una sección de la carta. Según la sección, los productos van en
/// <see cref="Items"/> (la mayoría) o en <see cref="Groups"/> (bebidas).
/// </summary>
public sealed record Category(
    string Id,
    string Name,
    IReadOnlyList<MenuItem>? Items = null,
    IReadOnlyList<ItemGroup>? Groups = null,
    IReadOnlyList<string>? Sizes = null,
    IReadOnlyList<string>? Notes = null,
    IReadOnlyList<string>? Intro = null,
    CategoryNote? Note = null);

public sealed record ItemGroup(string Name, IReadOnlyList<MenuItem> Items, string? Note = null);

public sealed record CategoryNote(string Title, IReadOnlyList<string> Options);

/// <summary>
/// Un producto. Tiene <see cref="Price"/> único o <see cref="Prices"/> por tamaño (pizzas).
/// </summary>
public sealed record MenuItem(
    string Id,
    string Name,
    decimal? Price = null,
    IReadOnlyDictionary<string, decimal>? Prices = null,
    string? Description = null,
    string? Subtitle = null,
    bool Highlight = false);
