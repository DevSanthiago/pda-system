using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PdaSystem.API.Models;

[Table("PD_usuario")]
public class User
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("USUARIO")]
    [Required]
    [MaxLength(100)]
    public string Usuario { get; set; } = string.Empty;

    [Column("SENHA")]
    [Required]
    public string Senha { get; set; } = string.Empty;

    [Column("TIPO_ACESSO")]
    [MaxLength(20)]
    public string TipoAcesso { get; set; } = "OPERADOR";
}