namespace PdaSystem.API.DTOs.Products;

public record ProductRequest(
    string Produto,
    string? PesoMinMenor,
    string? PesoMaxMenor,
    string? PesoStartMenor,
    string? PesoMinMaior,
    string? PesoMaxMaior,
    string? PesoStartMaior,
    string? TamanhoFonte,
    int? Revisao
);

public record ProductResponse(
    int Id,
    string? Produto,
    string? PesoMinMenor,
    string? PesoMaxMenor,
    string? PesoStartMenor,
    string? PesoMinMaior,
    string? PesoMaxMaior,
    string? PesoStartMaior,
    string? TamanhoFonte,
    int? Revisao,
    DateTime? DataHora,
    string? Usuario
);