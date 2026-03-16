namespace PdaSystem.API.DTOs.Auth;

public record AuthRegisterRequest(string Usuario, string Senha);

public record AuthLoginRequest(string Usuario, string Senha);

public record AuthLoginResponse(string Message, string Token, long ExpiresIn);