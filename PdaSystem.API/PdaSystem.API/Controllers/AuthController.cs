using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PdaSystem.API.Data;
using PdaSystem.API.DTOs.Auth;
using PdaSystem.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PdaSystem.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Senha))
            return BadRequest(new { message = "Dados incompletos. Por favor, envie usuário e senha." });

        var exists = await _context.Users.AnyAsync(u => u.Usuario == request.Usuario);
        if (exists)
            return Conflict(new { message = "Usuário já existe." });

        var user = new User
        {
            Usuario = request.Usuario,
            Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha),
            TipoAcesso = "OPERADOR"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return StatusCode(201, new { message = "Usuário cadastrado com sucesso." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Senha))
            return BadRequest(new { message = "Dados incompletos." });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Usuario == request.Usuario);
        if (user is null)
            return Unauthorized(new { message = "Login falhou. Verifique suas credenciais." });

        bool passwordValid;
        bool needsUpgrade = false;

        if (user.Senha.StartsWith("$2"))
        {
            passwordValid = BCrypt.Net.BCrypt.Verify(request.Senha, user.Senha);
        }
        else
        {
            passwordValid = request.Senha == user.Senha.Trim();
            needsUpgrade = passwordValid;
        }

        if (!passwordValid)
            return Unauthorized(new { message = "Login falhou. Verifique suas credenciais." });

        if (needsUpgrade)
        {
            user.Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha);
            await _context.SaveChangesAsync();
        }

        var token = GenerateJwtToken(user);
        var expiresIn = DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds();

        return Ok(new AuthLoginResponse("Login bem-sucedido.", token, expiresIn));
    }

    private string GenerateJwtToken(User user)
    {
        var secret = _config["Jwt:Secret"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim("usuario", user.Usuario),
            new Claim("role", user.TipoAcesso.Trim())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}