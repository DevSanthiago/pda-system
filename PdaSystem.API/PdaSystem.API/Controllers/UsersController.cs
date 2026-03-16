using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PdaSystem.API.Data;
using PdaSystem.API.DTOs.Users;
using PdaSystem.API.Models;

namespace PdaSystem.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
        => int.Parse(User.FindFirst("id")!.Value);

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetCurrentUserId();
        var user = await _context.Users.FindAsync(userId);

        if (user is null)
            return NotFound(new { message = "Usuário não encontrado." });

        return Ok(new UserResponse(user.Id, user.Usuario, user.TipoAcesso));
    }

    [HttpGet]
    [Authorize(Policy = "HokageOnly")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new UserResponse(u.Id, u.Usuario, u.TipoAcesso))
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost]
    [Authorize(Policy = "HokageOnly")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        var exists = await _context.Users.AnyAsync(u => u.Usuario == request.Usuario);
        if (exists)
            return Conflict(new { message = "Usuário já existe." });

        var user = new User
        {
            Usuario = request.Usuario,
            Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha),
            TipoAcesso = request.TipoAcesso
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return StatusCode(201, new { message = "Usuário criado com sucesso." });
    }

    [HttpPut]
    [Authorize(Policy = "HokageOnly")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(request.Id);
        if (user is null)
            return NotFound(new { message = "Usuário não encontrado." });

        if (!string.IsNullOrEmpty(request.Senha))
            user.Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha);

        if (!string.IsNullOrEmpty(request.TipoAcesso))
            user.TipoAcesso = request.TipoAcesso;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Usuário atualizado com sucesso." });
    }

    [HttpDelete]
    [Authorize(Policy = "HokageOnly")]
    public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequest request)
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId == request.Id)
            return BadRequest(new { message = "Você não pode excluir a si mesmo." });

        var user = await _context.Users.FindAsync(request.Id);
        if (user is null)
            return NotFound(new { message = "Usuário não encontrado." });

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Usuário excluído com sucesso." });
    }
}

public record DeleteUserRequest(int Id);