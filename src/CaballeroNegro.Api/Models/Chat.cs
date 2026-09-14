namespace CaballeroNegro.Api.Models;

/// <summary>Un turno de la conversación tal como lo envía el cliente.</summary>
public sealed record ChatMessage(string Role, string Content);

public sealed record ChatRequest(IReadOnlyList<ChatMessage> Messages);

public sealed record ChatResponse(string Reply);
