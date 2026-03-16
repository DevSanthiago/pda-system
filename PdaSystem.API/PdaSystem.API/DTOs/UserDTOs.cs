namespace PdaSystem.API.DTOs.Users;

public record UserResponse(int Id, string Usuario, string TipoAcesso);

public record CreateUserRequest(string Usuario, string Senha, string TipoAcesso = "OPERADOR");

public record UpdateUserRequest(int Id, string? Senha, string? TipoAcesso);