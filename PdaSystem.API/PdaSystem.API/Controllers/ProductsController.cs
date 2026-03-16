using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PdaSystem.API.Data;
using PdaSystem.API.DTOs.Products;
using PdaSystem.API.Models;

namespace PdaSystem.API.Controllers;

[ApiController]
[Route("api/products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    private string GetCurrentUsername()
        => User.FindFirst("usuario")!.Value;

    [HttpGet]
    public async Task<IActionResult> GetProductByName([FromQuery] string produto)
    {
        if (string.IsNullOrWhiteSpace(produto))
            return BadRequest(new { message = "Nome do produto não fornecido." });

        var product = await _context.Products
            .Where(p => p.Produto == produto)
            .OrderByDescending(p => p.DataHora)
            .FirstOrDefaultAsync();

        if (product is null)
            return NotFound(new { message = "Produto não encontrado." });

        return Ok(new ProductResponse(
            product.Id, product.Produto, product.PesoMinMenor, product.PesoMaxMenor,
            product.PesoStartMenor, product.PesoMinMaior, product.PesoMaxMaior,
            product.PesoStartMaior, product.TamanhoFonte, product.Revisao,
            product.DataHora, product.Usuario
        ));
    }

    [HttpPost]
    [Authorize(Policy = "AdminOrHokage")]
    public async Task<IActionResult> CreateProduct([FromBody] ProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Produto))
            return BadRequest(new { message = "Dados do produto incompletos." });

        var exists = await _context.Products.AnyAsync(p => p.Produto == request.Produto);
        if (exists)
            return Conflict(new { message = "Não foi possível cadastrar o produto. Ele já existe." });

        var product = new Product
        {
            Produto = request.Produto,
            PesoMinMenor = request.PesoMinMenor,
            PesoMaxMenor = request.PesoMaxMenor,
            PesoStartMenor = request.PesoStartMenor,
            PesoMinMaior = request.PesoMinMaior,
            PesoMaxMaior = request.PesoMaxMaior,
            PesoStartMaior = request.PesoStartMaior,
            TamanhoFonte = request.TamanhoFonte,
            Revisao = request.Revisao,
            DataHora = DateTime.Now,
            Usuario = GetCurrentUsername()
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return StatusCode(201, new { message = "Produto cadastrado com sucesso." });
    }

    [HttpPut]
    [Authorize(Policy = "AdminOrHokage")]
    public async Task<IActionResult> UpdateProduct([FromBody] ProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Produto))
            return BadRequest(new { message = "Dados do produto incompletos." });

        var product = await _context.Products
            .Where(p => p.Produto == request.Produto)
            .OrderByDescending(p => p.DataHora)
            .FirstOrDefaultAsync();

        if (product is null)
            return NotFound(new { message = "Produto não encontrado." });

        product.PesoMinMenor = request.PesoMinMenor;
        product.PesoMaxMenor = request.PesoMaxMenor;
        product.PesoStartMenor = request.PesoStartMenor;
        product.PesoMinMaior = request.PesoMinMaior;
        product.PesoMaxMaior = request.PesoMaxMaior;
        product.PesoStartMaior = request.PesoStartMaior;
        product.TamanhoFonte = request.TamanhoFonte;
        product.Revisao = request.Revisao;
        product.DataHora = DateTime.Now;
        product.Usuario = GetCurrentUsername();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Produto atualizado com sucesso." });
    }

    [HttpDelete]
    [Authorize(Policy = "HokageOnly")]
    public async Task<IActionResult> DeleteProduct([FromBody] DeleteProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Produto))
            return BadRequest(new { message = "Código do produto não fornecido." });

        var products = await _context.Products
            .Where(p => p.Produto == request.Produto)
            .ToListAsync();

        if (!products.Any())
            return NotFound(new { message = "Produto não encontrado ou não pôde ser excluído." });

        _context.Products.RemoveRange(products);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Produto excluído com sucesso." });
    }
}

public record DeleteProductRequest(string Produto);