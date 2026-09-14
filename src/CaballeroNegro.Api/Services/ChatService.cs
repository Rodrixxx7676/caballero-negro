using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using CaballeroNegro.Api.Models;
using Microsoft.Extensions.Options;

namespace CaballeroNegro.Api.Services;

/// <summary>
/// Asistente de la carta: responde con un modelo económico de OpenAI usando
/// la carta como contexto. Sin SDK: una llamada HTTP a chat/completions.
/// </summary>
public sealed class ChatService
{
    private const int MaxHistory = 12;      // turnos que se reenvían al modelo
    private const int MaxMessageChars = 600; // largo máximo de cada mensaje del usuario

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private readonly HttpClient _http;
    private readonly OpenAiOptions _options;
    private readonly string _systemPrompt;
    private readonly ILogger<ChatService> _logger;

    public ChatService(HttpClient http, IOptions<OpenAiOptions> options, MenuService menu, SiteService site, ILogger<ChatService> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
        _systemPrompt = BuildSystemPrompt(menu.GetMenu(), site.GetSite());

        _http.BaseAddress = new Uri(_options.BaseUrl);
        _http.Timeout = TimeSpan.FromSeconds(30);
        if (_options.IsConfigured)
        {
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        }
    }

    public bool IsAvailable => _options.IsConfigured;

    public async Task<string> ReplyAsync(IReadOnlyList<ChatMessage> history, CancellationToken ct)
    {
        var messages = new List<object> { new { role = "system", content = _systemPrompt } };

        foreach (var m in history.TakeLast(MaxHistory))
        {
            var role = m.Role is "assistant" ? "assistant" : "user";
            var content = m.Content.Trim();
            if (content.Length == 0) continue;
            if (content.Length > MaxMessageChars) content = content[..MaxMessageChars];
            messages.Add(new { role, content });
        }

        var body = new
        {
            model = _options.Model,
            messages,
            max_tokens = _options.MaxOutputTokens,
            temperature = 0.4,
        };

        using var response = await _http.PostAsJsonAsync("chat/completions", body, JsonOptions, ct);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(ct);
            _logger.LogWarning("OpenAI respondió {Status}: {Error}", (int)response.StatusCode, error);
            throw new HttpRequestException($"OpenAI respondió {(int)response.StatusCode}.");
        }

        var completion = await response.Content.ReadFromJsonAsync<CompletionResponse>(JsonOptions, ct);
        var reply = completion?.Choices?.FirstOrDefault()?.Message?.Content?.Trim();
        return string.IsNullOrEmpty(reply)
            ? "Disculpa, no pude responder en este momento. ¿Me lo repites?"
            : reply;
    }

    /// <summary>Carta y datos del local en texto compacto, para que el modelo responda con información real.</summary>
    private static string BuildSystemPrompt(Menu menu, Site site)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"Eres el asistente virtual de {site.Name}, restaurante de pastas y pizzas en {site.Location.District} (Perú). " +
                      "Fusión de tradición italiana con sabor peruano, más de diez años de trayectoria; empezó como una kombi Volkswagen haciendo pizzas en eventos.");
        sb.AppendLine("Responde SIEMPRE en español, con calidez y brevedad (máximo 4 o 5 líneas), como un mozo amable. " +
                      "Usa únicamente la carta de abajo para platos, ingredientes y precios; los precios están en soles (S/.). " +
                      "Si te preguntan por algo que no está en la carta, dilo con honestidad y sugiere una alternativa de la carta. " +
                      "No tomas pedidos ni reservas ni cobras: para eso invita a escribir por WhatsApp. " +
                      "Para dirección, horario y contacto usa solo los DATOS DEL LOCAL; no inventes nada más.");
        sb.AppendLine();
        sb.AppendLine("DATOS DEL LOCAL:");
        sb.AppendLine($"- Dirección: {site.Location.Address}, {site.Location.District}. Referencia: {site.Location.Reference}.");
        foreach (var d in site.Location.Directions) sb.AppendLine($"- Cómo llegar: {d}");
        foreach (var h in site.Location.Hours) sb.AppendLine($"- Horario: {h.Days}, de {h.Open} a {h.Close}.");
        sb.AppendLine($"- Teléfonos: {string.Join(" / ", site.Contact.Phones)}. WhatsApp: +{site.Contact.Whatsapp}.");
        sb.AppendLine($"- Instagram: @{site.Contact.Instagram}. Facebook: {site.Contact.Facebook}. TikTok: @{site.Contact.Tiktok}.");
        sb.AppendLine();
        sb.AppendLine("CARTA:");

        foreach (var c in menu.Categories)
        {
            sb.AppendLine($"## {c.Name}");
            if (c.Intro is { Count: > 0 }) sb.AppendLine(string.Join(' ', c.Intro));

            foreach (var item in c.Items ?? []) AppendItem(sb, item);

            foreach (var g in c.Groups ?? [])
            {
                sb.AppendLine($"### {g.Name}");
                foreach (var item in g.Items) AppendItem(sb, item);
                if (g.Note is not null) sb.AppendLine(g.Note);
            }

            if (c.Note is not null) sb.AppendLine($"{c.Note.Title}: {string.Join(", ", c.Note.Options)}.");
            if (c.Notes is { Count: > 0 }) sb.AppendLine(string.Join(' ', c.Notes));
        }

        return sb.ToString();
    }

    private static void AppendItem(StringBuilder sb, MenuItem item)
    {
        sb.Append("- ").Append(item.Name);
        if (item.Subtitle is not null) sb.Append(" (").Append(item.Subtitle).Append(')');
        if (item.Price is { } price) sb.Append(": S/.").Append(price);
        if (item.Prices is not null)
            sb.Append(": ").Append(string.Join(", ", item.Prices.Select(p => $"{p.Key} S/.{p.Value}")));
        if (item.Description is not null) sb.Append(" — ").Append(item.Description);
        if (item.Highlight) sb.Append(" [especialidad de la casa]");
        sb.AppendLine();
    }

    private sealed record CompletionResponse(IReadOnlyList<Choice>? Choices);
    private sealed record Choice(ChoiceMessage? Message);
    private sealed record ChoiceMessage(string? Content);
}
