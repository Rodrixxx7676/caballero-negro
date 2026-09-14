namespace CaballeroNegro.Api.Models;

/// <summary>Datos del restaurante (historia, ubicación, contacto). Fuente: Data/site.json.</summary>
public sealed record Site(
    string Name,
    string Slogan,
    string Founded,
    IReadOnlyList<string> Story,
    IReadOnlyList<SiteValue> Values,
    Location Location,
    Contact Contact);

public sealed record SiteValue(string Title, string Text);

public sealed record Location(
    string Address,
    string District,
    string Reference,
    IReadOnlyList<string> Directions,
    string MapQuery,
    IReadOnlyList<OpeningHours> Hours);

public sealed record OpeningHours(string Days, string Open, string Close);

public sealed record Contact(
    IReadOnlyList<string> Phones,
    string Whatsapp,
    string WhatsappMessage,
    string Instagram,
    string Facebook,
    string Tiktok);
