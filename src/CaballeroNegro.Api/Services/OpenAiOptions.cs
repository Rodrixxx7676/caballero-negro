namespace CaballeroNegro.Api.Services;

/// <summary>
/// Sección "OpenAI" de la configuración. La clave NUNCA va en appsettings:
/// en local, <c>dotnet user-secrets set "OpenAI:ApiKey" "..."</c>;
/// en Beanstalk, propiedad de entorno <c>OpenAI__ApiKey</c>.
/// </summary>
public sealed class OpenAiOptions
{
    public const string Section = "OpenAI";

    public string? ApiKey { get; set; }
    public string Model { get; set; } = "gpt-4.1-mini";
    public string BaseUrl { get; set; } = "https://api.openai.com/v1/";
    public int MaxOutputTokens { get; set; } = 400;

    public bool IsConfigured => !string.IsNullOrWhiteSpace(ApiKey);
}
